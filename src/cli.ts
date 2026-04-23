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
  selectBridges,
  ALL_BRIDGE_IDS,
  MEMORY_TOOL_NEXT_STEPS_MAP,
  showInstallSuccess,
  showError,
  showInfo,
  startSpinner,
} from "./prompts.js";
import type { ProjectSetup } from "./prompts.js";
import { installItems, uninstallItem } from "./install.js";
import { getInstalledItems, getInstalledItemsByType, getPreferences, savePreferences } from "./lock.js";
import { fetchSkillFromSource } from "./github.js";
import {
  generateBridgeFiles,
  generateBridgeFilesForIds,
  writeBridgeFiles,
} from "./bridge.js";

// ============================================================================
// Version & Help
// ============================================================================

const VERSION = "1.0.0";

const HELP = `
personal-ai-skills - Universal AI skills installer

Three-tier token-efficient config: global ~/.ai/ → project .ai/ → docs/spec/

USAGE
  $ personal-ai-skills [command] [options]

COMMANDS
  add <source>          Install skills from GitHub, URL, or builtin catalog
  remove <name>         Remove installed skills
  list [type]           List available or installed items
  search <query>        Search the catalog
  bridge                Generate context files for selected editors
  update                Update all installed items
  init <type>           Create a new SKILL.md / AGENT.md / etc. template
  init spec             Create root SPEC.md (three-tier architecture)
  init spec <name>      Create docs/spec/<name>/SPEC.md + update Spec Map
  serve                 Browse the catalog

OPTIONS
  -g, --global          Install to user directory (global)
  -a, --agent           Target specific agents (comma-separated)
  -t, --type            Content type: skills, agents, commands, rules, prompts
  -y, --yes             Skip confirmation prompts
  --all                 Install all items to all agents
  --bridges <ids>       Bridge files to generate: all | none | claude,cursor,...
  -v, --version         Show version
  -h, --help            Show help

BRIDGE IDS
  claude    CLAUDE.md (map pattern, < 200 tokens always-load)
  cursor    .cursor/rules/ai-config.mdc
  vscode    .vscode/settings.json  (merges — never overwrites)
  copilot   .github/copilot-instructions.md
  codex     AGENTS.md
  gemini    GEMINI.md
  windsurf  .windsurfrules

EXAMPLES
  $ personal-ai-skills add clean-code                   # Install builtin skill
  $ personal-ai-skills add user/repo                    # Install from GitHub
  $ personal-ai-skills add ./my-skill                   # Install from local path
  $ personal-ai-skills list                             # List all available items
  $ personal-ai-skills list skills                      # List available skills
  $ personal-ai-skills list --installed                 # List installed items
  $ personal-ai-skills remove clean-code                # Remove a skill
  $ personal-ai-skills bridge                           # Interactive bridge selection
  $ personal-ai-skills bridge --bridges claude,vscode   # Specific bridges only
  $ personal-ai-skills bridge --bridges none            # Skip bridge generation
  $ personal-ai-skills init spec                        # Create root SPEC.md
  $ personal-ai-skills init spec auth                   # Create docs/spec/auth/SPEC.md
  $ personal-ai-skills add clean-code --bridges all     # Install + generate all bridges

INTEGRATIONS
  Obsidian   templates/integrations/obsidian.md
  claude-mem templates/integrations/claude-mem.md
  graphify   templates/integrations/graphify.md

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
    /** Comma-separated bridge IDs, or "all" / "none" */
    bridges?: string;
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
      bridges: { type: "string" },
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
      bridges: values.bridges as string | undefined,
    },
  };
}

// ============================================================================
// Bridge Helpers
// ============================================================================

/**
 * Parse the --bridges flag value into a list of bridge IDs.
 *
 * --bridges all          → ALL_BRIDGE_IDS
 * --bridges none         → []
 * --bridges claude,vscode → ['claude', 'vscode']
 * undefined              → null (caller should prompt interactively)
 */
function parseBridgeFlag(bridges: string | undefined): string[] | null {
  if (bridges === undefined) return null;
  if (bridges === "none") return [];
  if (bridges === "all") return ALL_BRIDGE_IDS;
  return bridges.split(",").map((s) => s.trim()).filter(Boolean);
}

/**
 * Resolve bridge IDs from the --bridges flag or interactive prompt.
 * Returns [] to skip bridge generation, or a list of IDs to generate.
 */
async function resolveBridgeIds(
  options: CliArgs["options"],
): Promise<string[]> {
  const fromFlag = parseBridgeFlag(options.bridges);
  if (fromFlag !== null) return fromFlag;

  // --yes skips the prompt and uses auto-detection (all known bridges)
  if (options.yes) return ALL_BRIDGE_IDS;

  const selected = await selectBridges();
  if (p.isCancel(selected)) return [];
  return selected as string[];
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
      showError(`Failed: ${r.item.name} → ${r.assistant?.name ?? "universal"}: ${r.error}`);
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
      const bridgeIds = await resolveBridgeIds(options);
      await autoGenerateBridgeFiles(assistants, bridgeIds);
    }
    return;
  }

  // No source: full interactive wizard
  if (!source) {
    const catalog = await loadCatalog();
    const prefs = await getPreferences("global");
    const projectRoot = process.cwd();

    const wizard = await runInteractiveInstall(
      catalog,
      prefs?.obsidianVaultPath,
      path.basename(projectRoot),
    );
    if (!wizard) return;

    // Save vault path for next run (remembered across projects)
    await savePreferences({ obsidianVaultPath: wizard.obsidianVaultPath }, "global");

    // Install content items (skills, agents, etc.)
    if (wizard.items.length > 0) {
      const spinner = startSpinner("Installing content...");
      const result = await installItems(
        wizard.items,
        wizard.assistants,
        wizard.scope,
        wizard.method,
        projectRoot,
      );
      handleInstallResult(result, spinner);
    }

    // Scaffold SPEC.md + CLAUDE.md
    if (wizard.projectSetup) {
      const { specCreated, claudeCreated } = await scaffoldProjectSpec(
        wizard.projectSetup,
        wizard.obsidianVaultPath,
        projectRoot,
      );
      if (specCreated) showInfo("Created SPEC.md — fill in your project details");
      if (claudeCreated) showInfo(`Created CLAUDE.md — vault path set to ${wizard.obsidianVaultPath}`);
    }

    // Generate bridge files with vault path baked in
    if (wizard.bridgeIds.length > 0) {
      const files = await generateBridgeFilesForIds(
        wizard.bridgeIds,
        projectRoot,
        wizard.obsidianVaultPath,
      );
      if (files.length > 0) {
        const { written, skipped } = await writeBridgeFiles(files, projectRoot);
        if (written.length > 0) showInfo(`Generated: ${written.join(", ")}`);
        if (skipped.length > 0) showInfo(`Skipped (already exist): ${skipped.join(", ")}`);
      }
    }

    // Show one-time setup commands for memory tools
    const nextSteps = wizard.memoryTools
      .map((tool) => MEMORY_TOOL_NEXT_STEPS_MAP[tool])
      .filter(Boolean);
    if (nextSteps.length > 0) {
      showInfo(
        `\n📋 One-time setup — run these to activate your memory tools:\n${
          wizard.memoryTools
            .filter((t) => MEMORY_TOOL_NEXT_STEPS_MAP[t])
            .map((t) => `  ${t}: ${MEMORY_TOOL_NEXT_STEPS_MAP[t]}`)
            .join("\n")
        }`,
      );
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
  const method = await resolveMethod(options, contentType);
  if (!method) return;

  // Install
  const spinner = startSpinner("Installing...");
  const result = await installItems(items, assistants, scope, method);
  handleInstallResult(result, spinner, items, assistants.length > 0 ? assistants : undefined);

  // Auto-generate bridge files after successful install (not for integrations)
  if (result.successful > 0 && scope === "project" && contentType !== "integration") {
    const bridgeIds = await resolveBridgeIds(options);
    await autoGenerateBridgeFiles(assistants, bridgeIds);
  }
}

/**
 * Resolve target assistants from options or interactive prompt
 */
async function resolveAssistants(
  contentType: ContentType,
  options: CliArgs["options"],
): Promise<AssistantConfig[] | null> {
  // Integrations are universal — no assistant selection needed
  if (contentType === "integration") return [];

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
  contentType?: ContentType,
): Promise<InstallMethod | null> {
  // Integrations are always copied — symlinking an integration guide makes no sense
  if (contentType === "integration") return "copy";
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
 *
 * When bridgeIds is provided, uses those specific bridges.
 * Otherwise falls back to assistant-based detection.
 */
async function autoGenerateBridgeFiles(
  assistants: AssistantConfig[],
  bridgeIds?: string[],
): Promise<void> {
  const files =
    bridgeIds !== undefined
      ? await generateBridgeFilesForIds(bridgeIds)
      : await generateBridgeFiles(assistants);

  if (files.length === 0) return;

  const { written } = await writeBridgeFiles(files);
  if (written.length > 0) {
    showInfo(`Generated context files: ${written.join(", ")}`);
  }
}

/**
 * Bridge command — generate context files for selected editors
 */
async function cmdBridge(
  _args: string[],
  options: CliArgs["options"],
): Promise<void> {
  // Resolve which bridge types to generate
  const bridgeIds = await resolveBridgeIds(options);

  if (bridgeIds.length === 0) {
    showInfo("No bridges selected.");
    return;
  }

  const files = await generateBridgeFilesForIds(bridgeIds);

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

    const success = await uninstallItem(catalogItem, scope);
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

// ============================================================================
// Spec Helpers
// ============================================================================

/**
 * Find the package templates directory (works in both dev and installed)
 */
function getPackageTemplatesRoot(): string {
  const devPath = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    "..",
    "templates",
  );
  const prodPath = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    "..",
    "..",
    "templates",
  );
  return fs.existsSync(devPath) ? devPath : prodPath;
}

/**
 * Update the Spec Map table in root SPEC.md, appending a new row.
 * Finds the table with a "| Topic" header and inserts a row after the last `|` line.
 */
async function updateSpecMap(
  rootSpecPath: string,
  specName: string,
  specRelPath: string,
): Promise<void> {
  let content: string;
  try {
    content = await fs.promises.readFile(rootSpecPath, "utf-8");
  } catch {
    return; // Root SPEC.md doesn't exist — nothing to update
  }

  const lines = content.split("\n");
  // Find the "Spec Map" table header line
  const headerIdx = lines.findIndex((l) => l.includes("| Topic"));
  if (headerIdx === -1) return; // No Spec Map table found

  // Find the end of the table (last line that starts with |)
  let lastTableLine = headerIdx;
  for (let i = headerIdx + 1; i < lines.length; i++) {
    if (lines[i].trimStart().startsWith("|")) {
      lastTableLine = i;
    } else if (lines[i].trim() !== "" && !lines[i].trimStart().startsWith("|")) {
      break;
    }
  }

  const newRow = `| ${specName} | ${specRelPath} |`;
  lines.splice(lastTableLine + 1, 0, newRow);
  await fs.promises.writeFile(rootSpecPath, lines.join("\n"), "utf-8");
}

/**
 * Scaffold SPEC.md (and optionally CLAUDE.md) from templates — called programmatically
 * from the wizard so it doesn't need interactive prompts.
 */
async function scaffoldProjectSpec(
  setup: ProjectSetup,
  vaultPath: string,
  projectRoot: string,
): Promise<{ specCreated: boolean; claudeCreated: boolean }> {
  const templatesRoot = getPackageTemplatesRoot();
  let specCreated = false;
  let claudeCreated = false;

  // SPEC.md
  const specDest = path.join(projectRoot, "SPEC.md");
  if (!fs.existsSync(specDest)) {
    let template = await fs.promises.readFile(
      path.join(templatesRoot, "shared", "SPEC.root.md"),
      "utf-8",
    );
    template = template
      .replace(/\{\{PROJECT_NAME\}\}/g, setup.name)
      .replace(/\{\{ONE_LINE_DESCRIPTION\}\}/g, setup.description)
      .replace(/\{\{TECH_STACK\}\}/g, setup.stack)
      .replace(/\{\{PROJECT_SLUG\}\}/g, setup.slug);
    await fs.promises.writeFile(specDest, template, "utf-8");
    specCreated = true;
  }

  // CLAUDE.md — from the shared template, substituting vault path and slug
  const claudeDest = path.join(projectRoot, "CLAUDE.md");
  if (!fs.existsSync(claudeDest)) {
    let template = await fs.promises.readFile(
      path.join(templatesRoot, "shared", "CLAUDE.md"),
      "utf-8",
    );
    const resolvedVault = vaultPath.startsWith("~")
      ? vaultPath
      : `~/${vaultPath.replace(/^\//, "")}`;
    template = template
      .replace(/\{\{PROJECT_NAME\}\}/g, setup.name)
      .replace(/\{\{PROJECT_SLUG\}\}/g, setup.slug)
      .replace(/~\/ai-brain/g, resolvedVault);
    await fs.promises.writeFile(claudeDest, template, "utf-8");
    claudeCreated = true;
  }

  return { specCreated, claudeCreated };
}

