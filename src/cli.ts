#!/usr/bin/env node

/**
 * personal-ai-skills CLI
 *
 * Universal AI skills installer for 20+ AI assistants.
 * Install skills, agents, commands, rules, and prompts.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { parseArgs } from "node:util";
import * as p from "@clack/prompts";
import type {
  ContentType,
  AssistantConfig,
  CatalogItem,
  InstallScope,
  InstallMethod,
  InstallSummary,
} from "./types.js";
import {
  getAllAssistants,
  detectInstalledAssistants,
  getAssistantsForContentType,
} from "./agents.js";
import {
  loadCatalog,
  loadContentType,
  getCatalogStats,
  searchCatalog,
} from "./catalog.js";
import {
  runInteractiveInstall,
  selectContentType,
  selectAssistants,
  selectScope,
  selectMethod,
  showInstallSuccess,
  showError,
  showInfo,
  startSpinner,
} from "./prompts.js";
import { installItems, uninstallItem } from "./install.js";
import { getInstalledItems, getInstalledItemsByType } from "./lock.js";
import { fetchSkillFromSource } from "./github.js";
import { generateBridgeFiles, writeBridgeFiles } from "./bridge.js";

// ============================================================================
// Version & Help
// ============================================================================

const VERSION = "1.0.0";

const HELP = `
personal-ai-skills - Universal AI skills installer

USAGE
  $ personal-ai-skills [command] [options]

COMMANDS
  add <source>      Install skills from GitHub, URL, or builtin catalog
  remove <name>     Remove installed skills
  list [type]       List available or installed items
  search <query>    Search the catalog
  bridge            Generate context files for detected editors
  update            Update all installed items
  init <type>       Create a new SKILL.md template
  serve             Launch web viewer (localhost:3000)

OPTIONS
  -g, --global      Install to user directory (global)
  -a, --agent       Target specific agents (comma-separated)
  -t, --type        Content type: skills, agents, commands, rules, prompts
  -y, --yes         Skip confirmation prompts
  --all             Install all items to all agents
  -v, --version     Show version
  -h, --help        Show help

EXAMPLES
  $ personal-ai-skills add clean-code          # Install builtin skill
  $ personal-ai-skills add user/repo           # Install from GitHub
  $ personal-ai-skills add ./my-skill          # Install from local path
  $ personal-ai-skills list                    # List all available items
  $ personal-ai-skills list skills             # List available skills
  $ personal-ai-skills list --installed        # List installed items
  $ personal-ai-skills remove clean-code       # Remove a skill
  $ personal-ai-skills bridge                  # Generate CLAUDE.md, .cursorrules, etc.
  $ personal-ai-skills serve                   # Launch web viewer

SUPPORTED ASSISTANTS (20+)
  Claude Code, GitHub Copilot, Cursor, Windsurf, Gemini CLI,
  Antigravity, Codex, Amp, Cline, Roo Code, Continue, Goose,
  OpenCode, Kiro, Trae, Augment, Droid, Kilo Code
`;

// ============================================================================
// CLI Argument Parsing
// ============================================================================

interface CliArgs {
  command: string;
  args: string[];
  options: {
    global: boolean;
    agents: string[];
    type?: ContentType;
    yes: boolean;
    all: boolean;
    installed: boolean;
    help: boolean;
    version: boolean;
  };
}

function parseCliArgs(): CliArgs {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      global: { type: "boolean", short: "g", default: false },
      agent: { type: "string", short: "a", multiple: true, default: [] },
      type: { type: "string", short: "t" },
      yes: { type: "boolean", short: "y", default: false },
      all: { type: "boolean", default: false },
      installed: { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
      version: { type: "boolean", short: "v", default: false },
    },
  });

  const command = positionals[0] || "";
  const args = positionals.slice(1);

  return {
    command,
    args,
    options: {
      global: values.global ?? false,
      agents: (values.agent as string[]) || [],
      type: values.type as ContentType | undefined,
      yes: values.yes ?? false,
      all: values.all ?? false,
      installed: values.installed ?? false,
      help: values.help ?? false,
      version: values.version ?? false,
    },
  };
}

// ============================================================================
// Commands
// ============================================================================

/** Content type shortcut commands (e.g. `personal-ai-skills agents add`) */
const CONTENT_TYPE_SHORTCUTS: ContentType[] = [
  "agents",
  "commands",
  "rules",
  "prompts",
];

