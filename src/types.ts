/**
 * Shared Types
 *
 * Central type definitions used across the codebase.
 * Prevents circular dependencies and eliminates type duplication.
 */

// ============================================================================
// Content Types
// ============================================================================

/** Supported content categories */
export type ContentType =
  | "skills"
  | "agents"
  | "commands"
  | "rules"
  | "prompts"
  | "integration";

// ============================================================================
// Installation Types
// ============================================================================

/** Where to install: current project or user home */
export type InstallScope = "project" | "global";

/** How to install: symlink to canonical dir or copy files */
export type InstallMethod = "symlink" | "copy";

// ============================================================================
// Catalog Types
// ============================================================================

/** A single item in the content catalog */
export interface CatalogItem {
  /** Unique identifier (folder name) */
  id: string;
  /** Display name */
  name: string;
  /** Description */
  description: string;
  /** Content type */
  type: ContentType;
  /** Category for grouping */
  category?: string;
  /** Tags for filtering */
  tags?: string[];
  /** File path relative to templates */
  path: string;
  /** Full content (loaded on demand) */
  content?: string;
  /** One-time external setup command to display after install (integrations only) */
  setup?: string;
}

/** Serializable catalog index for web viewer */
export interface CatalogIndex {
  version: string;
  generatedAt: string;
  items: CatalogItem[];
}

// ============================================================================
// Lock File Types
// ============================================================================

/** Record of an installed item in the lock file */
export interface InstalledItem {
  /** Content type */
  type: ContentType;
  /** Item ID (folder name) */
  id: string;
  /** Source: builtin, github:user/repo, or URL */
  source: string;
  /** Content hash for update detection */
  hash: string;
  /** Installation timestamp */
  installedAt: string;
  /** Assistants it's installed to */
  assistants: string[];
  /** Installation scope */
  scope: InstallScope;
  /** Installation method */
  method: InstallMethod;
}

/** Full lock file structure */
export interface LockFile {
  /** Lock file version */
  version: string;
  /** Last update check timestamp */
  lastUpdateCheck?: string;
  /** Installed items keyed by "type/id" */
  installed: Record<string, InstalledItem>;
  /** User preferences */
  preferences?: {
    defaultAssistants?: string[];
    defaultScope?: InstallScope;
    defaultMethod?: InstallMethod;
  };
}

// ============================================================================
// Install Result Types
// ============================================================================

/** Result of installing one item to one assistant */
export interface InstallResult {
  success: boolean;
  item: CatalogItem;
  assistant?: AssistantConfig;
  path: string;
  error?: string;
}

/** Summary of a batch installation */
export interface InstallSummary {
  total: number;
  successful: number;
  failed: number;
  results: InstallResult[];
}

/** Options for interactive install flow */
export interface InstallOptions {
  items: CatalogItem[];
  assistants: AssistantConfig[];
  scope: InstallScope;
  method: InstallMethod;
}

// ============================================================================
// Assistant Types
// ============================================================================

/** Configuration for a supported AI assistant */
export interface AssistantConfig {
  /** Display name */
  name: string;
  /** Short identifier */
  id: string;
  /** Description */
  description: string;
  /** Check if assistant is installed */
  detectInstalled: () => Promise<boolean>;
  /** Content type paths (project-level) */
  paths: Partial<Record<ContentType, string>>;
  /** Content type paths (global/user-level) */
  globalPaths: Partial<Record<ContentType, string>>;
  /** File extension for content (default: .md) */
  fileExtension?: string;
  /** Whether this assistant uses the universal .agents/ directory */
  isUniversal?: boolean;
  /** Context file name (e.g., CLAUDE.md, GEMINI.md, AGENTS.md) */
  contextFile?: string;
}

// ============================================================================
// GitHub / Source Types
// ============================================================================

export interface GitHubSource {
  type: "github";
  owner: string;
  repo: string;
  path?: string;
  branch?: string;
}

export interface UrlSource {
  type: "url";
  url: string;
}

export interface LocalSource {
  type: "local";
  path: string;
}

export type ContentSource = GitHubSource | UrlSource | LocalSource;

export interface FetchedSkill {
  id: string;
  name: string;
  description: string;
  content: string;
  source: ContentSource;
}

// ============================================================================
// Skill Validation Types (per Claude Skills Guide best practices)
// ============================================================================

/** Severity of a validation issue */
export type ValidationSeverity = "error" | "warning";

/** A single frontmatter validation issue */
export interface ValidationIssue {
  /** Which field has the issue */
  field: string;
  /** Severity level */
  severity: ValidationSeverity;
  /** Human-readable message */
  message: string;
}

/** Result of validating a skill's frontmatter */
export interface ValidationResult {
  /** Whether the skill passes all required checks */
  valid: boolean;
  /** List of issues found */
  issues: ValidationIssue[];
}
