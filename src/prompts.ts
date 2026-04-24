/**
 * Interactive CLI Prompts
 *
 * Beautiful CLI prompts using @clack/prompts for
 * multi-select, confirmations, and user interactions.
 */

import * as p from "@clack/prompts";
import type {
  ContentType,
  AssistantConfig,
  CatalogItem,
  InstallScope,
  InstallMethod,
  InstallOptions,
} from "./types.js";
import {
  getAllAssistants,
  detectInstalledAssistants,
  getAssistantsForContentType,
  getContentTypeDisplayName,
} from "./agents.js";

// Re-export types for consumers
export type { InstallScope, InstallMethod, InstallOptions } from "./types.js";

// ============================================================================
// Prompt Functions
// ============================================================================

/**
 * Select content types to install (multi-select)
 */
export async function selectContentTypes(): Promise<ContentType[] | symbol> {
  const contentTypes = await p.multiselect({
    message: "What do you want to install?",
    options: [
      {
        value: "skills" as ContentType,
        label: "Skills",
        hint: "Best practices and coding guidelines",
      },
      {
        value: "agents" as ContentType,
        label: "Agents",
        hint: "Specialized AI personas for specific tasks",
      },
      {
        value: "commands" as ContentType,
        label: "Commands",
        hint: "Reusable AI command templates",
      },
      {
        value: "rules" as ContentType,
        label: "Rules",
        hint: "Code style and linting rules",
      },
      {
        value: "prompts" as ContentType,
        label: "Prompts",
        hint: "Pre-built prompt templates",
      },
      {
        value: "integration" as ContentType,
        label: "Integrations",
        hint: "Obsidian, claude-mem, graphify — memory & knowledge tools",
      },
    ],
    required: true,
  });

  return contentTypes;
}

/**
 * Select a single content type (used by init command)
 */
export async function selectContentType(): Promise<ContentType | symbol> {
  const contentType = await p.select({
    message: "What type of content?",
    options: [
      {
        value: "skills" as ContentType,
        label: "Skills",
        hint: "Best practices and coding guidelines",
      },
      {
        value: "agents" as ContentType,
        label: "Agents",
        hint: "Specialized AI personas",
      },
      {
        value: "commands" as ContentType,
        label: "Commands",
        hint: "Reusable command templates",
      },
      {
        value: "rules" as ContentType,
        label: "Rules",
        hint: "Code style and linting rules",
      },
      {
        value: "prompts" as ContentType,
        label: "Prompts",
        hint: "Pre-built prompt templates",
      },
      {
        value: "integration" as ContentType,
        label: "Integrations",
        hint: "Obsidian, claude-mem, graphify",
      },
    ],
  });
  return contentType;
}

/**
 * Select items to install from catalog
 */
export async function selectItems(
  items: CatalogItem[],
  contentType: ContentType,
): Promise<CatalogItem[] | symbol> {
  const typeName = getContentTypeDisplayName(contentType);

  const selected = await p.multiselect({
    message: `Select ${typeName.toLowerCase()} to install`,
    options: items.map((item) => ({
      value: item,
      label: item.name,
      hint:
        item.description.slice(0, 60) +
        (item.description.length > 60 ? "..." : ""),
    })),
    required: true,
  });

  return selected;
}

/**
 * Select target AI assistants
 */
export async function selectAssistants(
  contentType: ContentType,
  preselect: boolean = true,
): Promise<AssistantConfig[] | symbol> {
  // Get assistants that support this content type
  const supportedAssistants = getAssistantsForContentType(contentType);

  // Detect installed assistants if preselecting
  let installedIds: Set<string> = new Set();
  if (preselect) {
    const installed = await detectInstalledAssistants();
    installedIds = new Set(installed.map((a) => a.id));
  }

  const selected = await p.multiselect({
    message: "Select AI assistants to install to",
    options: supportedAssistants.map((assistant) => ({
      value: assistant,
      label: assistant.name,
      hint: assistant.description,
    })),
    initialValues: preselect
      ? supportedAssistants.filter((a) => installedIds.has(a.id))
      : [],
    required: true,
  });

  return selected;
}

/**
 * Select installation scope
 */
export async function selectScope(): Promise<InstallScope | symbol> {
  const scope = await p.select({
    message: "Installation scope",
    options: [
      {
        value: "project" as InstallScope,
        label: "Project",
        hint: "Install in current directory (committed with project)",
      },
      {
        value: "global" as InstallScope,
        label: "Global",
        hint: "Install in home directory (available across all projects)",
      },
    ],
  });

  return scope;
}

/**
 * Select installation method
 */
export async function selectMethod(): Promise<InstallMethod | symbol> {
  const method = await p.select({
    message: "Installation method",
    options: [
      {
        value: "symlink" as InstallMethod,
        label: "Symlink (Recommended)",
        hint: "Single source of truth, easy updates",
      },
      {
        value: "copy" as InstallMethod,
        label: "Copy to all agents",
        hint: "Independent copies for each assistant",
      },
    ],
  });

  return method;
}

/**
 * Confirm installation
 */
