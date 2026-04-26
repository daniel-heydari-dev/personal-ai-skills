/**
 * Verify Install
 *
 * Static post-install health check. Reads the project state, validates @-imports
 * resolve, checks token budgets, and prints a paste-ready prompt the user can
 * drop into Claude Code for an AI gap-review (no API key required).
 */

import * as fs from "node:fs";
import * as path from "node:path";

export interface VerifyResult {
  passed: number;
  warnings: number;
  errors: number;
  lines: string[];
  pastePrompt: string;
}

export interface VerifyContext {
  projectRoot: string;
  projectSlug?: string;
  projectType?: string;
  vaultPath?: string;
  installedSkills: string[];
  installedAgents: string[];
  installedRules: string[];
  bridgeIds: string[];
}

interface Check {
  status: "ok" | "warn" | "fail";
  message: string;
}

const TOKEN_BUDGETS = {
  CLAUDE_MD_WORDS: 600,
  AGENTS_MD_WORDS: 600,
  SPEC_MD_WORDS: 250,
  AI_CONTEXT_WORDS: 350,
} as const;

function checkFileExists(label: string, p: string): Check {
  return fs.existsSync(p)
    ? { status: "ok", message: `${label} exists` }
    : { status: "warn", message: `${label} missing — expected at ${p}` };
}

function checkWordBudget(label: string, p: string, budget: number): Check {
  if (!fs.existsSync(p)) return { status: "warn", message: `${label} missing` };
  const words = fs.readFileSync(p, "utf-8").split(/\s+/).filter(Boolean).length;
  if (words <= budget) return { status: "ok", message: `${label} ${words}w (budget ${budget})` };
  return {
    status: "warn",
    message: `${label} ${words}w exceeds budget ${budget} — consider trimming`,
  };
}

/** Find every `@path` import in a file and check it resolves on disk. */
function checkAtImports(filePath: string, projectRoot: string): Check[] {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, "utf-8");
  const matches = content.matchAll(/(?<![\w/])@([\w./-]+\.md)\b/g);
  const seen = new Set<string>();
  const checks: Check[] = [];
  for (const m of matches) {
    const target = m[1];
    if (seen.has(target)) continue;
    seen.add(target);
    const resolved = path.resolve(projectRoot, target);
    if (fs.existsSync(resolved)) {
      checks.push({ status: "ok", message: `@${target} resolves` });
    } else {
      checks.push({ status: "fail", message: `@${target} does NOT resolve (broken import)` });
    }
  }
  return checks;
}

