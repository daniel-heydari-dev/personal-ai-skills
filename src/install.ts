/**
 * Installation Logic
 *
 * Handles installing content to the canonical .ai/ directory.
 * All content lives in .ai/ — no editor-specific directories are created.
 * Bridge context files (CLAUDE.md, .cursorrules, etc.) tell each editor
 * where to find the content.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import type {
  AssistantConfig,
  CatalogItem,
  InstalledItem,
  InstallResult,
  InstallSummary,
  InstallScope,
  InstallMethod,
} from "./types.js";
import { getCanonicalPath } from "./agents.js";
import { getItemFilePath } from "./catalog.js";
import { updateLockFile } from "./lock.js";

// Re-export types for consumers
export type { InstallResult, InstallSummary } from "./types.js";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Ensure directory exists
 */
async function ensureDir(dir: string): Promise<void> {
  await fs.promises.mkdir(dir, { recursive: true });
}

/**
 * Copy directory recursively
 */
async function copyDir(src: string, dest: string): Promise<void> {
  await ensureDir(dest);
  const entries = await fs.promises.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

/**
 * Get content hash for lock file
 */
async function getContentHash(filePath: string): Promise<string> {
  const content = await fs.promises.readFile(filePath, "utf-8");
  // Simple hash based on content length and first/last chars
  const hash = `${content.length}-${content.charCodeAt(0)}-${content.charCodeAt(content.length - 1)}`;
  return Buffer.from(hash).toString("base64").slice(0, 12);
}

// ============================================================================
// Installation Functions
// ============================================================================

/**
 * Install item to canonical location
 */
async function installToCanonical(
  item: CatalogItem,
  scope: InstallScope,
  projectRoot: string,
): Promise<string> {
  const canonicalPath = getCanonicalPath(
    item.type,
    item.id,
    scope,
    projectRoot,
  );
  const sourceDir = path.dirname(getItemFilePath(item.type, item.id));

  await copyDir(sourceDir, canonicalPath);
  return canonicalPath;
}

// ensureDirectoryLink removed — all content lives in .ai/ only.
// Bridge context files (CLAUDE.md, .cursorrules, etc.) tell each editor where to look.

/**
 * Install a single item to the canonical .ai/ directory.
 * Content is editor-agnostic — bridge files tell each editor where to look.
 */
async function installToAi(
  item: CatalogItem,
  scope: InstallScope,
  projectRoot: string,
): Promise<{ success: boolean; path: string; error?: string }> {
  try {
    const canonicalItemPath = await installToCanonical(item, scope, projectRoot);
    return { success: true, path: canonicalItemPath };
  } catch (error) {
    return {
      success: false,
      path: "",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Install multiple items to .ai/.
 *
 * Each item is installed once to .ai/<type>/<id>/ — no duplication.
 * The assistants list is only used for lock file metadata and bridge files.
 */
export async function installItems(
  items: CatalogItem[],
  assistants: AssistantConfig[],
  scope: InstallScope,
  method: InstallMethod,
  projectRoot: string = process.cwd(),
): Promise<InstallSummary> {
  const results: InstallResult[] = [];
  const assistantIds = assistants.map((a) => a.id);
  const representative = assistants[0];

  for (const item of items) {
    const result = await installToAi(item, scope, projectRoot);

    results.push({
      success: result.success,
      item,
      assistant: representative,
      path: result.path,
      error: result.error,
    });

    // Update lock file on success
    if (result.success) {
      const hash = await getContentHash(getItemFilePath(item.type, item.id));
      const installedItem: InstalledItem = {
        type: item.type,
        id: item.id,
        source: "builtin",
        hash,
        installedAt: new Date().toISOString(),
        assistants: assistantIds,
        scope,
        method,
      };
      await updateLockFile(installedItem, scope, projectRoot);
    }
  }

  const successful = results.filter((r) => r.success).length;

  return {
    total: results.length,
    successful,
    failed: results.length - successful,
    results,
  };
}

/**
 * Uninstall item.
 *
 * All content lives in canonical .ai/ — just remove from there.
 */
export async function uninstallItem(
  item: CatalogItem,
  scope: InstallScope,
  projectRoot: string = process.cwd(),
): Promise<boolean> {
  try {
    const canonicalPath = getCanonicalPath(
      item.type,
      item.id,
      scope,
      projectRoot,
    );
    await fs.promises.rm(canonicalPath, { recursive: true, force: true });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if item is installed (checks canonical .ai/ location)
 */
export async function isItemInstalled(
  item: CatalogItem,
  scope: InstallScope,
  projectRoot: string = process.cwd(),
): Promise<boolean> {
  const canonicalPath = getCanonicalPath(
    item.type,
    item.id,
    scope,
    projectRoot,
  );

  try {
    await fs.promises.access(canonicalPath);
    return true;
  } catch {
    return false;
  }
}
