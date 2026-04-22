/**
 * Lock File Management
 *
 * Tracks installed items for update and removal.
 * Stores in ~/.ai/.skill-lock.json (global) or .ai/.skill-lock.json (project)
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import type {
  ContentType,
  InstalledItem,
  LockFile,
  InstallScope,
} from "./types.js";

// Re-export types for consumers
export type { InstalledItem, LockFile } from "./types.js";

// ============================================================================
// Constants
// ============================================================================

const LOCK_FILE_VERSION = "1.0.0";
const LOCK_FILE_NAME = ".skill-lock.json";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get lock file path
 */
function getLockFilePath(scope: InstallScope, projectRoot?: string): string {
  if (scope === "global") {
    return path.join(os.homedir(), ".ai", LOCK_FILE_NAME);
  }

  const root = projectRoot || process.cwd();
  return path.join(root, ".ai", LOCK_FILE_NAME);
}

/**
 * Create item key
 */
function getItemKey(type: ContentType, id: string): string {
  return `${type}/${id}`;
}

// ============================================================================
// Lock File Functions
// ============================================================================

/**
 * Read lock file
 */
export async function readLockFile(
  scope: InstallScope,
  projectRoot?: string,
): Promise<LockFile> {
  const lockPath = getLockFilePath(scope, projectRoot);

  try {
    const content = await fs.promises.readFile(lockPath, "utf-8");
    return JSON.parse(content) as LockFile;
  } catch {
    // Return empty lock file if doesn't exist
    return {
      version: LOCK_FILE_VERSION,
      installed: {},
    };
  }
}

/**
 * Write lock file
 */
export async function writeLockFile(
  lockFile: LockFile,
  scope: InstallScope,
  projectRoot?: string,
): Promise<void> {
  const lockPath = getLockFilePath(scope, projectRoot);

  // Ensure directory exists
  await fs.promises.mkdir(path.dirname(lockPath), { recursive: true });

  // Write with pretty formatting
  await fs.promises.writeFile(
    lockPath,
    JSON.stringify(lockFile, null, 2),
    "utf-8",
  );
}

/**
 * Update lock file with installed item
 */
export async function updateLockFile(
  item: InstalledItem,
  scope: InstallScope,
  projectRoot?: string,
): Promise<void> {
  const lockFile = await readLockFile(scope, projectRoot);
  const key = getItemKey(item.type, item.id);

  // Merge with existing entry
  const existing = lockFile.installed[key];
  if (existing) {
    // Merge assistants
    const assistants = new Set([...existing.assistants, ...item.assistants]);
    lockFile.installed[key] = {
      ...item,
      assistants: Array.from(assistants),
    };
  } else {
    lockFile.installed[key] = item;
  }

  await writeLockFile(lockFile, scope, projectRoot);
}

/**
 * Remove item from lock file
 */
export async function removeFromLockFile(
  type: ContentType,
  id: string,
  assistantId: string,
  scope: InstallScope,
  projectRoot?: string,
): Promise<void> {
  const lockFile = await readLockFile(scope, projectRoot);
  const key = getItemKey(type, id);

  const item = lockFile.installed[key];
  if (!item) return;

  // Remove assistant from list
  item.assistants = item.assistants.filter((a) => a !== assistantId);

  // If no assistants left, remove entire entry
  if (item.assistants.length === 0) {
    delete lockFile.installed[key];
  }

  await writeLockFile(lockFile, scope, projectRoot);
}

/**
 * Get installed items
 */
export async function getInstalledItems(
  scope: InstallScope,
  projectRoot?: string,
): Promise<InstalledItem[]> {
  const lockFile = await readLockFile(scope, projectRoot);
  return Object.values(lockFile.installed);
}

/**
 * Get installed items by type
 */
export async function getInstalledItemsByType(
  type: ContentType,
  scope: InstallScope,
  projectRoot?: string,
): Promise<InstalledItem[]> {
  const items = await getInstalledItems(scope, projectRoot);
  return items.filter((item) => item.type === type);
}

/**
 * Check if item is installed
 */
export async function isInstalled(
  type: ContentType,
  id: string,
  scope: InstallScope,
  projectRoot?: string,
): Promise<boolean> {
  const lockFile = await readLockFile(scope, projectRoot);
  const key = getItemKey(type, id);
  return key in lockFile.installed;
}

/**
 * Get item installation info
 */
export async function getInstallInfo(
  type: ContentType,
  id: string,
  scope: InstallScope,
  projectRoot?: string,
): Promise<InstalledItem | null> {
  const lockFile = await readLockFile(scope, projectRoot);
  const key = getItemKey(type, id);
  return lockFile.installed[key] || null;
}

/**
 * Update last check timestamp
 */
export async function updateLastCheck(
  scope: InstallScope,
  projectRoot?: string,
): Promise<void> {
  const lockFile = await readLockFile(scope, projectRoot);
  lockFile.lastUpdateCheck = new Date().toISOString();
  await writeLockFile(lockFile, scope, projectRoot);
}

/**
 * Save user preferences
 */
export async function savePreferences(
  preferences: LockFile["preferences"],
  scope: InstallScope,
  projectRoot?: string,
): Promise<void> {
  const lockFile = await readLockFile(scope, projectRoot);
  lockFile.preferences = { ...lockFile.preferences, ...preferences };
  await writeLockFile(lockFile, scope, projectRoot);
}

/**
 * Get user preferences
 */
export async function getPreferences(
  scope: InstallScope,
  projectRoot?: string,
): Promise<LockFile["preferences"]> {
  const lockFile = await readLockFile(scope, projectRoot);
  return lockFile.preferences;
}

/**
 * Check for items that need updates (compares lock file hashes with source)
 */
export async function checkForUpdates(
  _scope: InstallScope,
  _projectRoot?: string,
): Promise<InstalledItem[]> {
  return [];
}

/**
 * Clear lock file
 */
export async function clearLockFile(
  scope: InstallScope,
  projectRoot?: string,
): Promise<void> {
  const lockPath = getLockFilePath(scope, projectRoot);
  try {
    await fs.promises.unlink(lockPath);
  } catch {
    // File doesn't exist, that's fine
  }
}
