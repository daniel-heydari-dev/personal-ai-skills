/**
 * AI Assistant Registry
 *
 * Defines all supported AI assistants with their detection logic,
 * skill paths, and content type support.
 *
 * Paths are aligned with the skills.sh ecosystem (vercel-labs/skills)
 * to ensure maximum interoperability.
 *
 * @see https://skills.sh
 * @see https://github.com/vercel-labs/skills
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import type { ContentType, AssistantConfig, InstallScope } from "./types.js";

// Re-export types for consumers
export type { ContentType, AssistantConfig } from "./types.js";

// ============================================================================
// Helper Functions
// ============================================================================

const home = os.homedir();

/**
 * XDG config home (~/.config on all platforms, matching xdg-basedir behavior).
 * Used by: Amp, Goose, OpenCode, Crush
 */
const configHome = process.env.XDG_CONFIG_HOME || path.join(home, ".config");

/**
 * Claude config home (respects CLAUDE_CONFIG_DIR env var)
 */
const claudeHome =
  process.env.CLAUDE_CONFIG_DIR?.trim() || path.join(home, ".claude");

/**
 * Codex config home (respects CODEX_HOME env var)
 */
const codexHome = process.env.CODEX_HOME?.trim() || path.join(home, ".codex");

async function dirExists(dir: string): Promise<boolean> {
  try {
    const stats = await fs.promises.stat(dir);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

async function fileExists(file: string): Promise<boolean> {
  try {
    const stats = await fs.promises.stat(file);
    return stats.isFile();
  } catch {
    return false;
  }
}

async function commandExists(cmd: string): Promise<boolean> {
  const { exec } = await import("node:child_process");
  return new Promise((resolve) => {
    exec(`which ${cmd}`, (error) => resolve(!error));
  });
}

// ============================================================================
// Assistant Definitions
//
// Paths verified against vercel-labs/skills (skills.sh) source code.
// See: https://github.com/vercel-labs/skills/blob/main/src/agents.ts
// ============================================================================

export const assistants: AssistantConfig[] = [
  // ─── Anthropic ──────────────────────────────────────────────────────
  {
    name: "Claude Code",
    id: "claude",
    description: "Anthropic's Claude AI assistant for coding",
    contextFile: "CLAUDE.md",
    detectInstalled: async () =>
      (await dirExists(claudeHome)) || (await commandExists("claude")),
    paths: {
      skills: ".claude/skills",
      agents: ".claude/agents",
      commands: ".claude/commands",
    },
    globalPaths: {
      skills: path.join(claudeHome, "skills"),
      agents: path.join(claudeHome, "agents"),
      commands: path.join(claudeHome, "commands"),
    },
  },

  // ─── GitHub ─────────────────────────────────────────────────────────
  {
    name: "GitHub Copilot",
    id: "copilot",
    description: "GitHub's AI pair programmer for VS Code, JetBrains, and more",
    contextFile: "AGENTS.md",
    detectInstalled: async () =>
      (await dirExists(path.join(home, ".copilot"))) ||
      (await fileExists(
        path.join(home, ".config", "github-copilot", "hosts.json"),
      )),
    paths: {
      // Universal: reads from .ai/skills via context file bridge
      skills: ".ai/skills",
      agents: ".github/agents",
      prompts: ".github/prompts",
    },
    globalPaths: {
      skills: path.join(home, ".copilot", "skills"),
      agents: path.join(home, ".copilot", "agents"),
      prompts: path.join(home, ".copilot", "prompts"),
    },
    isUniversal: true,
  },

  // ─── Cursor ─────────────────────────────────────────────────────────
  {
    name: "Cursor",
    id: "cursor",
    description: "AI-first code editor with built-in assistant",
    contextFile: "AGENTS.md",
    detectInstalled: async () =>
      (await dirExists(path.join(home, ".cursor"))) ||
      (await dirExists("/Applications/Cursor.app")),
    paths: {
      skills: ".cursor/skills",
      rules: ".cursor/rules",
    },
    globalPaths: {
      skills: path.join(home, ".cursor", "skills"),
      rules: path.join(home, ".cursor", "rules"),
    },
  },

  // ─── Codeium / Windsurf ─────────────────────────────────────────────
  {
    name: "Windsurf",
    id: "windsurf",
    description: "Codeium's AI-powered IDE (formerly Codeium Editor)",
    detectInstalled: async () =>
      (await dirExists(path.join(home, ".codeium", "windsurf"))) ||
      (await dirExists(path.join(home, ".windsurf"))) ||
      (await dirExists("/Applications/Windsurf.app")),
    paths: {
      skills: ".windsurf/skills",
      rules: ".windsurf/rules",
    },
    globalPaths: {
      // Per skills.sh: ~/.codeium/windsurf/skills
      skills: path.join(home, ".codeium", "windsurf", "skills"),
      rules: path.join(home, ".codeium", "windsurf", "rules"),
    },
  },

  // ─── Google ─────────────────────────────────────────────────────────
  {
    name: "Gemini CLI",
    id: "gemini",
    description: "Google's Gemini AI command-line interface",
    contextFile: "GEMINI.md",
    detectInstalled: async () =>
      (await dirExists(path.join(home, ".gemini"))) ||
      (await commandExists("gemini")),
    paths: {
      // Universal: reads from .ai/skills via context file bridge
      skills: ".ai/skills",
    },
    globalPaths: {
      skills: path.join(home, ".gemini", "skills"),
    },
    isUniversal: true,
  },

  {
    name: "Antigravity",
    id: "antigravity",
    description: "Google's Antigravity AI coding assistant",
    detectInstalled: async () =>
      await dirExists(path.join(home, ".gemini", "antigravity")),
    paths: {
      skills: ".ai/skills",
      agents: ".ai/agents",
    },
    globalPaths: {
      // Per skills.sh: ~/.gemini/antigravity/skills
      skills: path.join(home, ".gemini", "antigravity", "skills"),
      agents: path.join(home, ".gemini", "antigravity", "agents"),
    },
    isUniversal: true,
  },

  // ─── OpenAI ─────────────────────────────────────────────────────────
  {
    name: "Codex",
    id: "codex",
    description: "OpenAI Codex CLI assistant",
    contextFile: "AGENTS.md",
    detectInstalled: async () =>
      (await dirExists(codexHome)) ||
      (await dirExists("/etc/codex")) ||
      (await commandExists("codex")),
    paths: {
      skills: ".ai/skills",
      agents: ".ai/agents",
    },
    globalPaths: {
      // Per skills.sh: ~/.codex/skills
      skills: path.join(codexHome, "skills"),
      agents: path.join(codexHome, "agents"),
    },
    isUniversal: true,
  },

  // ─── Sourcegraph ────────────────────────────────────────────────────
  {
    name: "Amp",
    id: "amp",
    description: "Sourcegraph's Amp AI coding agent",
    detectInstalled: async () =>
      (await dirExists(path.join(configHome, "amp"))) ||
      (await commandExists("amp")),
    paths: {
      // Universal: reads from .ai/skills via context file bridge
      skills: ".ai/skills",
    },
    globalPaths: {
      // Per skills.sh: XDG path (~/.config/agents/skills)
      skills: path.join(configHome, "agents", "skills"),
    },
    isUniversal: true,
  },

  // ─── VS Code Extensions ────────────────────────────────────────────
  {
    name: "Cline",
    id: "cline",
    description: "Autonomous AI coding agent for VS Code",
    detectInstalled: async () => await dirExists(path.join(home, ".cline")),
    paths: {
      skills: ".cline/skills",
      rules: ".cline/rules",
    },
    globalPaths: {
      skills: path.join(home, ".cline", "skills"),
      rules: path.join(home, ".cline", "rules"),
    },
  },

  {
    name: "Roo Code",
    id: "roo",
    description: "AI coding assistant for VS Code (fork of Cline)",
    detectInstalled: async () => await dirExists(path.join(home, ".roo")),
    paths: {
      skills: ".roo/skills",
      rules: ".roo/rules",
    },
    globalPaths: {
      skills: path.join(home, ".roo", "skills"),
      rules: path.join(home, ".roo", "rules"),
    },
  },

  {
    name: "Continue",
    id: "continue",
    description: "Open-source AI code assistant for VS Code and JetBrains",
    detectInstalled: async () => await dirExists(path.join(home, ".continue")),
    paths: {
      skills: ".continue/skills",
      rules: ".continue/rules",
    },
    globalPaths: {
      skills: path.join(home, ".continue", "skills"),
      rules: path.join(home, ".continue", "rules"),
    },
  },

  // ─── Block / Square ─────────────────────────────────────────────────
  {
    name: "Goose",
    id: "goose",
    description: "Block's open-source AI developer agent",
    detectInstalled: async () =>
      (await dirExists(path.join(configHome, "goose"))) ||
      (await commandExists("goose")),
    paths: {
      skills: ".goose/skills",
    },
    globalPaths: {
      // Per skills.sh: XDG path (~/.config/goose/skills)
      skills: path.join(configHome, "goose", "skills"),
    },
  },

  // ─── OpenCode ───────────────────────────────────────────────────────
  {
    name: "OpenCode",
    id: "opencode",
    description: "Open-source AI coding assistant (terminal-based)",
    detectInstalled: async () =>
      (await dirExists(path.join(configHome, "opencode"))) ||
      (await commandExists("opencode")),
    paths: {
      skills: ".ai/skills",
    },
    globalPaths: {
      // Per skills.sh: XDG path (~/.config/opencode/skills)
      skills: path.join(configHome, "opencode", "skills"),
    },
    isUniversal: true,
  },

  // ─── AWS ────────────────────────────────────────────────────────────
  {
    name: "Kiro",
    id: "kiro",
    description: "AWS Kiro AI assistant with spec-driven development",
    detectInstalled: async () =>
      (await dirExists(path.join(home, ".kiro"))) ||
      (await commandExists("kiro")),
    paths: {
      skills: ".kiro/skills",
      rules: ".kiro/rules",
    },
    globalPaths: {
      skills: path.join(home, ".kiro", "skills"),
      rules: path.join(home, ".kiro", "rules"),
    },
  },

  // ─── ByteDance ──────────────────────────────────────────────────────
  {
    name: "Trae",
    id: "trae",
    description: "ByteDance's Trae AI coding assistant",
    detectInstalled: async () =>
      (await dirExists(path.join(home, ".trae"))) ||
      (await commandExists("trae")),
    paths: {
      skills: ".trae/skills",
      rules: ".trae/rules",
    },
    globalPaths: {
      skills: path.join(home, ".trae", "skills"),
      rules: path.join(home, ".trae", "rules"),
    },
  },

  // ─── Augment ────────────────────────────────────────────────────────
  {
    name: "Augment",
    id: "augment",
    description: "Augment Code AI development platform",
    detectInstalled: async () => await dirExists(path.join(home, ".augment")),
    paths: {
      skills: ".augment/skills",
    },
    globalPaths: {
      skills: path.join(home, ".augment", "skills"),
    },
  },

  // ─── Droid (Factory) ────────────────────────────────────────────────
  {
    name: "Droid",
    id: "droid",
    description: "Droid AI coding agent (Factory)",
    detectInstalled: async () => await dirExists(path.join(home, ".factory")),
    paths: {
      skills: ".factory/skills",
    },
    globalPaths: {
      skills: path.join(home, ".factory", "skills"),
    },
  },

  // ─── Kilo Code ──────────────────────────────────────────────────────
  {
    name: "Kilo Code",
    id: "kilo",
    description: "Kilo Code AI assistant for VS Code",
    detectInstalled: async () => await dirExists(path.join(home, ".kilocode")),
    paths: {
      skills: ".kilocode/skills",
    },
    globalPaths: {
      skills: path.join(home, ".kilocode", "skills"),
    },
  },
];

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get all registered assistants
 */
export function getAllAssistants(): AssistantConfig[] {
  return assistants;
}

/**
 * Get assistant by ID
 */
export function getAssistant(id: string): AssistantConfig | undefined {
  return assistants.find((a) => a.id === id);
}

/**
 * Detect which assistants are installed on the system
 */
export async function detectInstalledAssistants(): Promise<AssistantConfig[]> {
  const results = await Promise.all(
    assistants.map(async (assistant) => ({
      assistant,
      installed: await assistant.detectInstalled(),
    })),
  );

  return results.filter((r) => r.installed).map((r) => r.assistant);
}

/**
 * Get assistants that support a specific content type
 */
export function getAssistantsForContentType(
  contentType: ContentType,
): AssistantConfig[] {
  return assistants.filter((a) => a.paths[contentType] !== undefined);
}

/**
 * Get the path for a content type and assistant
 */
export function getContentPath(
  assistant: AssistantConfig,
  contentType: ContentType,
  scope: "project" | "global",
  projectRoot?: string,
): string | undefined {
  if (scope === "global") {
    return assistant.globalPaths[contentType];
  }

  const relativePath = assistant.paths[contentType];
  if (!relativePath) return undefined;

  return projectRoot ? path.join(projectRoot, relativePath) : relativePath;
}

/**
 * Get all content types
 */
export function getAllContentTypes(): ContentType[] {
  return ["skills", "agents", "commands", "rules", "prompts", "integration"];
}

/**
 * Get display name for content type
 */
export function getContentTypeDisplayName(contentType: ContentType): string {
  const names: Record<ContentType, string> = {
    skills: "Skills",
    agents: "Agents",
    commands: "Commands",
    rules: "Rules",
    prompts: "Prompts",
    integration: "Integrations",
  };
  return names[contentType];
}

/** Fallback assistant used for universal installs (integrations). */
export const UNIVERSAL_ASSISTANT: AssistantConfig = {
  name: "Universal (.ai/)",
  id: "universal",
  description: "Universal — installs to .ai/ for all assistants",
  detectInstalled: async () => true,
  paths: {},
  globalPaths: {},
};

/**
 * Canonical directory name — the single source of truth for all AI content.
 * All editor-specific dirs (e.g., .claude/skills) symlink to this.
 */
export const CANONICAL_DIR = ".ai";

/**
 * Get canonical path for content (used as single source of truth for symlinks)
 */
export function getCanonicalPath(
  contentType: ContentType,
  name: string,
  scope: InstallScope,
  projectRoot?: string,
): string {
  const basePath =
    scope === "global" ? path.join(home, CANONICAL_DIR) : CANONICAL_DIR;

  const fullBase = projectRoot ? path.join(projectRoot, basePath) : basePath;

  return path.join(fullBase, contentType, name);
}