/**
 * Handle install result: stop spinner, report failures, show success
 */
function handleInstallResult(
  result: InstallSummary,
  spinner: ReturnType<typeof startSpinner>,
  items?: CatalogItem[],
  assistants?: AssistantConfig[],
): void {
  if (result.failed > 0) {
    spinner.stop(`Installed ${result.successful}/${result.total} items`);
    for (const r of result.results.filter((r) => !r.success)) {
      showError(`Failed: ${r.item.name} → ${r.assistant.name}: ${r.error}`);
    }
  } else {
    spinner.stop(`Successfully installed ${result.successful} items`);
    if (items && assistants) {
      showInstallSuccess(items, assistants);
    }
  }
}

/**
 * Add/Install command
 */
async function cmdAdd(
  args: string[],
  options: CliArgs["options"],
): Promise<void> {
  const source = args[0];

  // --all flag: install everything non-interactively
  if (!source && options.all) {
    const contentType = options.type || "skills";
    const items = await loadContentType(contentType);

    if (items.length === 0) {
      showError(`No ${contentType} available`);
      return;
    }

    const assistants =
      options.agents.length > 0
        ? getAllAssistants().filter((a) => options.agents.includes(a.id))
        : (await detectInstalledAssistants()).filter(
            (a) => a.paths[contentType],
          );

    if (assistants.length === 0) {
      showError("No assistants detected. Install an AI assistant first.");
      return;
    }

    showInfo(
      `Installing ${items.length} ${contentType} to ${assistants.map((a) => a.name).join(", ")}...`,
    );

    const spinner = startSpinner("Installing...");
    const result = await installItems(
      items,
      assistants,
      options.global ? "global" : "project",
      "symlink",
    );
    handleInstallResult(result, spinner, items, assistants);

    // Auto-generate bridge files after successful install
    if (result.successful > 0 && !options.global) {
      await autoGenerateBridgeFiles(assistants);
    }
    return;
  }

  // No source: interactive mode
  if (!source) {
    const catalog = await loadCatalog();
    const installOptions = await runInteractiveInstall(catalog);
    if (!installOptions) return;

    const spinner = startSpinner("Installing...");
    const result = await installItems(
      installOptions.items,
      installOptions.assistants,
      installOptions.scope,
      installOptions.method,
    );
    handleInstallResult(result, spinner);

    // Auto-generate bridge files after successful install
    if (result.successful > 0 && installOptions.scope === "project") {
      await autoGenerateBridgeFiles(installOptions.assistants);
    }
    return;
  }

  // Resolve items: builtin or external
  const contentType = options.type || "skills";
  const catalog = await loadContentType(contentType);
  const builtinItem = catalog.find(
    (item) => item.id === source || item.name === source,
  );

  let items: CatalogItem[];

  if (builtinItem) {
    items = [builtinItem];
  } else {
    const spinner = startSpinner(`Fetching from ${source}...`);
    try {
      const fetched = await fetchSkillFromSource(source);
      spinner.stop(`Found: ${fetched.name}`);
      items = [
        {
          id: fetched.id,
          name: fetched.name,
          description: fetched.description,
          type: contentType,
          path: "",
          content: fetched.content,
        },
      ];
    } catch (error) {
      spinner.stop("Failed to fetch");
      showError(error instanceof Error ? error.message : String(error));
      return;
    }
  }

  // Resolve assistants
  const assistants = await resolveAssistants(contentType, options);
  if (!assistants) return;

  // Resolve scope
  const scope = await resolveScope(options);
  if (!scope) return;

  // Resolve method
  const method = await resolveMethod(options);
  if (!method) return;

  // Install
  const spinner = startSpinner("Installing...");
  const result = await installItems(items, assistants, scope, method);
  handleInstallResult(result, spinner, items, assistants);

  // Auto-generate bridge files after successful install
  if (result.successful > 0 && scope === "project") {
    await autoGenerateBridgeFiles(assistants);
  }
}

/**
 * Resolve target assistants from options or interactive prompt
 */
