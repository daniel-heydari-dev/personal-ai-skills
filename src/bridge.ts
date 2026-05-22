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
import type { AssistantConfig, ContentType, CatalogItem } from "./types.js";
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
 * Scan `docs/spec/*&#47;SPEC.md` and return the names + first heading (used as topic).
 * Empty list means the project has no sub-specs yet — caller should emit a comment-only example.
 */
async function getSubSpecs(
  projectRoot: string,
): Promise<{ name: string; topic: string }[]> {
  const specRoot = path.join(projectRoot, "docs", "spec");
  let entries: string[];
  try {
    entries = await fs.promises.readdir(specRoot);
  } catch {
    return [];
  }
  const found: { name: string; topic: string }[] = [];
  for (const name of entries) {
    const specPath = path.join(specRoot, name, "SPEC.md");
    try {
      const stat = await fs.promises.stat(specPath);
      if (!stat.isFile()) continue;
    } catch {
      continue;
    }
    let topic = name;
    try {
      const raw = await fs.promises.readFile(specPath, "utf-8");
      const heading = raw.match(/^#\s+(.+)$/m);
      if (heading?.[1]) topic = heading[1].replace(/\s+—.*$/, "").trim();
    } catch {
      // ignore — fall back to the folder name
    }
    found.push({ name, topic });
  }
  return found;
}

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
  const sections: string[] = [
    "Read `SPEC.md` for project facts, stack, and key invariants.",
    "Load `docs/spec/<feature>/SPEC.md` when the user's task mentions that feature.",
  ];

  if (dirs.includes("rules")) {
    sections.push(
      "Read all files in `.ai/rules/` first — hard constraints, never violate.",
    );
  }

  if (dirs.includes("skills")) {
    sections.push(
      "Load `.ai/skills/<name>/` when the topic matches.",
    );
  }

  if (dirs.includes("context")) {
    sections.push(
      "Project context (architecture, domain) lives in `.ai/context/`.",
    );
  }

  if (dirs.includes("commands")) {
    sections.push(
      "Command templates in `.ai/commands/` — use when the user references one by name.",
    );
  }

  return `\n## Instructions\n\n${sections.join("\n")}\n`;
}

// ============================================================================
// Editor-Specific Bridge Files
// ============================================================================

function buildSkillsMap(skills: CatalogItem[]): string {
  if (skills.length === 0) return "";
  const rows = skills.map((s) => `| ${s.name} | \`.ai/skills/${s.id}/\` |`).join("\n");
  return `\n\n## 🗺️ Skills Map\n| Skill | Load |\n| --- | --- |\n${rows}`;
}

function buildAgentsMap(agents: CatalogItem[]): string {
  if (agents.length === 0) return "";
  const rows = agents.map((a) => `| ${a.name} | \`.ai/agents/${a.id}/\` |`).join("\n");
  return `\n\n## 🗺️ Agents Map\n| Agent | Load |\n| --- | --- |\n${rows}`;
}

function buildSpecMapBlock(subSpecs: { name: string; topic: string }[]): string {
  if (subSpecs.length === 0) {
    return `<!--
  No sub-specs yet. When you scaffold one, a row will appear here.
  Scaffold:  npx personal-ai-skills init spec <name>
  Example:   npx personal-ai-skills init spec billing
             → creates docs/spec/billing/SPEC.md
             → re-run \`npx personal-ai-skills bridge\` to refresh this map

  Example rows (delete this block once you have real sub-specs):
  | auth, login       | auth, login, logout, JWT, session   | docs/spec/auth/SPEC.md      |
  | billing, payments | billing, stripe, invoice, plan      | docs/spec/billing/SPEC.md   |
  | dashboard         | dashboard, chart, metrics, report   | docs/spec/dashboard/SPEC.md |
-->`;
  }
  const rows = subSpecs
    .map((s) => `| ${s.topic} | ${s.name} | \`docs/spec/${s.name}/SPEC.md\` |`)
    .join("\n");
  return `| Topic | Keywords | Load |
| --- | --- | --- |
${rows}`;
}

/**
 * Build the routing-map body shared by CLAUDE.md and AGENTS.md.
 * Both files use identical maps — only the header/title differs.
 *
 * Uses Claude's `@path` import syntax for files Claude should treat as
 * lazy-loaded references (https://code.claude.com/docs/en/memory#imports).
 * Non-Claude editors read `@path` as a literal string pointer, so the same
 * file works for Codex, Amp, OpenCode, Neovim, etc.
 */