export async function confirmInstall(
  options: InstallOptions,
): Promise<boolean | symbol> {
  const { items, assistants, scope } = options;

  const itemNames = items.map((i) => i.name).join(", ");
  const assistantNames = assistants.map((a) => a.name).join(", ");

  p.note(
    [
      `Items: ${itemNames}`,
      `Assistants: ${assistantNames}`,
      `Scope: ${scope}`,
      `Destination: .ai/`,
    ].join("\n"),
    "Installation Summary",
  );

  const confirmed = await p.confirm({
    message: "Proceed with installation?",
  });

  return confirmed;
}

// ============================================================================
// Wizard Result Types
// ============================================================================

export interface ProjectSetup {
  name: string;
  description: string;
  stack: string;
  slug: string;
}

export interface WizardResult extends InstallOptions {
  obsidianVaultPath: string;
  memoryTools: string[];         // e.g. ['obsidian', 'claude-mem', 'graphify']
  projectSetup?: ProjectSetup;   // undefined = user skipped spec scaffolding
  bridgeIds: string[];           // which bridge files to generate
}

export function getMemoryToolNextStep(tool: string, vaultPath: string): string | undefined {
  const steps: Record<string, string> = {
    obsidian: `git clone https://github.com/AgriciDaniel/claude-obsidian ${vaultPath}`,
    "claude-mem": "npx claude-mem install",
    graphify: "pip install graphifyy && graphify install",
  };
  return steps[tool];
}

// Kept for backward compatibility — prefer getMemoryToolNextStep with actual vault path
export const MEMORY_TOOL_NEXT_STEPS_MAP: Record<string, string> = {
  obsidian: "git clone https://github.com/AgriciDaniel/claude-obsidian ~/ai-brain",
  "claude-mem": "npx claude-mem install",
  graphify: "pip install graphifyy && graphify install",
};

// ============================================================================
// Step 1 helpers
// ============================================================================

export async function askObsidianVaultPath(
  existingPath?: string,
): Promise<string | symbol> {
  return p.text({
    message: "Where is your Obsidian vault (second brain)?",
    placeholder: "~/ai-brain",
    defaultValue: existingPath || "~/ai-brain",
    validate(value) {
      if (!value?.trim()) return "Path cannot be empty";
    },
  });
}

export async function selectMemoryTools(): Promise<string[] | symbol> {
  return p.multiselect({
    message: "Set up memory tools (select any — or press Enter to skip):",
    options: [
      {
        value: "obsidian",
        label: "claude-obsidian",
        hint: "second brain — drop files in .raw/, Claude organises wiki/",
      },
      {
        value: "claude-mem",
        label: "claude-mem",
        hint: "session memory — ~10x token savings, runs automatically",
      },
      {
        value: "graphify",
        label: "graphify (optional)",
        hint: "knowledge graph — 71x token reduction for large codebases",
      },
    ],
    required: false,
  });
}

// ============================================================================
// Step 3 helpers
// ============================================================================

export async function askProjectSetup(
  defaultName: string,
): Promise<ProjectSetup | null | symbol> {
  const wantsSpec = await p.confirm({
    message: "Create SPEC.md + CLAUDE.md for this project?",
    initialValue: true,
  });
  if (p.isCancel(wantsSpec) || !wantsSpec) return null;

  const name = await p.text({
    message: "Project name:",
    placeholder: defaultName,
    defaultValue: defaultName,
  });
  if (p.isCancel(name)) return name;

  const description = await p.text({
    message: "One-line description:",
    placeholder: "What does this project do?",
  });
  if (p.isCancel(description)) return description;

  const stack = await p.text({
    message: "Tech stack:",
    placeholder: "Next.js, TypeScript, Postgres",
  });
  if (p.isCancel(stack)) return stack;

  const slug = String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return {
    name: String(name),
    description: String(description),
    stack: String(stack),
    slug,
  };
}

// ============================================================================
// Main wizard
// ============================================================================

/**
 * Full 4-step onboarding wizard:
 *   1. Memory stack (vault path + tool selection)
 *   2. Content install (skills, agents, integrations, …)
 *   3. Project setup (SPEC.md + CLAUDE.md)
 *   4. Bridge files (which editors)
 */
