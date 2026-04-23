/**
 * Bridge Context Files
 *
 * Generates editor-specific context files that point to .ai/ as
 * the single source of truth for AI configuration.
 *
 * Instead of duplicating content into each editor's config dir,
 * we create one small "bridge" file per editor that says:
 * "Read .ai/ for all AI instructions."
 *
 * This makes AI behavior portable — switch editors without losing anything.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import type { AssistantConfig, ContentType } from "./types.js";
import { CANONICAL_DIR } from "./agents.js";

// ============================================================================
// Types
// ============================================================================

export interface BridgeFile {
  /** Editor this bridge file targets */
  editorId: string;
  /** File path relative to project root */
  filePath: string;
  /** File content */
  content: string;
  /** Short description */
  description: string;
  /**
   * When true, always write even if the file already exists.
   * Used by the VS Code bridge which merges into .vscode/settings.json
   * rather than replacing it.
   */
  alwaysWrite?: boolean;
}

// ============================================================================
// Bridge File Templates
// ============================================================================

/**
 * Get all content subdirectories that actually exist in .ai/
 */
async function getExistingDirs(projectRoot: string): Promise<string[]> {
  const aiDir = path.join(projectRoot, CANONICAL_DIR);
  const types: ContentType[] = [
    "skills",
    "rules",
    "agents",
    "commands",
    "prompts",
  ];
  const existing: string[] = [];

  for (const type of types) {
    try {
      const stats = await fs.promises.stat(path.join(aiDir, type));
      if (stats.isDirectory()) existing.push(type);
    } catch {
      // Doesn't exist
    }
  }

  // Also check for context/ directory
  try {
    const stats = await fs.promises.stat(path.join(aiDir, "context"));
    if (stats.isDirectory()) existing.push("context");
  } catch {
    // Doesn't exist
  }

  return existing;
}

/**
 * Build a directory listing block for bridge files
 */
function buildDirectorySection(dirs: string[]): string {
  if (dirs.length === 0) return "";

  const lines = dirs.map((d) => `- \`.ai/${d}/\` — ${getDirDescription(d)}`);
  return `\n## AI Configuration\n\nThis project uses \`.ai/\` as the single source of truth for AI behavior.\nAlways read and follow the guidelines in:\n\n${lines.join("\n")}\n`;
}

function getDirDescription(dir: string): string {
  const descriptions: Record<string, string> = {
    skills: "Coding best practices, patterns, and playbooks",
    rules: "Hard constraints and conventions (always follow these)",
    agents: "Specialized AI personas for specific tasks",
    commands: "Reusable command templates and macros",
    prompts: "Pre-built prompt templates",
    context: "Project context, architecture, and domain knowledge",
  };
  return descriptions[dir] || dir;
}

/**
 * Build the core instructions block (shared across all editors)
 */
function buildCoreInstructions(dirs: string[]): string {
  const sections: string[] = [];

  if (dirs.includes("rules")) {
    sections.push(
      "Before writing any code, read all files in `.ai/rules/`. These are hard constraints — never violate them.",
    );
  }

  if (dirs.includes("skills")) {
    sections.push(
      "When working on code, check `.ai/skills/` for relevant guidelines. Apply matching skill files to your work.",
    );
  }

  if (dirs.includes("context")) {
    sections.push(
      "For project context (architecture, conventions, domain), consult `.ai/context/`.",
    );
  }

  if (dirs.includes("commands")) {
    sections.push(
      "Reusable command templates are in `.ai/commands/`. Use them when the user references a command by name.",
    );
  }

  if (sections.length === 0) return "";

  return `\n## Instructions\n\n${sections.join("\n\n")}\n`;
}

// ============================================================================
// Editor-Specific Bridge Files
// ============================================================================

