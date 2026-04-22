/**
 * Content Catalog
 *
 * Manages the catalog of available skills, agents, commands, rules, and prompts.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import type {
  ContentType,
  CatalogItem,
  CatalogIndex,
  ValidationResult,
  ValidationIssue,
} from "./types.js";

// Re-export types for consumers
export type {
  CatalogItem,
  CatalogIndex,
  ValidationResult,
  ValidationIssue,
} from "./types.js";

// ============================================================================
// Helper Functions
// ============================================================================

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Get templates root directory
 */
export function getTemplatesRoot(): string {
  const devPath = path.join(__dirname, "..", "templates");
  const prodPath = path.join(__dirname, "..", "..", "templates");
  try {
    fs.statSync(devPath);
    return devPath;
  } catch {
    return prodPath;
  }
}

/**
 * Parse YAML frontmatter from content
 */
export function parseFrontmatter(content: string): {
  frontmatter: Record<string, unknown>;
  body: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const [, yaml, body] = match;
  const frontmatter: Record<string, unknown> = {};

  // Simple YAML parsing (key: value pairs)
  yaml.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value: unknown = line.slice(colonIndex + 1).trim();

      // Remove quotes
      if (
        (value as string).startsWith('"') &&
        (value as string).endsWith('"')
      ) {
        value = (value as string).slice(1, -1);
      }

      // Parse arrays
      if (
        (value as string).startsWith("[") &&
        (value as string).endsWith("]")
      ) {
        value = (value as string)
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^["']|["']$/g, ""));
      }

      frontmatter[key] = value;
    }
  });

  return { frontmatter, body };
}

/**
 * Get filename for content type
 */
function getContentFileName(type: ContentType): string {
  const fileNames: Record<ContentType, string> = {
    skills: "SKILL.md",
    agents: "AGENT.md",
    commands: "COMMAND.md",
    rules: "RULE.md",
    prompts: "PROMPT.md",
    integration: "INTEGRATION.md",
  };
  return fileNames[type];
}

// ============================================================================
// Frontmatter Validation (per Claude Skills Guide best practices)
// ============================================================================

/** Kebab-case pattern: lowercase letters, numbers, hyphens only */
const KEBAB_CASE_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Reserved name prefixes */
const RESERVED_PREFIXES = ["claude", "anthropic"];

/** XML angle bracket pattern (security restriction) */
const XML_BRACKETS_RE = /[<>]/;

/**
 * Validate a skill's YAML frontmatter against Claude Skills Guide rules.
 *
 * Rules enforced:
 * - `name` (required): must be kebab-case, no spaces/capitals, must not
 *   start with reserved prefixes ("claude", "anthropic")
 * - `description` (required): must include WHAT the skill does AND WHEN to
 *   use it (trigger conditions), under 1024 chars, no XML angle brackets
 * - No XML angle brackets anywhere in frontmatter values
 *
 * Warnings emitted for:
 * - Missing `category` field (recommended)
 * - Missing `tags` field (recommended)
 * - Description missing trigger phrases ("use when", "use for", etc.)
 */
export function validateFrontmatter(
  frontmatter: Record<string, unknown>,
  folderId?: string,
): ValidationResult {
  const issues: ValidationIssue[] = [];

  // --- name (required) ---
  const name = frontmatter.name as string | undefined;
  if (!name) {
    issues.push({
      field: "name",
      severity: "error",
      message: "Missing required field: name",
    });
  } else {
    if (!KEBAB_CASE_RE.test(name)) {
      issues.push({
        field: "name",
        severity: "error",
        message: `Name must be kebab-case (got "${name}"). Use lowercase letters, numbers, and hyphens only.`,
      });
    }
    if (RESERVED_PREFIXES.some((p) => name.startsWith(p))) {
      issues.push({
        field: "name",
        severity: "error",
        message: `Name must not start with reserved prefix ("claude" or "anthropic").`,
      });
    }
    if (folderId && name !== folderId) {
      issues.push({
        field: "name",
        severity: "warning",
        message: `Name "${name}" does not match folder name "${folderId}". They should match.`,
      });
    }
  }

  // --- description (required) ---
  const description = frontmatter.description as string | undefined;
  if (!description) {
    issues.push({
      field: "description",
      severity: "error",
      message: "Missing required field: description",
    });
  } else {
    if (description.length > 1024) {
      issues.push({
        field: "description",
        severity: "error",
        message: `Description exceeds 1024 characters (got ${description.length}).`,
      });
    }
    if (XML_BRACKETS_RE.test(description)) {
      issues.push({
        field: "description",
        severity: "error",
        message: "Description must not contain XML angle brackets (< >).",
      });
    }
    // Check for trigger phrases (WHEN to use it)
    const triggerPhrases = [
      "use when",
      "use for",
      "use if",
      "trigger",
      "activate when",
      "asks about",
      "asks to",
      "asks for",
    ];
    const lowerDesc = description.toLowerCase();
    const hasTrigger = triggerPhrases.some((phrase) =>
      lowerDesc.includes(phrase),
    );
    if (!hasTrigger) {
      issues.push({
        field: "description",
        severity: "warning",
        message:
          'Description should include trigger conditions (e.g., "Use when user asks about...").',
      });
    }
  }

  // --- XML brackets in any frontmatter value (security) ---
  for (const [key, value] of Object.entries(frontmatter)) {
    if (key === "description") continue; // Already checked
    if (typeof value === "string" && XML_BRACKETS_RE.test(value)) {
      issues.push({
        field: key,
        severity: "error",
        message: `Field "${key}" must not contain XML angle brackets (< >).`,
      });
    }
  }

  // --- category (recommended) ---
  if (!frontmatter.category) {
    issues.push({
      field: "category",
      severity: "warning",
      message:
        "Missing recommended field: category. Add a category for better organization.",
    });
  }

  // --- tags (recommended) ---
  if (!frontmatter.tags) {
    issues.push({
      field: "tags",
      severity: "warning",
      message:
        "Missing recommended field: tags. Add tags for improved discoverability.",
    });
  }

  const hasErrors = issues.some((i) => i.severity === "error");

  return { valid: !hasErrors, issues };
}