function buildRoutingMaps(
  dirs: string[],
  vaultPath: string,
  installedItems: CatalogItem[] | undefined,
  projectSlug: string | undefined,
  subSpecs: { name: string; topic: string }[],
  memoryNote: string,
): string {
  const installedSkills = installedItems?.filter((i) => i.type === "skills") ?? [];
  const installedAgents = installedItems?.filter((i) => i.type === "agents") ?? [];
  const installedRules = installedItems?.filter((i) => i.type === "rules") ?? [];

  const alwaysLoad = ["- Root spec: @SPEC.md"];
  if (dirs.includes("rules")) {
    alwaysLoad.push("- Always-on rules: @.ai/rules/always.md");
    // Each installed rule lives in its own folder — import them explicitly so
    // Claude's @-import lazy-loader picks them up. Without this, only
    // always.md would be loaded and per-rule files (e.g. small-components)
    // would sit unused on disk.
    for (const rule of installedRules) {
      alwaysLoad.push(`- @.ai/rules/${rule.id}/RULE.md`);
    }
  }
  if (dirs.includes("commands")) alwaysLoad.push("- Slash commands: `.ai/commands/<name>/COMMAND.md` — load when the user references one by name");

  const sections: string[] = [];
  sections.push(`## ⚡ Always Load\n${alwaysLoad.join("\n")}`);
  sections.push(`## 🗺️ Spec Map\n${buildSpecMapBlock(subSpecs)}`);
  if (dirs.includes("skills") && installedSkills.length > 0) {
    sections.push(buildSkillsMap(installedSkills).trim());
  }
  if (dirs.includes("agents") && installedAgents.length > 0) {
    sections.push(buildAgentsMap(installedAgents).trim());
  }

  const slug = projectSlug ?? "<your-project-slug>";
  const projectPath = `${vaultPath}/wiki/projects/${slug}`;
  sections.push(`## 🗺️ Brain Map
> Load in priority order when context seems lost or session resumed.

| What | When to load | Path |
| --- | --- | --- |
| **Session log** | First — resuming session, after compaction | \`.claude/session-log.md\` |
| Recent session cache | Cross-session history | \`${vaultPath}/wiki/hot.md\` |
| This project's notes | Feature context, past work | \`${projectPath}/\` |
| Architecture decisions | ADRs, why decisions were made | \`${projectPath}/decisions.md\` |
| Cross-project contracts | API contracts with other projects | \`${vaultPath}/wiki/projects/shared/api-contracts.md\` |`);
  sections.push(`## 🧠 Memory\n${memoryNote}`);

  return sections.join("\n\n");
}

const HEADER_COMMENT = `<!--
  Routing map. Loaded every session. Keep it THIN — every line should
  pass the test: "would removing this cause a mistake?"

  Anthropic best practices:  https://code.claude.com/docs/en/best-practices
  Memory & imports:          https://code.claude.com/docs/en/memory
  AGENTS.md spec:            https://agents.md/

  THREE-TIER LOADING (token efficiency):
    @SPEC.md                 ← always loaded (~150 tokens)
    @docs/spec/<feature>/    ← on demand, when a keyword matches (~200 tokens)
    .ai/skills/<name>/       ← on demand, when the topic matches

  The @path syntax is a Claude-native lazy-load directive. Non-Claude editors
  read it as a plain pointer — works in both worlds.
-->`;

const CLAUDE_MEMORY_NOTE = `- **\`.claude/session-log.md\`** — git snapshot written after every turn. Read this first when resuming or context feels lost. Shows WHAT changed this session.
- **claude-mem** auto-injects recent session context — don't repeat what's already there.
- **\`search_memory\`** (MCP tool) — use for older sessions or specific past decisions.
- **\`/graphify\`** — invoke for large-codebase navigation (up to 71× token reduction).`;

const AGENTS_MEMORY_NOTE = `- Past session context is auto-injected when the editor supports it.
- If no context appears, ask the user for it explicitly.
- For large-codebase navigation, ask the user to run \`/graphify\` or \`graphify install\`.`;

async function hasGraphifyDir(projectRoot: string): Promise<boolean> {
  try {
    const stats = await fs.promises.stat(path.join(projectRoot, "graphify-out"));
    return stats.isDirectory();
  } catch {
    return false;
  }
}