async function resolveAssistants(
  contentType: ContentType,
  options: CliArgs["options"],
): Promise<AssistantConfig[] | null> {
  if (options.agents.length > 0) {
    return getAllAssistants().filter((a) => options.agents.includes(a.id));
  }
  if (options.all) {
    return getAssistantsForContentType(contentType);
  }
  if (options.yes) {
    const detected = await detectInstalledAssistants();
    return detected.filter((a) => a.paths[contentType]);
  }

  const selected = await selectAssistants(contentType);
  if (p.isCancel(selected)) {
    p.cancel("Cancelled");
    return null;
  }
  const result = selected as AssistantConfig[];
  if (result.length === 0) {
    showError("No assistants selected or detected");
    return null;
  }
  return result;
}

/**
 * Resolve install scope from options or interactive prompt
 */
async function resolveScope(
  options: CliArgs["options"],
): Promise<InstallScope | null> {
  if (options.global) return "global";
  if (options.yes) return "project";

  const selected = await selectScope();
  if (p.isCancel(selected)) {
    p.cancel("Cancelled");
    return null;
  }
  return selected as InstallScope;
}

/**
 * Resolve install method from options or interactive prompt
 */
async function resolveMethod(
  options: CliArgs["options"],
): Promise<InstallMethod | null> {
  if (options.yes) return "symlink";

  const selected = await selectMethod();
  if (p.isCancel(selected)) {
    p.cancel("Cancelled");
    return null;
  }
  return selected as InstallMethod;
}

/**
 * Auto-generate bridge files after a successful install.
 * Only creates files that don't already exist (never overwrites).
 */
async function autoGenerateBridgeFiles(
  assistants: AssistantConfig[],
): Promise<void> {
  const files = await generateBridgeFiles(assistants);
  const { written } = await writeBridgeFiles(files);

  if (written.length > 0) {
    showInfo(`Generated context files: ${written.join(", ")}`);
  }
}

/**
 * Bridge command — generate context files for detected editors
 */
async function cmdBridge(
  _args: string[],
  options: CliArgs["options"],
): Promise<void> {
  const assistants =
    options.agents.length > 0
      ? getAllAssistants().filter((a) => options.agents.includes(a.id))
      : await detectInstalledAssistants();

  if (assistants.length === 0) {
    showError("No assistants detected. Install an AI assistant first.");
    return;
  }

  const files = await generateBridgeFiles(assistants);

  if (files.length === 0) {
    showInfo("No bridge files to generate.");
    return;
  }

  // Show what will be generated
  console.log("\nBridge files to generate:\n");
  for (const file of files) {
    console.log(`  ${file.filePath} — ${file.description}`);
  }
  console.log();

  // Confirm unless --yes
  if (!options.yes) {
    const confirmed = await p.confirm({
      message: `Generate ${files.length} context files?`,
    });
    if (p.isCancel(confirmed) || !confirmed) {
      p.cancel("Cancelled");
      return;
    }
  }

  const overwrite = options.yes
    ? false
    : (await p.confirm({
        message: "Overwrite existing files?",
        initialValue: false,
      })) === true;

  const { written, skipped } = await writeBridgeFiles(
    files,
    process.cwd(),
    overwrite,
  );

  if (written.length > 0) {
    showInfo(`Created: ${written.join(", ")}`);
  }
  if (skipped.length > 0) {
    showInfo(`Skipped (already exist): ${skipped.join(", ")}`);
  }

  p.outro("Bridge files ready — each editor now reads .ai/");
}

/**
 * Remove command
 */
async function cmdRemove(
  args: string[],
  options: CliArgs["options"],
): Promise<void> {
  const name = args[0];

  if (!name) {
    showError("Please specify an item to remove");
    return;
  }

  const scope: InstallScope = options.global ? "global" : "project";
  const contentType = options.type || "skills";

  // Get installed items
  const installed = await getInstalledItemsByType(contentType, scope);
  const item = installed.find((i) => i.id === name);

  if (!item) {
    showError(`${name} is not installed`);
    return;
  }

  // Get assistants to remove from
  const allAssistants = getAllAssistants();
  const targetAssistants = item.assistants
    .map((id) => allAssistants.find((a) => a.id === id))
    .filter(Boolean) as AssistantConfig[];

  const spinner = startSpinner(`Removing ${name}...`);

  let removed = 0;
  for (const assistant of targetAssistants) {
    const catalogItem: CatalogItem = {
      id: item.id,
      name: item.id,
      description: "",
      type: item.type,
      path: "",
    };

    const success = await uninstallItem(catalogItem, assistant, scope);
    if (success) removed++;
  }

  spinner.stop(`Removed ${name} from ${removed} assistants`);
}