/**
 * init spec command — scaffold SPEC.md files using the three-tier architecture.
 *
 *   personal-ai-skills init spec           → creates SPEC.md in project root
 *   personal-ai-skills init spec <name>    → creates docs/spec/<name>/SPEC.md
 *                                            and updates root SPEC.md Spec Map
 */
async function cmdInitSpec(args: string[]): Promise<void> {
  const specName = args[0];
  const templatesRoot = getPackageTemplatesRoot();
  const projectRoot = process.cwd();

  if (!specName) {
    // ── Root SPEC.md ───────────────────────────────────────────────────────
    const destPath = path.join(projectRoot, "SPEC.md");

    // Check if already exists
    const exists = fs.existsSync(destPath);
    if (exists) {
      const overwrite = await p.confirm({
        message: "SPEC.md already exists. Overwrite?",
        initialValue: false,
      });
      if (p.isCancel(overwrite) || !overwrite) {
        p.cancel("Cancelled");
        return;
      }
    }

    const projectName = await p.text({
      message: "Project name:",
      placeholder: path.basename(projectRoot),
      defaultValue: path.basename(projectRoot),
    });
    if (p.isCancel(projectName)) { p.cancel("Cancelled"); return; }

    const description = await p.text({
      message: "One-line description:",
      placeholder: "What does this project do?",
    });
    if (p.isCancel(description)) { p.cancel("Cancelled"); return; }

    const stack = await p.text({
      message: "Tech stack:",
      placeholder: "TypeScript, Node.js, React",
    });
    if (p.isCancel(stack)) { p.cancel("Cancelled"); return; }

    const slug = String(projectName)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    let template = await fs.promises.readFile(
      path.join(templatesRoot, "shared", "SPEC.root.md"),
      "utf-8",
    );
    template = template
      .replace(/\{\{PROJECT_NAME\}\}/g, String(projectName))
      .replace(/\{\{ONE_LINE_DESCRIPTION\}\}/g, String(description))
      .replace(/\{\{TECH_STACK\}\}/g, String(stack))
      .replace(/\{\{PROJECT_SLUG\}\}/g, slug);

    await fs.promises.writeFile(destPath, template, "utf-8");
    p.outro(`Created SPEC.md`);
  } else {
    // ── Page SPEC.md ───────────────────────────────────────────────────────
    const specDir = path.join(projectRoot, "docs", "spec", specName);
    const specFile = path.join(specDir, "SPEC.md");

    if (fs.existsSync(specFile)) {
      showError(`docs/spec/${specName}/SPEC.md already exists`);
      return;
    }

    let template = await fs.promises.readFile(
      path.join(templatesRoot, "shared", "SPEC.page.md"),
      "utf-8",
    );
    template = template.replace(/\{\{PAGE_NAME\}\}/g, specName);

    await fs.promises.mkdir(specDir, { recursive: true });
    await fs.promises.writeFile(specFile, template, "utf-8");

    // Update root SPEC.md Spec Map
    const rootSpecPath = path.join(projectRoot, "SPEC.md");
    const relPath = `docs/spec/${specName}/SPEC.md`;
    await updateSpecMap(rootSpecPath, specName, relPath);

    p.outro(`Created docs/spec/${specName}/SPEC.md${fs.existsSync(rootSpecPath) ? " and updated SPEC.md Spec Map" : ""}`);
  }
}

/**
 * Init command
 */
async function cmdInit(
  args: string[],
  _options: CliArgs["options"],
): Promise<void> {
  // Intercept 'spec' subcommand before content-type selection
  if (args[0] === "spec") {
    await cmdInitSpec(args.slice(1));
    return;
  }

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
    integration: `---
name: ${itemName}
description: Description of this integration
setup: "command to run once"
---

# ${itemName} Integration

## What it does

Describe what this integration provides.

## Setup

Run the setup command above, then use the integration.
`,
  };

  const fileNames: Record<ContentType, string> = {
    skills: "SKILL.md",
    agents: "AGENT.md",
    commands: "COMMAND.md",
    rules: "RULE.md",
    prompts: "PROMPT.md",
    integration: "INTEGRATION.md",
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
    "Use 'personal-ai-skills list' to browse the catalog, or open the web viewer manually.",
  );
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