function claudeBridge(
  dirs: string[],
  vaultPath = "~/ai-brain",
  installedItems?: CatalogItem[],
  projectSlug?: string,
  subSpecs: { name: string; topic: string }[] = [],
  hasGraphify = false,
): BridgeFile {
  const body = buildRoutingMaps(
    dirs,
    vaultPath,
    installedItems,
    projectSlug,
    subSpecs,
    CLAUDE_MEMORY_NOTE,
  );
  const graphifySection = hasGraphify
    ? `\n\n## graphify\n\nThis project has a graphify knowledge graph at graphify-out/.\n\nRules:\n\n- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure\n- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files\n- After modifying code files in this session, run \`graphify update .\` to keep the graph current (AST-only, no API cost)`
    : "";
  return {
    editorId: "claude",
    filePath: "CLAUDE.md",
    description: "Claude Code context file (map pattern)",
    content: `# CLAUDE.md\n\n${HEADER_COMMENT}\n\n${body}${graphifySection}\n`,
  };
}

function claudeSettingsLocalBridge(
  vaultPath: string,
  projectName: string,
  projectSlug: string,
): BridgeFile {
  const command = [
    `PROJECT_NAME='${projectName}'`,
    `VAULT='${vaultPath}'`,
    `SLUG='${projectSlug}'`,
    `echo "=== $PROJECT_NAME SESSION START ==="`,
    `echo`,
    `if [ -f .ai/AI-CONTEXT.md ]; then echo '--- .ai/AI-CONTEXT.md ---'; cat .ai/AI-CONTEXT.md; echo; fi`,
    `if [ -f "$VAULT/wiki/projects/$SLUG/status.md" ]; then echo '--- VAULT status.md ---'; cat "$VAULT/wiki/projects/$SLUG/status.md"; echo; fi`,
    `if [ -f "$VAULT/wiki/projects/$SLUG/open-questions.md" ]; then echo '--- VAULT open-questions.md ---'; cat "$VAULT/wiki/projects/$SLUG/open-questions.md"; echo; fi`,
    `if [ -f "$VAULT/wiki/projects/$SLUG/decisions.md" ]; then echo '--- VAULT decisions.md (locked ADRs) ---'; cat "$VAULT/wiki/projects/$SLUG/decisions.md"; echo; fi`,
    `echo '=== WORKFLOW REMINDER ==='`,
    `echo 'Before re-reading source files: query claude-mem search for the topic.'`,
    `echo 'Code exploration: prefer smart_search / smart_outline / Explore subagent over raw Read.'`,
    `echo 'After concrete change: update vault, replace stale entries (do not append).'`,
    `echo '======================================='`,
  ].join("; ");

  const content = JSON.stringify(
    {
      hooks: {
        SessionStart: [
          {
            matcher: "startup",
            hooks: [{ type: "command", command }],
          },
        ],
      },
    },
    null,
    2,
  );

  return {
    editorId: "claude",
    filePath: ".claude/settings.local.json",
    description: "Claude Code session-start hook (local, not committed)",
    content: `${content}\n`,
  };
}