/**
 * List command
 */
async function cmdList(
  args: string[],
  options: CliArgs["options"],
): Promise<void> {
  const typeArg = args[0] as ContentType | undefined;
  const contentType = typeArg || options.type;

  if (options.installed) {
    // List installed items
    const scope: InstallScope = options.global ? "global" : "project";
    const items = contentType
      ? await getInstalledItemsByType(contentType, scope)
      : await getInstalledItems(scope);

    if (items.length === 0) {
      showInfo("No items installed");
      return;
    }

    console.log("\nInstalled items:\n");
    for (const item of items) {
      console.log(`  ${item.type}/${item.id}`);
      console.log(`    Assistants: ${item.assistants.join(", ")}`);
      console.log(`    Source: ${item.source}`);
      console.log(`    Installed: ${item.installedAt}\n`);
    }
    return;
  }

  // List available items
  if (contentType) {
    const items = await loadContentType(contentType);

    if (items.length === 0) {
      showInfo(`No ${contentType} available`);
      return;
    }

    console.log(`\nAvailable ${contentType}:\n`);
    for (const item of items) {
      console.log(`  ${item.name}`);
      console.log(`    ${item.description}\n`);
    }
  } else {
    // Show stats
    const stats = await getCatalogStats();

    console.log("\n📦 personal-ai-skills catalog:\n");
    console.log(`  Skills:   ${stats.skills || 0}`);
    console.log(`  Agents:   ${stats.agents || 0}`);
    console.log(`  Commands: ${stats.commands || 0}`);
    console.log(`  Rules:    ${stats.rules || 0}`);
    console.log(`  Prompts:  ${stats.prompts || 0}`);
    console.log(`  ─────────────`);
    console.log(`  Total:    ${stats.total}\n`);
    console.log("Use 'personal-ai-skills list <type>' to see items\n");
  }
}

/**
 * Search command
 */
async function cmdSearch(
  args: string[],
  _options: CliArgs["options"],
): Promise<void> {
  const query = args.join(" ");

  if (!query) {
    showError("Please provide a search query");
    return;
  }

  const results = await searchCatalog(query);

  if (results.length === 0) {
    showInfo(`No results for "${query}"`);
    return;
  }

  console.log(`\nResults for "${query}":\n`);
  for (const item of results) {
    console.log(`  [${item.type}] ${item.name}`);
    console.log(`    ${item.description}\n`);
  }
}

/**
 * Update command
 */
async function cmdUpdate(
  _args: string[],
  options: CliArgs["options"],
): Promise<void> {
  const scope: InstallScope = options.global ? "global" : "project";
  const items = await getInstalledItems(scope);

  if (items.length === 0) {
    showInfo("No items installed");
    return;
  }

  showInfo(
    `Found ${items.length} installed items. Update checking coming soon!`,
  );
}

/**
 * Init command
 */
