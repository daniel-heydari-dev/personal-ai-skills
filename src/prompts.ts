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

/**
 * Run full interactive install flow
 */
export async function runInteractiveInstall(
  catalog: Map<ContentType, CatalogItem[]>,
): Promise<InstallOptions | null> {
  p.intro("🚀 personal-ai-skills installer");

  // 1. Select content types (multi-select)
  const contentTypesResult = await selectContentTypes();
  if (p.isCancel(contentTypesResult)) {
    p.cancel("Installation cancelled");
    return null;
  }
  const contentTypes = contentTypesResult as ContentType[];

  // 2. For each content type, select items
  const allSelectedItems: CatalogItem[] = [];

  for (const contentType of contentTypes) {
    const availableItems = catalog.get(contentType) || [];
    if (availableItems.length === 0) {
      p.log.warn(
        `No ${getContentTypeDisplayName(contentType).toLowerCase()} available, skipping.`,
      );
      continue;
    }

    const selectedItemsResult = await selectItems(availableItems, contentType);
    if (p.isCancel(selectedItemsResult)) {
      p.cancel("Installation cancelled");
      return null;
    }
    allSelectedItems.push(...(selectedItemsResult as CatalogItem[]));
  }

  if (allSelectedItems.length === 0) {
    p.cancel("No items selected");
    return null;
  }

  // 3. Auto-detect assistants for bridge files (no need to ask — everything goes to .ai/)
  const detectedAssistants = await detectInstalledAssistants();
  if (detectedAssistants.length === 0) {
    p.log.warn("No AI assistants detected — installing to .ai/ anyway.");
  } else {
    p.log.info(`Detected: ${detectedAssistants.map((a) => a.name).join(", ")}`);
  }

  // 4. Select scope
  const scope = await selectScope();
  if (p.isCancel(scope)) {
    p.cancel("Installation cancelled");
    return null;
  }

  // Use all available assistants for bridge file generation
  const assistants =
    detectedAssistants.length > 0
      ? detectedAssistants
      : getAllAssistants().slice(0, 1); // Fallback to first assistant for lock file

  // 5. Build options
  const options: InstallOptions = {
    items: allSelectedItems,
    assistants,
    scope: scope as InstallScope,
    method: "symlink" as InstallMethod,
  };

  // 8. Confirm
  const confirmed = await confirmInstall(options);
  if (p.isCancel(confirmed) || !confirmed) {
    p.cancel("Installation cancelled");
    return null;
  }

  return options;
}

/**
 * Display installation success message
 */
export function showInstallSuccess(
  items: CatalogItem[],
  assistants: AssistantConfig[],
): void {
  const itemList = items.map((i) => `  • ${i.name}`).join("\n");
  const assistantList = assistants.map((a) => `  • ${a.name}`).join("\n");

  p.outro(
    `✅ Successfully installed!\n\nItems:\n${itemList}\n\nTo:\n${assistantList}`,
  );
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