function agentsBridge(
  dirs: string[],
  vaultPath = "~/ai-brain",
  installedItems?: CatalogItem[],
  projectSlug?: string,
  subSpecs: { name: string; topic: string }[] = [],
): BridgeFile {
  const body = buildRoutingMaps(
    dirs,
    vaultPath,
    installedItems,
    projectSlug,
    subSpecs,
    AGENTS_MEMORY_NOTE,
  );
  return {
    editorId: "universal",
    filePath: "AGENTS.md",
    description: "Universal agents context file (Codex, Amp, OpenCode, Neovim, etc.)",
    content: `# AGENTS.md\n\n${HEADER_COMMENT}\n\n${body}\n`,
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

function webstormBridge(dirs: string[]): BridgeFile {
  return {
    editorId: "webstorm",
    filePath: ".github/copilot-instructions.md",
    description: "WebStorm — GitHub Copilot instructions (JetBrains reads .github/copilot-instructions.md)",
    content: `# Copilot Instructions
${buildDirectorySection(dirs)}${buildCoreInstructions(dirs)}`,
  };
}

function zedBridge(dirs: string[]): BridgeFile {
  return {
    editorId: "zed",
    filePath: ".zed/instructions.md",
    description: "Zed AI instructions",
    content: `# AI Instructions
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
  cursor: cursorBridge,
  copilot: copilotBridge,
  gemini: geminiBridge,
  windsurf: windsurfBridge,
  webstorm: webstormBridge,
  zed: zedBridge,
};

/** Bridge keys that need full routing context (subSpecs, installedItems, slug). */
const ROUTING_BRIDGE_KEYS = new Set(["claude", "universal", "neovim"]);

/** Map assistant IDs to bridge generator keys */
const ASSISTANT_TO_BRIDGE: Record<string, string> = {
  claude: "claude",
  cursor: "cursor",
  vscode: "vscode",
  copilot: "copilot",
  gemini: "gemini",
  antigravity: "gemini",
  windsurf: "windsurf",
  webstorm: "webstorm",
  zed: "zed",
  neovim: "neovim",
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
  installedItems?: CatalogItem[],
  projectSlug?: string,
  projectName?: string,
): Promise<BridgeFile[]> {
  const dirs = await getExistingDirs(projectRoot);
  if (dirs.length === 0) {
    dirs.push("skills", "rules");
  }
  const subSpecs = await getSubSpecs(projectRoot);
  const graphify = await hasGraphifyDir(projectRoot);

  const bridgeKeys = new Set<string>();
  for (const assistant of assistants) {
    const key = ASSISTANT_TO_BRIDGE[assistant.id];
    if (key) bridgeKeys.add(key);
  }
  bridgeKeys.add("universal");

  const files: BridgeFile[] = [];
  const seenPaths = new Set<string>();
  for (const key of bridgeKeys) {
    let file: BridgeFile | undefined;
    if (key === "vscode") {
      file = await vscodeBridge(dirs, projectRoot);
    } else if (key === "claude") {
      file = claudeBridge(dirs, vaultPath, installedItems, projectSlug, subSpecs, graphify);
      if (vaultPath && projectSlug) {
        const name = projectName ?? projectSlug;
        const localSettings = claudeSettingsLocalBridge(vaultPath, name, projectSlug);
        if (!seenPaths.has(localSettings.filePath)) {
          seenPaths.add(localSettings.filePath);
          files.push(localSettings);
        }
      }
    } else if (key === "universal" || key === "neovim") {
      file = agentsBridge(dirs, vaultPath, installedItems, projectSlug, subSpecs);
    } else {
      const generator = BRIDGE_GENERATORS[key];
      if (generator) file = generator(dirs, vaultPath);
    }
    if (file && !seenPaths.has(file.filePath)) {
      seenPaths.add(file.filePath);
      files.push(file);
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
  return [
    ...Object.keys(BRIDGE_GENERATORS),
    ...ROUTING_BRIDGE_KEYS,
    "vscode",
  ];
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
  installedItems?: CatalogItem[],
  projectSlug?: string,
): Promise<BridgeFile[]> {
  if (bridgeIds.length === 0 || bridgeIds.includes("none")) {
    return [];
  }

  const dirs = await getExistingDirs(projectRoot);
  if (dirs.length === 0) {
    dirs.push("skills", "rules");
  }
  const subSpecs = await getSubSpecs(projectRoot);
  const graphify = await hasGraphifyDir(projectRoot);

  const resolveKey = (id: string): string => ASSISTANT_TO_BRIDGE[id] ?? id;

  const keys = bridgeIds.includes("all")
    ? new Set(getAvailableBridgeTypes())
    : new Set(bridgeIds.map(resolveKey));

  // AGENTS.md is the open standard (agents.md) — always include the universal
  // bridge unless the user explicitly opted out via 'none' (handled above).
  keys.add("universal");

  const files: BridgeFile[] = [];
  const seenPaths = new Set<string>();
  for (const key of keys) {
    let file: BridgeFile | undefined;
    if (key === "vscode") {
      file = await vscodeBridge(dirs, projectRoot);
    } else if (key === "claude") {
      file = claudeBridge(dirs, vaultPath, installedItems, projectSlug, subSpecs, graphify);
    } else if (key === "universal" || key === "neovim") {
      file = agentsBridge(dirs, vaultPath, installedItems, projectSlug, subSpecs);
    } else {
      const generator = BRIDGE_GENERATORS[key];
      if (generator) file = generator(dirs, vaultPath);
    }
    if (file && !seenPaths.has(file.filePath)) {
      seenPaths.add(file.filePath);
      files.push(file);
    }
  }

  return files;
}