async function cmdInit(
  args: string[],
  _options: CliArgs["options"],
): Promise<void> {
  const typeArg = args[0] as ContentType | undefined;
  const name = args[1];

  let contentType = typeArg;
  if (!contentType) {
    const selected = await selectContentType();
    if (p.isCancel(selected)) {
      p.cancel("Cancelled");
      return;
    }
    contentType = selected as ContentType;
  }

  const itemName =
    name ||
    (await p.text({
      message: "Enter a name for your item:",
      placeholder: "my-skill",
    }));

  if (p.isCancel(itemName)) {
    p.cancel("Cancelled");
    return;
  }

  const templates: Record<ContentType, string> = {
    skills: `---
name: ${itemName}
description: Description of what this skill does
category: custom
tags: [tag1, tag2]
---

# ${itemName}

## Overview

Describe what this skill helps with.

## Rules

- ✅ DO: Good practice
- ❌ DON'T: Bad practice

## Examples

\`\`\`typescript
// Example code
\`\`\`
`,
    agents: `---
name: ${itemName}
description: Description of this agent's role
---

# ${itemName} Agent

## Role

Describe the agent's purpose and expertise.

## Capabilities

- Capability 1
- Capability 2

## Instructions

When activated, this agent should...
`,
    commands: `---
name: ${itemName}
description: Description of what this command does
---

# ${itemName}

## Usage

Describe how to use this command.

## Parameters

- \`param1\`: Description
- \`param2\`: Description

## Example

\`\`\`
/run ${itemName} [args]
\`\`\`
`,
    rules: `---
name: ${itemName}
description: Description of this rule
severity: warning
---

# ${itemName}

## Rule

Describe the rule and why it matters.

## Examples

### ❌ Bad

\`\`\`typescript
// Code that violates the rule
\`\`\`

### ✅ Good

\`\`\`typescript
// Code that follows the rule
\`\`\`
`,
    prompts: `---
name: ${itemName}
description: Description of this prompt
---

# ${itemName}

## Template

\`\`\`
Your prompt template here with {{variables}}
\`\`\`

## Variables

- \`variable1\`: Description
- \`variable2\`: Description
`,
  };

  const fileNames: Record<ContentType, string> = {
    skills: "SKILL.md",
    agents: "AGENT.md",
    commands: "COMMAND.md",
    rules: "RULE.md",
    prompts: "PROMPT.md",
  };

  const dirPath = path.join(process.cwd(), String(itemName));
  const filePath = path.join(dirPath, fileNames[contentType]);

  await fs.promises.mkdir(dirPath, { recursive: true });
  await fs.promises.writeFile(filePath, templates[contentType]);

  p.outro(`Created ${filePath}`);
}

/**
 * Serve command - Launch web viewer
 */
async function cmdServe(
  _args: string[],
  _options: CliArgs["options"],
): Promise<void> {
  showInfo(
    "Web viewer coming soon! For now, use 'personal-ai-skills list' to browse the catalog.",
  );

  // TODO: Launch Vite dev server for web viewer
  // const { createServer } = await import('vite');
  // const server = await createServer({ ... });
  // await server.listen();
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  const cli = parseCliArgs();

  // Handle --version
  if (cli.options.version) {
    console.log(`personal-ai-skills v${VERSION}`);
    return;
  }

  // Handle --help (explicit only — no command launches interactive wizard)
  if (cli.options.help) {
    console.log(HELP);
    return;
  }

  try {
    // Content type shortcuts: `personal-ai-skills agents [add|list]`
    if (CONTENT_TYPE_SHORTCUTS.includes(cli.command as ContentType)) {
      cli.options.type = cli.command as ContentType;
      if (cli.args[0] === "add") {
        await cmdAdd(cli.args.slice(1), cli.options);
      } else {
        await cmdList([], cli.options);
      }
      return;
    }

    // Command routing
    switch (cli.command) {
      case "add":
      case "install":
      case "i":
        await cmdAdd(cli.args, cli.options);
        break;

      case "remove":
      case "rm":
      case "uninstall":
        await cmdRemove(cli.args, cli.options);
        break;

      case "list":
      case "ls":
        await cmdList(cli.args, cli.options);
        break;

      case "search":
      case "find":
        await cmdSearch(cli.args, cli.options);
        break;

      case "update":
      case "upgrade":
        await cmdUpdate(cli.args, cli.options);
        break;

      case "init":
      case "create":
        await cmdInit(cli.args, cli.options);
        break;

      case "bridge":
      case "context":
        await cmdBridge(cli.args, cli.options);
        break;

      case "serve":
      case "web":
        await cmdServe(cli.args, cli.options);
        break;

      default:
        if (!cli.command) {
          // No command — launch interactive wizard
          await cmdAdd([], cli.options);
        } else {
          // Try as a skill name shortcut: `personal-ai-skills clean-code`
          const catalog = await loadContentType("skills");
          const skill = catalog.find(
            (s) => s.id === cli.command || s.name === cli.command,
          );

          if (skill) {
            await cmdAdd([cli.command], cli.options);
          } else {
            console.log(HELP);
          }
        }
    }
  } catch (error) {
    showError(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