export async function runInteractiveInstall(
  catalog: Map<ContentType, CatalogItem[]>,
  savedVaultPath?: string,
  defaultProjectName?: string,
): Promise<WizardResult | null> {
  p.intro("🚀 personal-ai-skills");

  // ── Step 1: Memory Stack ─────────────────────────────────────────────────
  p.log.step("Step 1 of 4 — Memory Stack");

  const vaultPathResult = await askObsidianVaultPath(savedVaultPath);
  if (p.isCancel(vaultPathResult)) { p.cancel("Cancelled"); return null; }
  const obsidianVaultPath = (vaultPathResult as string).trim() || "~/ai-brain";

  const memoryResult = await selectMemoryTools();
  if (p.isCancel(memoryResult)) { p.cancel("Cancelled"); return null; }
  const memoryTools = (memoryResult as string[]) ?? [];

  // ── Step 2: Content ──────────────────────────────────────────────────────
  p.log.step("Step 2 of 4 — Install Content");

  const contentTypesResult = await selectContentTypes();
  if (p.isCancel(contentTypesResult)) { p.cancel("Cancelled"); return null; }
  const contentTypes = contentTypesResult as ContentType[];

  const allSelectedItems: CatalogItem[] = [];
  for (const contentType of contentTypes) {
    const available = catalog.get(contentType) || [];
    if (available.length === 0) {
      p.log.warn(`No ${getContentTypeDisplayName(contentType).toLowerCase()} available, skipping.`);
      continue;
    }
    const selectedResult = await selectItems(available, contentType);
    if (p.isCancel(selectedResult)) { p.cancel("Cancelled"); return null; }
    allSelectedItems.push(...(selectedResult as CatalogItem[]));
  }

  // ── Step 3: Project Setup ────────────────────────────────────────────────
  p.log.step("Step 3 of 4 — Project Setup");

  const setupResult = await askProjectSetup(defaultProjectName || "my-project");
  if (p.isCancel(setupResult)) { p.cancel("Cancelled"); return null; }
  const projectSetup = setupResult ?? undefined;

  // ── Step 4: Bridge Files ─────────────────────────────────────────────────
  p.log.step("Step 4 of 4 — Bridge Files");

  const bridgeResult = await selectBridges();
  if (p.isCancel(bridgeResult)) { p.cancel("Cancelled"); return null; }
  const bridgeIds = (bridgeResult as string[]) ?? [];

  // ── Resolve assistants & scope ───────────────────────────────────────────
  const detectedAssistants = await detectInstalledAssistants();
  const assistants = detectedAssistants.length > 0
    ? detectedAssistants
    : getAllAssistants().slice(0, 1);

  const scope = "project" as InstallScope;

  if (allSelectedItems.length === 0 && !projectSetup && memoryTools.length === 0) {
    p.cancel("Nothing selected — nothing to do.");
    return null;
  }

  return {
    items: allSelectedItems,
    assistants,
    scope,
    method: "symlink" as InstallMethod,
    obsidianVaultPath,
    memoryTools,
    projectSetup,
    bridgeIds,
  };
}

/**
 * Display installation success message
 */
export function showInstallSuccess(
  items: CatalogItem[],
  assistants: AssistantConfig[],
): void {
  const itemList = items.map((i) => `  • ${i.name}`).join("\n");

  const setupItems = items.filter((i) => i.type === "integration" && i.setup);
  const setupNote =
    setupItems.length > 0
      ? `\n\nNext step — run to complete setup:\n${setupItems.map((i) => `  ${i.name}: ${i.setup}`).join("\n")}`
      : "";

  if (assistants.length === 0 || (assistants.length === 1 && assistants[0]?.id === "universal")) {
    p.outro(`✅ Successfully installed!\n\nItems:\n${itemList}${setupNote}`);
  } else {
    const assistantList = assistants.map((a) => `  • ${a.name}`).join("\n");
    p.outro(
      `✅ Successfully installed!\n\nItems:\n${itemList}\n\nTo:\n${assistantList}${setupNote}`,
    );
  }
}

/**
 * Display error message
 */
export function showError(message: string): void {
  p.log.error(message);
}

/**
 * Display info message
 */
export function showInfo(message: string): void {
  p.log.info(message);
}

/**
 * Display warning message
 */
export function showWarning(message: string): void {
  p.log.warn(message);
}

/**
 * Start a spinner
 */
export function startSpinner(message: string): ReturnType<typeof p.spinner> {
  const s = p.spinner();
  s.start(message);
  return s;
}

// ============================================================================
// Bridge Selection
// ============================================================================

export interface BridgeOption {
  value: string;
  label: string;
  hint: string;
}

const BRIDGE_OPTIONS: BridgeOption[] = [
  { value: "claude", label: "Claude Code", hint: "CLAUDE.md" },
  { value: "cursor", label: "Cursor", hint: ".cursor/rules" },
  { value: "vscode", label: "VS Code", hint: ".vscode/settings.json" },
  {
    value: "copilot",
    label: "GitHub Copilot",
    hint: "AGENTS.md + .github/copilot-instructions.md",
  },
  { value: "codex", label: "OpenAI Codex", hint: "AGENTS.md" },
  { value: "gemini", label: "Gemini CLI", hint: "GEMINI.md" },
  { value: "windsurf", label: "Windsurf", hint: ".windsurfrules" },
];

/**
 * All known bridge IDs
 */
export const ALL_BRIDGE_IDS: string[] = BRIDGE_OPTIONS.map((o) => o.value);

/**
 * Interactively ask which AI assistants should get bridge files.
 * Returns selected bridge IDs, 'all', or 'none'.
 */
export async function selectBridges(): Promise<string[] | symbol> {
  const result = await p.multiselect({
    message: "Which AI assistants should get bridge files?",
    options: BRIDGE_OPTIONS,
    required: false,
  });

  return result;
}