/** Check Spec Map rows in CLAUDE.md point at real docs/spec/<feature>/SPEC.md files. */
function checkSpecMap(claudePath: string, projectRoot: string): Check[] {
  if (!fs.existsSync(claudePath)) return [];
  const content = fs.readFileSync(claudePath, "utf-8");
  const matches = content.matchAll(/`(docs\/spec\/[^`]+\/SPEC\.md)`/g);
  const checks: Check[] = [];
  const seen = new Set<string>();
  for (const m of matches) {
    if (seen.has(m[1])) continue;
    seen.add(m[1]);
    const resolved = path.resolve(projectRoot, m[1]);
    if (fs.existsSync(resolved)) {
      checks.push({ status: "ok", message: `Spec Map row → ${m[1]}` });
    } else {
      checks.push({ status: "fail", message: `Spec Map row points to missing ${m[1]}` });
    }
  }
  return checks;
}

function formatLine(c: Check): string {
  const icon = c.status === "ok" ? "✅" : c.status === "warn" ? "⚠️ " : "❌";
  return `  ${icon} ${c.message}`;
}

/** Build the paste-ready prompt the user copies into Claude Code for an AI review. */
function buildPastePrompt(ctx: VerifyContext, summary: string): string {
  const lines = [
    "═══════════════════════════════════════════════════════════════════",
    "  📋 Final review — paste this into Claude Code for an AI gap-check",
    "═══════════════════════════════════════════════════════════════════",
    "",
    "I just installed personal-ai-skills in this project. Please verify",
    "my AI setup is coherent. Specifically check:",
    "",
    "1. Does CLAUDE.md properly route to all installed skills/agents/rules?",
    "2. Are there any @-imports in CLAUDE.md/AGENTS.md that don't resolve?",
    "3. Does SPEC.md cover the project basics (what / stack / key rules)?",
    "4. Are the docs/spec/<feature>/SPEC.md files non-empty?",
    "5. Does the Brain Map point to a vault that actually exists?",
    "6. Is the token budget reasonable (CLAUDE.md < 600 words, SPEC.md < 250)?",
    "7. Is anything missing or contradictory?",
    "",
    "Project context:",
    `- Slug: ${ctx.projectSlug ?? "(not set)"}`,
    `- Type: ${ctx.projectType ?? "(not set)"}`,
    `- Skills installed: ${ctx.installedSkills.length > 0 ? ctx.installedSkills.join(", ") : "none"}`,
    `- Agents installed: ${ctx.installedAgents.length > 0 ? ctx.installedAgents.join(", ") : "none"}`,
    `- Rules installed: ${ctx.installedRules.length > 0 ? ctx.installedRules.join(", ") : "none"}`,
    `- Bridges generated: ${ctx.bridgeIds.length > 0 ? ctx.bridgeIds.join(", ") : "none"}`,
    `- Brain vault: ${ctx.vaultPath ?? "(not set)"}`,
    "",
    "Static-check summary from the installer:",
    summary,
    "═══════════════════════════════════════════════════════════════════",
  ];
  return lines.join("\n");
}

/**
 * Run all static checks and produce a structured result. The caller is responsible
 * for printing `lines` and `pastePrompt` (we don't print here so this stays testable).
 */
export async function verifyInstall(ctx: VerifyContext): Promise<VerifyResult> {
  const root = ctx.projectRoot;
  const checks: Check[] = [];

  // Core files
  checks.push(checkFileExists("SPEC.md", path.join(root, "SPEC.md")));
  checks.push(checkFileExists("CLAUDE.md", path.join(root, "CLAUDE.md")));
  checks.push(checkFileExists(".ai/.skill-lock.json", path.join(root, ".ai", ".skill-lock.json")));

  // Token budgets
  checks.push(checkWordBudget("CLAUDE.md", path.join(root, "CLAUDE.md"), TOKEN_BUDGETS.CLAUDE_MD_WORDS));
  checks.push(checkWordBudget("AGENTS.md", path.join(root, "AGENTS.md"), TOKEN_BUDGETS.AGENTS_MD_WORDS));
  checks.push(checkWordBudget("SPEC.md", path.join(root, "SPEC.md"), TOKEN_BUDGETS.SPEC_MD_WORDS));
  checks.push(
    checkWordBudget(".ai/AI-CONTEXT.md", path.join(root, ".ai", "AI-CONTEXT.md"), TOKEN_BUDGETS.AI_CONTEXT_WORDS),
  );

  // @-import resolution
  checks.push(...checkAtImports(path.join(root, "CLAUDE.md"), root));
  checks.push(...checkAtImports(path.join(root, "AGENTS.md"), root));

  // Spec Map rows
  checks.push(...checkSpecMap(path.join(root, "CLAUDE.md"), root));

  // Brain vault (if user opted in)
  if (ctx.vaultPath) {
    const expanded = ctx.vaultPath.replace(/^~/, process.env["HOME"] ?? "~");
    checks.push(checkFileExists("Brain config/always.md", path.join(expanded, "config", "always.md")));
    if (ctx.projectSlug) {
      checks.push(
        checkFileExists(
          `Brain wiki/projects/${ctx.projectSlug}/`,
          path.join(expanded, "wiki", "projects", ctx.projectSlug),
        ),
      );
    }
  }

  // Tally + format
  const passed = checks.filter((c) => c.status === "ok").length;
  const warnings = checks.filter((c) => c.status === "warn").length;
  const errors = checks.filter((c) => c.status === "fail").length;
  const lines = checks.map(formatLine);

  const summary = `${passed} passed, ${warnings} warnings, ${errors} errors`;
  const pastePrompt = buildPastePrompt(ctx, summary);

  return { passed, warnings, errors, lines, pastePrompt };
}