function claudeBridge(dirs: string[], vaultPath = "~/ai-brain"): BridgeFile {
  const skillsLine = dirs.includes("skills")
    ? "\n| React / TS components   | `.ai/skills/modern-react/`           |\n| API routes, REST        | `.ai/skills/api-design/`             |\n| Tests                   | `.ai/skills/testing-best-practices/` |"
    : "";
  const agentsLine = dirs.includes("agents")
    ? "\n\n## 🗺️ Agents Map\n| Role requested          | Load                                 |\n| ----------------------- | ------------------------------------ |\n| Code review             | `.ai/agents/code-reviewer/`          |\n| Security audit          | `.ai/agents/security-auditor/`       |"
    : "";
  const rulesLine = dirs.includes("rules")
    ? "\n- Core rules: `.ai/rules/always.md` — always follow"
    : "";
  const commandsLine = dirs.includes("commands")
    ? "\n- Commands: `.ai/commands/` — load when user references a slash command"
    : "";

  const skillsSection = dirs.includes("skills")
    ? `\n\n## 🗺️ Skills Map\n| When working on         | Load                                 |\n| ----------------------- | ------------------------------------ |${skillsLine}`
    : "";

  return {
    editorId: "claude",
    filePath: "CLAUDE.md",
    description: "Claude Code context file (map pattern)",
    content: `# CLAUDE.md

<!--
  Entry point for every Claude session. Keep this file THIN — it is a MAP.
  Target: under 100 tokens. Real content lives in the files it points to.
-->

## ⚡ Always Load
- Root spec: \`SPEC.md\` — what this project is, tech stack, key rules${rulesLine}

## 🗺️ Spec Map
> Load the matching sub-spec when the user mentions these topics.

| Topic                    | Keywords                              | Load                              |
| ------------------------ | ------------------------------------- | --------------------------------- |
| auth, login, session     | auth, login, logout, JWT, password    | \`docs/spec/auth/SPEC.md\`        |
| (add more rows below)    | (keywords)                            | \`docs/spec/<name>/SPEC.md\`      |
${skillsSection}${agentsLine}${commandsLine}

## 🗺️ Obsidian Map
| Topic                    | Load                                                     |
| ------------------------ | -------------------------------------------------------- |
| Recent session context   | \`${vaultPath}/wiki/hot.md\`                             |
| Architecture decisions   | \`${vaultPath}/wiki/projects/<slug>/decisions.md\`       |

## 🧠 Memory
claude-mem runs automatically — past session context is already injected.
Use \`search_memory\` MCP tool if you need older context.
`,
  };
}

function cursorBridge(dirs: string[]): BridgeFile {
  return {
    editorId: "cursor",
    filePath: ".cursor/rules/ai-config.mdc",
    description: "Cursor rules file",
    content: `---
description: AI configuration — read .ai/ for all guidelines
globs:
alwaysApply: true
---
${buildDirectorySection(dirs)}${buildCoreInstructions(dirs)}`,
  };
}

function copilotBridge(dirs: string[]): BridgeFile {
  return {
    editorId: "copilot",
    filePath: ".github/copilot-instructions.md",
    description: "GitHub Copilot instructions",
    content: `# Copilot Instructions
${buildDirectorySection(dirs)}${buildCoreInstructions(dirs)}`,
  };
}

function geminiBridge(dirs: string[]): BridgeFile {
  return {
    editorId: "gemini",
    filePath: "GEMINI.md",
    description: "Gemini CLI context file",
    content: `# GEMINI.md
${buildDirectorySection(dirs)}${buildCoreInstructions(dirs)}`,
  };
}

function windsurfBridge(dirs: string[]): BridgeFile {
  return {
    editorId: "windsurf",
    filePath: ".windsurfrules",
    description: "Windsurf rules file",
    content: `# Windsurf Rules
${buildDirectorySection(dirs)}${buildCoreInstructions(dirs)}`,
  };
}

function agentsBridge(dirs: string[]): BridgeFile {
  return {
    editorId: "universal",
    filePath: "AGENTS.md",
    description: "Universal agents context file (Codex, Amp, OpenCode, etc.)",
    content: `# AGENTS.md
${buildDirectorySection(dirs)}${buildCoreInstructions(dirs)}`,
  };
}

/**
 * VS Code bridge — merges Copilot instruction settings into .vscode/settings.json.
 * Reads the existing file and adds keys only if not already present,
 * preserving all other user settings.
 */
async function vscodeBridge(
  dirs: string[],
  projectRoot: string,
): Promise<BridgeFile> {
  const settingsPath = path.join(projectRoot, ".vscode", "settings.json");
  let existing: Record<string, unknown> = {};

  try {
    const raw = await fs.promises.readFile(settingsPath, "utf-8");
    existing = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    // File doesn't exist or contains invalid JSON — start fresh
  }

  const rulesPath = dirs.includes("rules") ? ".ai/rules/always.md" : ".ai/rules/";
  const copilotSettings: Record<string, unknown> = {
    "github.copilot.chat.codeGeneration.instructions": [
      { file: rulesPath },
      {
        text: "For skills, load files from .ai/skills/ when the topic matches.",
      },
    ],
    "github.copilot.chat.testGeneration.instructions": [
      { file: ".ai/skills/testing-best-practices/SKILL.md" },
    ],
    "github.copilot.chat.reviewSelection.instructions": [
      { file: ".ai/agents/code-reviewer/AGENT.md" },
    ],
  };

  // Merge: keep all existing keys; add copilot keys only if not already present
  const merged: Record<string, unknown> = { ...existing };
  for (const [key, value] of Object.entries(copilotSettings)) {
    if (!(key in merged)) {
      merged[key] = value;
    }
  }

  return {
    editorId: "vscode",
    filePath: ".vscode/settings.json",
    description: "VS Code settings with Copilot instructions",
    content: JSON.stringify(merged, null, 2),
    alwaysWrite: true,
  };
}

