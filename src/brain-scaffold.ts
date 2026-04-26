/**
 * Brain Scaffold
 *
 * Creates the canonical Obsidian brain structure on first install, adds
 * per-project folders on subsequent installs. Idempotent — never overwrites
 * existing files. Reads from `templates/brain/`.
 *
 * Layout produced:
 *   <vault>/
 *     config/                      ← always.md + integrations/{obsidian,claude-mem,graphify}.md
 *     .raw/projects/<slug>/        ← per-project source-file drop zone
 *     wiki/
 *       hot.md, index.md
 *       concepts/, entities/, sources/
 *       projects/
 *         <slug>/                  ← type-aware: app / library / service / cli / generic
 *         shared/                  ← cross-project contracts (one-time)
 */

import * as fs from "node:fs";
import * as path from "node:path";
import type { ProjectType } from "./prompts.js";

export interface ScaffoldBrainOptions {
  /** Vault path with `~` expanded to $HOME. */
  vaultPath: string;
  /** Slugified project identifier — used for folder names. Empty string skips per-project scaffold. */
  projectSlug: string;
  /** Display name — substituted into the H1 of each example file. */
  projectName: string;
  /** One-line description — substituted where placeholders appear. */
  projectDescription: string;
  /** Selects which project-types/<type>/ folder is copied into wiki/projects/<slug>/. */
  projectType: ProjectType;
}

export interface ScaffoldBrainResult {
  /** True when the vault skeleton (config/, wiki/, shared/, etc.) was created on this run. */
  vaultCreated: boolean;
  /** True when the per-project folder (wiki/projects/<slug>/, .raw/projects/<slug>/) was created. */
  projectCreated: boolean;
  /** True when the per-project folder already existed and nothing was done. */
  alreadyUpToDate: boolean;
}

const TYPE_TO_SOURCE: Record<ProjectType, string | null> = {
  library: "erp-pro-ui",
  app: "erp-pro",
  service: "auth-service",
  cli: "personal-ai-skills",
  generic: null,
};

/** Locate `templates/brain/` in both dev (next to src/) and installed (sibling of dist/) layouts. */
function getBrainTemplatesRoot(): string {
  const here = path.dirname(new URL(import.meta.url).pathname);
  const devPath = path.join(here, "..", "templates", "brain");
  const prodPath = path.join(here, "..", "..", "templates", "brain");
  return fs.existsSync(devPath) ? devPath : prodPath;
}

/** Replace placeholders + add the EDITME banner if the file came from a real example folder. */
function transformTemplate(
  content: string,
  opts: { projectName: string; projectSlug: string; projectDescription: string; sourceProject: string | null },
): string {
  const { projectName, projectSlug, projectDescription, sourceProject } = opts;

  let out = content
    .replace(/\{\{PROJECT_NAME\}\}/g, projectName)
    .replace(/\{\{PROJECT_SLUG\}\}/g, projectSlug)
    .replace(/\{\{PROJECT_DESCRIPTION\}\}/g, projectDescription);

  // Swap the first H1 to the user's project name (only for example-sourced files).
  if (sourceProject) {
    out = out.replace(/^#\s+.+$/m, `# ${projectName}`);
  }

  // Prepend EDITME banner for example-sourced files. The banner sits AFTER any frontmatter
  // so Obsidian still parses tags correctly.
  if (sourceProject) {
    const banner = `\n> ⚠️ **EXAMPLE based on \`${sourceProject}\`** — adapt this to your actual project.\n> Remove this banner once you've replaced the example content.\n\n`;
    if (out.startsWith("---\n")) {
      const closeIdx = out.indexOf("\n---", 4);
      if (closeIdx !== -1) {
        const insertAt = closeIdx + 4; // after the closing `\n---`
        out = out.slice(0, insertAt) + banner + out.slice(insertAt);
      } else {
        out = banner + out;
      }
    } else {
      out = banner + out;
    }
  }

  return out;
}

async function copyDirRecursive(
  src: string,
  dst: string,
  transform?: (content: string, relPath: string) => string,
): Promise<void> {
  await fs.promises.mkdir(dst, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      await copyDirRecursive(srcPath, dstPath, transform);
    } else {
      // Skip if destination already exists — idempotency guarantee.
      try {
        await fs.promises.access(dstPath);
        continue;
      } catch {
        // Doesn't exist — safe to write
      }
      const raw = await fs.promises.readFile(srcPath, "utf-8");
      const content = transform ? transform(raw, entry.name) : raw;
      await fs.promises.writeFile(dstPath, content, "utf-8");
    }
  }
}