// ============================================================================
// Catalog Functions
// ============================================================================

/**
 * Load a single item from the catalog
 */
export async function loadCatalogItem(
  type: ContentType,
  id: string,
): Promise<CatalogItem | null> {
  const templatesRoot = getTemplatesRoot();
  const itemDir = path.join(templatesRoot, type, id);
  const fileName = getContentFileName(type);
  const filePath = path.join(itemDir, fileName);

  try {
    const content = await fs.promises.readFile(filePath, "utf-8");
    const { frontmatter } = parseFrontmatter(content);

    return {
      id,
      name: (frontmatter.name as string) || id,
      description: (frontmatter.description as string) || "",
      type,
      category: frontmatter.category as string | undefined,
      tags: frontmatter.tags as string[] | undefined,
      path: path.relative(templatesRoot, itemDir),
      content,
      setup: frontmatter.setup as string | undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Load all items of a content type
 */
export async function loadContentType(
  type: ContentType,
): Promise<CatalogItem[]> {
  const templatesRoot = getTemplatesRoot();
  const typeDir = path.join(templatesRoot, type);

  try {
    fs.statSync(typeDir);
  } catch {
    return [];
  }

  const items: CatalogItem[] = [];
  const entries = await fs.promises.readdir(typeDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const item = await loadCatalogItem(type, entry.name);
      if (item) {
        items.push(item);
      }
    }
  }

  return items.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Load full catalog
 */
export async function loadCatalog(): Promise<Map<ContentType, CatalogItem[]>> {
  const catalog = new Map<ContentType, CatalogItem[]>();
  const types: ContentType[] = [
    "skills",
    "agents",
    "commands",
    "rules",
    "prompts",
  ];

  await Promise.all(
    types.map(async (type) => {
      const items = await loadContentType(type);
      catalog.set(type, items);
    }),
  );

  return catalog;
}

/**
 * Get catalog as flat array
 */
export async function getCatalogItems(): Promise<CatalogItem[]> {
  const catalog = await loadCatalog();
  const items: CatalogItem[] = [];

  for (const typeItems of catalog.values()) {
    items.push(...typeItems);
  }

  return items;
}

/**
 * Search catalog
 */
export async function searchCatalog(query: string): Promise<CatalogItem[]> {
  const items = await getCatalogItems();
  const lowerQuery = query.toLowerCase();

  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      item.category?.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Generate catalog index JSON
 */
export async function generateCatalogIndex(): Promise<CatalogIndex> {
  const items = await getCatalogItems();

  // Remove content from items for smaller index
  const indexItems = items.map(({ content, ...item }) => item);

  return {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    items: indexItems,
  };
}

/**
 * Get item content
 */
export async function getItemContent(
  type: ContentType,
  id: string,
): Promise<string | null> {
  const item = await loadCatalogItem(type, id);
  return item?.content || null;
}

/**
 * Get item file path
 */
export function getItemFilePath(type: ContentType, id: string): string {
  const templatesRoot = getTemplatesRoot();
  const fileName = getContentFileName(type);
  return path.join(templatesRoot, type, id, fileName);
}

/**
 * Check if item exists
 */
export async function itemExists(
  type: ContentType,
  id: string,
): Promise<boolean> {
  const filePath = getItemFilePath(type, id);
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * List available items by type
 */
export async function listItems(type?: ContentType): Promise<CatalogItem[]> {
  if (type) {
    return loadContentType(type);
  }
  return getCatalogItems();
}

/**
 * Get catalog statistics
 */
export async function getCatalogStats(): Promise<
  Record<ContentType, number> & { total: number }
> {
  const catalog = await loadCatalog();
  const stats: Record<string, number> = { total: 0 };

  for (const [type, items] of catalog.entries()) {
    stats[type] = items.length;
    stats.total += items.length;
  }

  return stats as Record<ContentType, number> & { total: number };
}