// ============================================================================
// Registry
// ============================================================================

/** All available bridge file generators, keyed by editor ID */
const BRIDGE_GENERATORS: Record<string, (dirs: string[], vaultPath?: string) => BridgeFile> = {
  claude: claudeBridge,
  cursor: cursorBridge,
  copilot: copilotBridge,
  gemini: geminiBridge,
  windsurf: windsurfBridge,
  universal: agentsBridge,
};

/** Map assistant IDs to bridge generator keys */
const ASSISTANT_TO_BRIDGE: Record<string, string> = {
  claude: "claude",
  cursor: "cursor",
  vscode: "vscode",
  copilot: "copilot",
  gemini: "gemini",
  antigravity: "gemini",
  windsurf: "windsurf",
  codex: "universal",
  amp: "universal",
  opencode: "universal",
  cline: "universal",
  roo: "universal",
  continue: "universal",
  goose: "universal",
  kiro: "universal",
  trae: "universal",
  augment: "universal",
  droid: "universal",
  kilo: "universal",
};

// ============================================================================
// Public API
// ============================================================================

/**
 * Generate bridge files for the given assistants.
 * Deduplicates (e.g., won't write AGENTS.md twice if both Codex and Amp are detected).
 */
export async function generateBridgeFiles(
  assistants: AssistantConfig[],
  projectRoot: string = process.cwd(),
  vaultPath?: string,
): Promise<BridgeFile[]> {
  const dirs = await getExistingDirs(projectRoot);
  if (dirs.length === 0) {
    dirs.push("skills", "rules");
  }

  const bridgeKeys = new Set<string>();
  for (const assistant of assistants) {
    const key = ASSISTANT_TO_BRIDGE[assistant.id];
    if (key) bridgeKeys.add(key);
  }
  bridgeKeys.add("universal");

  const files: BridgeFile[] = [];
  for (const key of bridgeKeys) {
    if (key === "vscode") {
      files.push(await vscodeBridge(dirs, projectRoot));
    } else {
      const generator = BRIDGE_GENERATORS[key];
      if (generator) {
        files.push(generator(dirs, vaultPath));
      }
    }
  }

  return files;
}

/**
 * Write bridge files to disk. Only writes if file doesn't exist
 * (never overwrites user-customized context files).
 */
export async function writeBridgeFiles(
  files: BridgeFile[],
  projectRoot: string = process.cwd(),
  overwrite: boolean = false,
): Promise<{ written: string[]; skipped: string[] }> {
  const written: string[] = [];
  const skipped: string[] = [];

  for (const file of files) {
    const fullPath = path.join(projectRoot, file.filePath);

    // Don't overwrite existing files unless explicitly asked.
    // alwaysWrite bypasses this guard (used by VS Code bridge which merges JSON).
    if (!overwrite && !file.alwaysWrite) {
      try {
        await fs.promises.access(fullPath);
        skipped.push(file.filePath);
        continue;
      } catch {
        // File doesn't exist — safe to write
      }
    }

    await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.promises.writeFile(fullPath, file.content, "utf-8");
    written.push(file.filePath);
  }

  return { written, skipped };
}

/**
 * Get all available bridge file types
 */
export function getAvailableBridgeTypes(): string[] {
  return [...Object.keys(BRIDGE_GENERATORS), "vscode"];
}

/**
 * Generate bridge files for an explicit list of bridge IDs.
 *
 * - `['all']` → all known bridge types
 * - `['none']` → empty array (no bridges)
 * - `['claude', 'vscode', ...]` → only those bridge types
 */
export async function generateBridgeFilesForIds(
  bridgeIds: string[],
  projectRoot: string = process.cwd(),
  vaultPath?: string,
): Promise<BridgeFile[]> {
  if (bridgeIds.length === 0 || bridgeIds.includes("none")) {
    return [];
  }

  const dirs = await getExistingDirs(projectRoot);
  if (dirs.length === 0) {
    dirs.push("skills", "rules");
  }

  const resolveKey = (id: string): string => ASSISTANT_TO_BRIDGE[id] ?? id;

  const keys = bridgeIds.includes("all")
    ? new Set(getAvailableBridgeTypes())
    : new Set(bridgeIds.map(resolveKey));

  const files: BridgeFile[] = [];
  for (const key of keys) {
    if (key === "vscode") {
      files.push(await vscodeBridge(dirs, projectRoot));
    } else {
      const generator = BRIDGE_GENERATORS[key];
      if (generator) {
        files.push(generator(dirs, vaultPath));
      }
    }
  }

  return files;
}