/** Append a Projects-table row to wiki/index.md if it isn't there yet. */
async function appendProjectsRow(
  indexPath: string,
  projectSlug: string,
  projectType: ProjectType,
  projectName: string,
): Promise<void> {
  let content: string;
  try {
    content = await fs.promises.readFile(indexPath, "utf-8");
  } catch {
    return; // index.md doesn't exist — skip silently
  }

  // Already there?
  if (content.includes(`[[projects/${projectSlug}/`)) return;

  const lines = content.split("\n");
  const headerIdx = lines.findIndex((l) => l.includes("| Project") && l.includes("Status"));
  if (headerIdx === -1) return; // No Projects table

  // Find the end of the table (last consecutive `|` line after the header)
  let lastTableLine = headerIdx;
  for (let i = headerIdx + 1; i < lines.length; i++) {
    if (lines[i].trimStart().startsWith("|")) lastTableLine = i;
    else if (lines[i].trim() !== "") break;
  }

  // If the table only has its header + separator + the placeholder "_no projects yet_" row,
  // replace the placeholder. Otherwise append a new row.
  const placeholderIdx = lines.findIndex(
    (l) => l.includes("_no projects yet") || l.includes("_empty — wizard adds"),
  );
  const newRow = `| ${projectSlug} | active | ${projectType} | [[projects/${projectSlug}/index]] |`;

  if (placeholderIdx !== -1 && placeholderIdx <= lastTableLine) {
    lines[placeholderIdx] = newRow;
  } else {
    lines.splice(lastTableLine + 1, 0, newRow);
  }

  await fs.promises.writeFile(indexPath, lines.join("\n"), "utf-8");
}

/**
 * Scaffold the canonical brain at `vaultPath`. See file header for layout.
 *
 * - Case A (fresh user): creates the full skeleton + this project's folders
 * - Case B (vault exists, new project): adds only this project's folders
 * - Case C (re-run in same project): no-op
 * - Case D (no vaultPath / no slug): no-op
 */
export async function scaffoldBrain(
  opts: ScaffoldBrainOptions,
): Promise<ScaffoldBrainResult> {
  const { vaultPath, projectSlug, projectName, projectDescription, projectType } = opts;

  if (!vaultPath || !projectSlug) {
    return { vaultCreated: false, projectCreated: false, alreadyUpToDate: false };
  }

  const templatesRoot = getBrainTemplatesRoot();
  const sourceProject = TYPE_TO_SOURCE[projectType];

  const transform = (raw: string): string =>
    transformTemplate(raw, { projectName, projectSlug, projectDescription, sourceProject });

  // --- Detect case ---
  const skeletonMarker = path.join(vaultPath, "config", "always.md");
  const projectFolder = path.join(vaultPath, "wiki", "projects", projectSlug);

  let vaultExists = false;
  try {
    await fs.promises.access(skeletonMarker);
    vaultExists = true;
  } catch {
    // Skeleton missing
  }

  let projectExists = false;
  try {
    await fs.promises.access(projectFolder);
    projectExists = true;
  } catch {
    // Project folder missing
  }

  // Case C — already done
  if (vaultExists && projectExists) {
    return { vaultCreated: false, projectCreated: false, alreadyUpToDate: true };
  }

  // --- Case A: scaffold the skeleton ---
  let vaultCreated = false;
  if (!vaultExists) {
    // config/, .raw/, wiki/{hot.md, index.md, concepts, entities, sources, projects/shared}
    await copyDirRecursive(
      path.join(templatesRoot, "config"),
      path.join(vaultPath, "config"),
      transform,
    );
    await copyDirRecursive(
      path.join(templatesRoot, ".raw"),
      path.join(vaultPath, ".raw"),
      transform,
    );

    // wiki/ — copy everything except project-types (handled below) and projects/shared (also below)
    await fs.promises.mkdir(path.join(vaultPath, "wiki"), { recursive: true });
    for (const entry of await fs.promises.readdir(path.join(templatesRoot, "wiki"), { withFileTypes: true })) {
      if (entry.name === "projects") continue; // handled separately
      const src = path.join(templatesRoot, "wiki", entry.name);
      const dst = path.join(vaultPath, "wiki", entry.name);
      if (entry.isDirectory()) {
        await copyDirRecursive(src, dst, transform);
      } else {
        try {
          await fs.promises.access(dst);
        } catch {
          const raw = await fs.promises.readFile(src, "utf-8");
          await fs.promises.writeFile(dst, transform(raw), "utf-8");
        }
      }
    }
    await copyDirRecursive(
      path.join(templatesRoot, "wiki", "projects", "shared"),
      path.join(vaultPath, "wiki", "projects", "shared"),
      transform,
    );

    vaultCreated = true;
  }

  // --- Case A or B: scaffold per-project folders ---
  await fs.promises.mkdir(path.join(vaultPath, ".raw", "projects", projectSlug), { recursive: true });
  const rawReadmePath = path.join(vaultPath, ".raw", "projects", projectSlug, "README.md");
  try {
    await fs.promises.access(rawReadmePath);
  } catch {
    await fs.promises.writeFile(
      rawReadmePath,
      `# .raw — ${projectName}\n\nDrop project-specific source materials here:\n\n- PDFs (papers, vendor docs, RFCs)\n- Screenshots (design reviews, audit findings)\n- Videos / transcripts (architecture meetings, user interviews)\n- Exported chats with subject-matter experts\n\nDon't commit secrets. This folder is local; treat it as private.\n`,
      "utf-8",
    );
  }

  await copyDirRecursive(
    path.join(templatesRoot, "project-types", projectType),
    projectFolder,
    transform,
  );

  await appendProjectsRow(
    path.join(vaultPath, "wiki", "index.md"),
    projectSlug,
    projectType,
    projectName,
  );

  return { vaultCreated, projectCreated: true, alreadyUpToDate: false };
}
