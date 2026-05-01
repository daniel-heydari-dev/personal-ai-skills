#!/usr/bin/env node

import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";
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
  getMemoryToolNextStep,
  showInstallSuccess,
  showError,
  showInfo,
  startSpinner,
} from "./prompts.js";
import type { ProjectSetup, WizardResult } from "./prompts.js";
import { installItems, uninstallItem } from "./install.js";
import { getInstalledItems, getInstalledItemsByType, getPreferences, savePreferences, removeFromLockFile } from "./lock.js";
import { fetchSkillFromSource } from "./github.js";
import {
  generateBridgeFiles,
  generateBridgeFilesForIds,
  writeBridgeFiles,
} from "./bridge.js";
import { scaffoldBrain } from "./brain-scaffold.js";
import { verifyInstall } from "./verify-install.js";

// ============================================================================
// Version & Help
// ============================================================================

function commandExistsSync(cmd: string): boolean {
  try {
    execSync(`which ${cmd}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

let VERSION = "unknown";
try {
  const pkgPath = new URL("../package.json", import.meta.url).pathname;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8")) as { version: string };
  VERSION = pkg.version;
} catch { /* ignore */ }

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
  update [name]         Update installed items to latest version
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
// Master Prompt Builder
// ============================================================================

function buildMemorySection(wizard: WizardResult): string {
  // Vault path is always set — always emit it so every project references the
  // same second brain. Tool-specific lines appear only when the tool was selected.
  const lines: string[] = [
    `- **Second brain vault**: \`${wizard.obsidianVaultPath}\` — my notes, research, and project wiki live here. When I mention "my notes", "the wiki", or "second brain", look here first.`,
  ];
  if (wizard.memoryTools.includes("claude-mem")) {
    lines.push(
      `- **Session memory (claude-mem)**: past session context is injected automatically. Use the \`search_memory\` MCP tool to find older decisions or conversations.`,
    );
  }
  if (wizard.memoryTools.includes("graphify")) {
    lines.push(
      `- **Knowledge graph (graphify)**: the codebase is mapped as a graph. Use it for large codebase exploration — up to 71× token reduction vs raw file reading.`,
    );
  }
  if (wizard.memoryTools.includes("caveman")) {
    lines.push(
      `- **caveman (token compression)**: activate with \`/caveman\` to compress AI responses by 65-75%. Type \`/caveman-help\` for commands.`,
    );
  }
  return `## Memory & Second Brain\n\n${lines.join("\n")}`;
}

function buildProjectSection(project: NonNullable<WizardResult["projectSetup"]>): string {
  return `## Project\n\n- **Name**: ${project.name}\n- **Description**: ${project.description}\n- **Stack**: ${project.stack}\n- **Spec**: read \`SPEC.md\` for full architecture, constraints, and decisions.`;
}

function buildRoutingSection(wizard: WizardResult): string {
  const hasSkills = wizard.items.some((i) => i.type === "skills");
  const hasAgents = wizard.items.some((i) => i.type === "agents");
  const lines = ["## Routing"];
  if (hasSkills) lines.push("- Skills available in `.ai/skills/` — load by topic, see CLAUDE.md Skills Map.");
  if (hasAgents) lines.push("- Agents available in `.ai/agents/` — load on explicit request.");
  lines.push("- Sub-specs in `docs/spec/<feature>/SPEC.md` — load when keywords match.");
  return lines.join("\n");
}

function buildInstructionsSection(wizard: WizardResult): string {
  const instructions = [
    "1. Always read `CLAUDE.md` on session start — it is the routing map.",
    "2. Match the task to a skill in `.ai/skills/` before writing code.",
  ];
  if (wizard.memoryTools.includes("claude-mem")) {
    instructions.push("3. Use `search_memory` when you need context from older sessions.");
  }
  return `## How to work\n\n${instructions.join("\n")}`;
}

function buildMasterPrompt(wizard: WizardResult): string {
  const project = wizard.projectSetup;

  const sections = [
    `You are my AI assistant for ${project ? `**${project.name}**` : "this project"}.`,
    buildMemorySection(wizard),
    ...(project ? [buildProjectSection(project)] : []),
    buildRoutingSection(wizard),
    buildInstructionsSection(wizard),
  ].filter(Boolean);

  return sections.join("\n\n---\n\n");
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

      // Create always.md stub if rules were installed — CLAUDE.md references it
      const rulesInstalled = wizard.items.some((i) => i.type === "rules");
      if (rulesInstalled) {
        const alwaysPath = path.join(projectRoot, ".ai", "rules", "always.md");
        try {
          await fs.promises.access(alwaysPath);
        } catch {
          await fs.promises.writeFile(
            alwaysPath,
            "# Always Rules\n\nLoad all files in this directory. These are hard constraints — apply to every task.\n",
            "utf-8",
          );
        }
      }
    }

    // Generate bridge files FIRST (writes CLAUDE.md with actual installed skills)
    if (wizard.bridgeIds.length > 0) {
      const files = await generateBridgeFilesForIds(
        wizard.bridgeIds,
        projectRoot,
        wizard.obsidianVaultPath,
        wizard.items,
        wizard.projectSetup?.slug,
      );
      if (files.length > 0) {
        const { written, skipped } = await writeBridgeFiles(files, projectRoot);
        if (written.length > 0) showInfo(`Generated: ${written.join(", ")}`);
        if (skipped.length > 0) showInfo(`Skipped (already exist): ${skipped.join(", ")}`);
      }
    }

    // Scaffold SPEC.md (+ CLAUDE.md if bridge didn't already write it)
    if (wizard.projectSetup) {
      const { specCreated, claudeCreated, subSpecsCreated } = await scaffoldProjectSpec(
        wizard.projectSetup,
        wizard.obsidianVaultPath,
        projectRoot,
      );
      if (specCreated) showInfo("Created SPEC.md — fill in your project details");
      if (claudeCreated) showInfo(`Created CLAUDE.md — vault path set to ${wizard.obsidianVaultPath}`);
      if (subSpecsCreated.length > 0) {
        showInfo(`Created example sub-specs: ${subSpecsCreated.join(", ")}`);
      }
    }

    // Run one-time memory tool setup commands using the actual vault path
    const memoryCommands = wizard.memoryTools
      .map((tool) => {
        const cmd = getMemoryToolNextStep(tool, wizard.obsidianVaultPath);
        return cmd ? { tool, cmd } : null;
      })
      .filter((x): x is { tool: string; cmd: string } => x !== null);

    if (memoryCommands.length > 0) {
      showInfo(
        `\n📋 Memory tool setup:\n${memoryCommands.map((c) => `  ${c.tool}: ${c.cmd}`).join("\n")}`,
      );
      const shouldRun = await p.confirm({
        message: "Run these setup commands now?",
        initialValue: true,
      });
      if (!p.isCancel(shouldRun) && shouldRun) {
        for (const { tool, cmd } of memoryCommands) {
          // Pre-check: graphify needs Python 3.10+ before we even try
          if (tool === "graphify") {
            const hasPython = commandExistsSync("python3") || commandExistsSync("python");
            const hasPip = commandExistsSync("pip3") || commandExistsSync("pip");
            if (!hasPython || !hasPip) {
              const guide = process.platform === "darwin"
                ? "  Install Python:  brew install python3\n  Or download from: https://python.org/downloads/"
                : process.platform === "linux"
                ? "  Install Python:  sudo apt install python3 python3-pip"
                : "  Download Python 3.10+ from: https://python.org/downloads/";
              showInfo(
                `\n⚠️  graphify requires Python 3.10+ (not found on your system).\n${guide}\n\n  After installing Python, run manually:\n  pip3 install graphifyy && graphify install\n`,
              );
              continue;
            }
          }

          // Use spinner only for fast commands (git clone, npx).
          // For pip installs (graphify) stream output directly — pip is slow and has its own progress.
          const isSlowCommand = tool === "graphify";

          if (isSlowCommand) {
            console.log(`\n▶  ${tool}: ${cmd}\n`);
          }

          const s = isSlowCommand ? null : startSpinner(`Setting up ${tool}…`);
          try {
            execSync(cmd, { stdio: "inherit", shell: process.env["SHELL"] ?? "/bin/sh" });
            s?.stop(`${tool} ✓`);
            if (!isSlowCommand) console.log();

            if (tool === "claude-mem") {
              showInfo(
                "claude-mem installed.\n" +
                "  • Hook registered in:  ~/.claude/settings.json\n" +
                "  • Memory viewer:       http://localhost:37777\n" +
                "  • Memory is automatic — just open Claude Code and start working.",
              );
            }
            if (tool === "graphify") {
              showInfo("graphify installed ✓ — use /graphify in Claude Code to build a knowledge graph.");
            }
            if (tool === "obsidian") {
              showInfo(
                `Vault ready at: ${wizard.obsidianVaultPath}\n` +
                "  • Open this folder in Obsidian: Manage Vaults → Open folder as vault\n" +
                "  • Drop files in .raw/ and Claude will auto-organise them into wiki/",
              );
            }
          } catch {
            s?.stop(`${tool} setup failed.`);
            if (tool === "graphify") {
              showInfo(
                "\n⚠️  graphify install failed.\n" +
                "  Make sure Python 3.10+ and pip3 are installed, then run:\n" +
                "  pip3 install graphifyy && graphify install\n",
              );
            } else if (tool === "claude-mem") {
              showInfo("\n⚠️  claude-mem install failed. Run manually:\n  npx claude-mem install\n");
            } else {
              showInfo(`\n⚠️  ${tool} setup failed. Run manually:\n  ${cmd}\n`);
            }
          }

          // Seed vault directory structure after obsidian clone
          if (tool === "obsidian" && wizard.projectSetup) {
            const expandedPath = wizard.obsidianVaultPath.replace(/^~/, process.env["HOME"] ?? "~");
            const result = await scaffoldBrain({
              vaultPath: expandedPath,
              projectSlug: wizard.projectSetup.slug,
              projectName: wizard.projectSetup.name,
              projectDescription: wizard.projectSetup.description,
              projectType: wizard.projectSetup.type,
            });
            if (result.vaultCreated) {
              showInfo(`Brain vault scaffolded at: ${expandedPath}`);
            } else if (result.projectCreated) {
              showInfo(`Brain vault detected. Added project folder: wiki/projects/${wizard.projectSetup.slug}/`);
            } else if (result.alreadyUpToDate) {
              showInfo(`Brain folder for "${wizard.projectSetup.slug}" already exists — skipped.`);
            }
          } else if (tool === "obsidian") {
            // No project setup — just seed the bare minimum so the vault is at least browsable
            const expandedPath = wizard.obsidianVaultPath.replace(/^~/, process.env["HOME"] ?? "~");
            await fs.promises.mkdir(path.join(expandedPath, ".raw", "projects"), { recursive: true });
            await fs.promises.mkdir(path.join(expandedPath, "wiki", "projects"), { recursive: true });
            const hotPath = path.join(expandedPath, "wiki", "hot.md");
            try {
              await fs.promises.access(hotPath);
            } catch {
              await fs.promises.writeFile(
                hotPath,
                "# Session Cache\n\n<!-- claude-mem writes the latest session summary here. -->\n",
                "utf-8",
              );
            }
          }
        }
      }
    }

    // Generate master AI context prompt and save it
    const masterPrompt = buildMasterPrompt(wizard);
    const aiDir = path.join(projectRoot, ".ai");
    await fs.promises.mkdir(aiDir, { recursive: true });
    const promptPath = path.join(aiDir, "AI-CONTEXT.md");
    await fs.promises.writeFile(promptPath, masterPrompt, "utf-8");

    // Run the static post-install health check + emit a paste-prompt for AI review.
    const verifyResult = await verifyInstall({
      projectRoot,
      projectSlug: wizard.projectSetup?.slug,
      projectType: wizard.projectSetup?.type,
      vaultPath: wizard.memoryTools.includes("obsidian") ? wizard.obsidianVaultPath : undefined,
      installedSkills: wizard.items.filter((i) => i.type === "skills").map((i) => i.id),
      installedAgents: wizard.items.filter((i) => i.type === "agents").map((i) => i.id),
      installedRules: wizard.items.filter((i) => i.type === "rules").map((i) => i.id),
      bridgeIds: wizard.bridgeIds,
    });

    const verifyHeader = `\n📋 Health check — ${verifyResult.passed} passed, ${verifyResult.warnings} warnings, ${verifyResult.errors} errors\n`;
    const verifyBody = verifyResult.lines.join("\n");

    p.outro(
      `\n✅ Setup complete!\n` +
      verifyHeader +
      verifyBody +
      `\n\n` +
      verifyResult.pastePrompt +
      `\n`,
    );

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
    // If source looks like a plain name (no slashes, no protocol), it's not a valid
    // GitHub/URL source — give a clear "not found in catalog" message instead of
    // the confusing "Unable to parse source" thrown by parseSource.
    const looksLikeExternalSource =
      source.includes("/") || source.startsWith("http");
    if (!looksLikeExternalSource) {
      showError(
        `"${source}" not found in the builtin catalog. Run \`personal-ai-skills list ${contentType}\` to see available items, or pass a GitHub source like \`owner/repo\`.`,
      );
      return;
    }

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
 * Read the project slug from package.json `name`, falling back to the directory
 * basename. Slugified to lowercase + dashes.
 */
async function readProjectSlug(projectRoot: string): Promise<string | undefined> {
  let raw = path.basename(projectRoot);
  try {
    const pkgRaw = await fs.promises.readFile(
      path.join(projectRoot, "package.json"),
      "utf-8",
    );
    const pkg = JSON.parse(pkgRaw) as { name?: unknown };
    if (typeof pkg.name === "string" && pkg.name.length > 0) raw = pkg.name;
  } catch {
    // No package.json or unreadable — fall back to directory basename
  }
  const slug = raw
    .replace(/^@[^/]+\//, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug.length > 0 ? slug : undefined;
}

/**
 * Bridge command — generate context files for selected editors
 */
async function cmdBridge(
  _args: string[],
  options: CliArgs["options"],
): Promise<void> {
  const isGlobal = options.global;

  // Global bridge: write to ~/.claude/ so Claude Code loads it in every project
  const outputRoot = isGlobal
    ? path.join(process.env["HOME"] ?? "~", ".claude")
    : process.cwd();

  // Global mode defaults to claude-only bridge (the only editor with a true global config)
  const bridgeIds = isGlobal && !options.bridges
    ? ["claude"]
    : await resolveBridgeIds(options);

  if (bridgeIds.length === 0) {
    showInfo("No bridges selected.");
    return;
  }

  // For global bridge, reference ~/.ai/ instead of .ai/
  const prefs = await getPreferences("global");
  const vaultPath = prefs?.obsidianVaultPath ?? "~/ai-brain";

  // Derive installed items + project slug from local state when generating
  // a project bridge. Both are needed for CLAUDE.md to render the Skills/Agents
  // Maps and the Brain Map with real paths instead of placeholders.
  let installedItems: CatalogItem[] | undefined;
  let projectSlug: string | undefined;
  if (!isGlobal) {
    const installed = await getInstalledItems("project", outputRoot);
    installedItems = installed.map((i) => ({
      id: i.id,
      name: i.id,
      description: "",
      type: i.type,
      path: "",
    }));
    projectSlug = await readProjectSlug(outputRoot);
  }

  const files = await generateBridgeFilesForIds(
    bridgeIds,
    outputRoot,
    vaultPath,
    installedItems,
    projectSlug,
  );

  if (files.length === 0) {
    showInfo("No bridge files to generate.");
    return;
  }

  // Show what will be generated
  const label = isGlobal ? "Global bridge files (loaded in every project):" : "Bridge files to generate:";
  console.log(`\n${label}\n`);
  for (const file of files) {
    const fullPath = path.join(outputRoot, file.filePath);
    console.log(`  ${fullPath} — ${file.description}`);
  }
  console.log();

  // Confirm unless --yes
  if (!options.yes) {
    const confirmed = await p.confirm({
      message: `Generate ${files.length} context file${files.length !== 1 ? "s" : ""}?`,
    });
    if (p.isCancel(confirmed) || !confirmed) {
      p.cancel("Cancelled");
      return;
    }
  }

  const overwrite = options.yes
    ? true
    : (await p.confirm({
        message: "Overwrite existing files?",
        initialValue: isGlobal, // default true for global (update in place)
      })) === true;

  const { written, skipped } = await writeBridgeFiles(files, outputRoot, overwrite);

  if (written.length > 0) {
    showInfo(`Created: ${written.map((f) => path.join(outputRoot, f)).join(", ")}`);
  }
  if (skipped.length > 0) {
    showInfo(`Skipped (already exist): ${skipped.join(", ")}`);
  }

  const outro = isGlobal
    ? "Global bridge ready — Claude Code will load it in every project automatically."
    : "Bridge files ready — each editor now reads .ai/";
  p.outro(outro);
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

  const spinner = startSpinner(`Removing ${name}...`);

  const catalogItem: CatalogItem = {
    id: item.id,
    name: item.id,
    description: "",
    type: item.type,
    path: "",
  };

  const success = await uninstallItem(catalogItem, scope);

  if (success) {
    // Remove all assistant entries so the item disappears from lock file
    for (const assistantId of item.assistants) {
      await removeFromLockFile(item.type, item.id, assistantId, scope);
    }
    spinner.stop(`Removed ${name}`);
  } else {
    spinner.stop(`Failed to remove ${name}`);
  }
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
  args: string[],
  options: CliArgs["options"],
): Promise<void> {
  const scope: InstallScope = options.global ? "global" : "project";
  const allInstalled = await getInstalledItems(scope);

  if (allInstalled.length === 0) {
    showInfo(`No items installed${scope === "global" ? " globally" : " in this project"}. Run \`personal-ai-skills add <name>\` first.`);
    return;
  }

  // Optional: filter to a specific item name
  const filterName = args[0];
  const toUpdate = filterName
    ? allInstalled.filter((i) => i.id === filterName)
    : allInstalled;

  if (filterName && toUpdate.length === 0) {
    showError(`"${filterName}" is not installed. Run \`personal-ai-skills list --installed\` to see installed items.`);
    return;
  }

  // Load the full catalog to find updated templates
  const catalog = await loadCatalog();

  const s = startSpinner(`Updating ${toUpdate.length} item${toUpdate.length !== 1 ? "s" : ""}…`);

  let updated = 0;
  const notFound: string[] = [];
  const failed: string[] = [];

  for (const installed of toUpdate) {
    const catalogItems = catalog.get(installed.type as ContentType) ?? [];
    const catalogItem = catalogItems.find((i) => i.id === installed.id);

    if (!catalogItem) {
      // Custom/external install — can't update from builtin catalog
      notFound.push(installed.id);
      continue;
    }

    const allAssistants = getAllAssistants();
    const originalAssistants = installed.assistants
      .map((id) => allAssistants.find((a) => a.id === id))
      .filter(Boolean) as AssistantConfig[];

    const result = await installItems(
      [catalogItem],
      originalAssistants,
      installed.scope as InstallScope,
      installed.method as InstallMethod,
    );

    if (result.successful > 0) {
      updated++;
    } else {
      failed.push(installed.id);
    }
  }

  s.stop("Done");

  if (updated > 0) {
    p.log.success(`Updated ${updated} item${updated !== 1 ? "s" : ""} to latest version.`);
  }
  if (notFound.length > 0) {
    showInfo(`Skipped (custom/external — not in builtin catalog): ${notFound.join(", ")}`);
  }
  if (failed.length > 0) {
    showError(`Failed to update: ${failed.join(", ")}`);
  }
  if (updated === 0 && failed.length === 0 && notFound.length === 0) {
    showInfo("Everything is already up to date.");
  }
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

  // Detect column count from the header row so old 2-col tables still get
  // a matching 2-col row, and new 3-col (Topic | Keywords | Load) tables get
  // a 3-col row with the spec name as the default keyword.
  const headerCols = (lines[headerIdx].match(/\|/g) ?? []).length - 1;
  const newRow = headerCols >= 3
    ? `| ${specName} | ${specName} | \`${specRelPath}\` |`
    : `| ${specName} | \`${specRelPath}\` |`;
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
): Promise<{ specCreated: boolean; claudeCreated: boolean; subSpecsCreated: string[] }> {
  const templatesRoot = getPackageTemplatesRoot();
  let specCreated = false;
  let claudeCreated = false;
  const subSpecsCreated: string[] = [];

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

  // Example sub-spec stubs — make the docs/spec/<feature>/SPEC.md references
  // in CLAUDE.md/AGENTS.md actually resolve. Users delete what they don't need.
  const pageTemplate = await fs.promises.readFile(
    path.join(templatesRoot, "shared", "SPEC.page.md"),
    "utf-8",
  );
  const exampleSubSpecs = ["auth", "billing", "dashboard"];
  for (const name of exampleSubSpecs) {
    const subSpecDir = path.join(projectRoot, "docs", "spec", name);
    const subSpecDest = path.join(subSpecDir, "SPEC.md");
    if (!fs.existsSync(subSpecDest)) {
      const filled = pageTemplate
        .replace(/\{\{PAGE_NAME\}\}/g, name)
        .replace(/\{\{PROJECT_SLUG\}\}/g, setup.slug);
      await fs.promises.mkdir(subSpecDir, { recursive: true });
      await fs.promises.writeFile(subSpecDest, filled, "utf-8");
      subSpecsCreated.push(`docs/spec/${name}/SPEC.md`);
    }
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

  return { specCreated, claudeCreated, subSpecsCreated };
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

    const claudeMdExists = fs.existsSync(path.join(projectRoot, "CLAUDE.md"));
    const tail = claudeMdExists
      ? "\n  Re-run `personal-ai-skills bridge` to refresh CLAUDE.md Spec Map."
      : "";
    p.outro(
      `Created docs/spec/${specName}/SPEC.md${fs.existsSync(rootSpecPath) ? " and updated SPEC.md Spec Map" : ""}${tail}`,
    );
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
