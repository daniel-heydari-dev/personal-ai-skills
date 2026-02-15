/**
 * GitHub Integration
 *
 * Handles fetching skills from GitHub repositories and URLs.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import type {
  ContentSource,
  GitHubSource,
  UrlSource,
  LocalSource,
  FetchedSkill,
} from "./types.js";
import { parseFrontmatter } from "./catalog.js";

// Re-export types for consumers
export type {
  ContentSource,
  GitHubSource,
  UrlSource,
  LocalSource,
  FetchedSkill,
} from "./types.js";

// ============================================================================
// URL Parsing
// ============================================================================

/**
 * Parse source string into ContentSource
 */
export function parseSource(source: string): ContentSource {
  // Local path
  if (
    source.startsWith("/") ||
    source.startsWith("./") ||
    source.startsWith("../")
  ) {
    return { type: "local", path: source };
  }

  // GitHub URL
  if (source.includes("github.com")) {
    return parseGitHubUrl(source);
  }

  // GitHub shorthand: owner/repo
  if (/^[\w-]+\/[\w-]+$/.test(source)) {
    const [owner, repo] = source.split("/");
    return { type: "github", owner, repo };
  }

  // GitHub shorthand with path: owner/repo/path
  if (/^[\w-]+\/[\w-]+\//.test(source)) {
    const parts = source.split("/");
    const owner = parts[0];
    const repo = parts[1];
    const skillPath = parts.slice(2).join("/");
    return { type: "github", owner, repo, path: skillPath };
  }

  // Generic URL
  if (source.startsWith("http://") || source.startsWith("https://")) {
    return { type: "url", url: source };
  }

  // Default to GitHub shorthand
  throw new Error(`Unable to parse source: ${source}`);
}

/**
 * Parse GitHub URL into GitHubSource
 */
function parseGitHubUrl(url: string): GitHubSource {
  // https://github.com/owner/repo
  // https://github.com/owner/repo/tree/branch/path
  // https://github.com/owner/repo/blob/branch/path/SKILL.md

  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split("/").filter(Boolean);

  if (pathParts.length < 2) {
    throw new Error(`Invalid GitHub URL: ${url}`);
  }

  const owner = pathParts[0];
  const repo = pathParts[1];

  let branch: string | undefined;
  let skillPath: string | undefined;

  if (pathParts.length > 2) {
    // /tree/branch/path or /blob/branch/path
    if (pathParts[2] === "tree" || pathParts[2] === "blob") {
      branch = pathParts[3];
      if (pathParts.length > 4) {
        skillPath = pathParts.slice(4).join("/");
        // Remove SKILL.md from path if present
        skillPath = skillPath.replace(/\/SKILL\.md$/, "");
      }
    }
  }

  return { type: "github", owner, repo, branch, path: skillPath };
}

// ============================================================================
// Fetching Functions
// ============================================================================

/**
 * Fetch content from GitHub
 */
async function fetchFromGitHub(source: GitHubSource): Promise<string> {
  const branch = source.branch || "main";
  const filePath = source.path ? `${source.path}/SKILL.md` : "SKILL.md";

  const rawUrl = `https://raw.githubusercontent.com/${source.owner}/${source.repo}/${branch}/${filePath}`;

  const response = await fetch(rawUrl);
  if (!response.ok) {
    // Try with 'master' branch if 'main' fails
    if (branch === "main") {
      const masterUrl = rawUrl.replace("/main/", "/master/");
      const masterResponse = await fetch(masterUrl);
      if (masterResponse.ok) {
        return masterResponse.text();
      }
    }
    throw new Error(`Failed to fetch from GitHub: ${response.status}`);
  }

  return response.text();
}

/**
 * Fetch content from URL
 */
async function fetchFromUrl(source: UrlSource): Promise<string> {
  const response = await fetch(source.url);
  if (!response.ok) {
    throw new Error(`Failed to fetch from URL: ${response.status}`);
  }
  return response.text();
}

/**
 * Fetch content from local path
 */
async function fetchFromLocal(source: LocalSource): Promise<string> {
  const resolvedPath = path.resolve(source.path);
  const skillPath = path.join(resolvedPath, "SKILL.md");

  // Try SKILL.md in directory first
  try {
    return await fs.promises.readFile(skillPath, "utf-8");
  } catch {
    // Try as direct file path
    return await fs.promises.readFile(resolvedPath, "utf-8");
  }
}

/**
 * Fetch skill from any source
 */
export async function fetchSkill(source: ContentSource): Promise<FetchedSkill> {
  let content: string;

  switch (source.type) {
    case "github":
      content = await fetchFromGitHub(source);
      break;
    case "url":
      content = await fetchFromUrl(source);
      break;
    case "local":
      content = await fetchFromLocal(source);
      break;
  }

  const { frontmatter } = parseFrontmatter(content);

  // Derive ID from source
  let id: string;
  if (source.type === "github") {
    id = source.path?.split("/").pop() || source.repo;
  } else if (source.type === "local") {
    id = path.basename(source.path);
  } else {
    id =
      new URL(source.url).pathname.split("/").filter(Boolean).pop() || "skill";
  }

  return {
    id,
    name: (frontmatter.name as string) || id,
    description: (frontmatter.description as string) || "",
    content,
    source,
  };
}

/**
 * Fetch skill from source string
 */
export async function fetchSkillFromSource(
  sourceStr: string,
): Promise<FetchedSkill> {
  const source = parseSource(sourceStr);
  return fetchSkill(source);
}

/**
 * List skills available in a GitHub repository
 */
export async function listGitHubSkills(
  owner: string,
  repo: string,
  branch: string = "main",
): Promise<string[]> {
  // Use GitHub API to list contents
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/skills?ref=${branch}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "personal-ai-skills-cli",
      },
    });

    if (!response.ok) {
      // Try root directory
      return listGitHubSkillsRoot(owner, repo, branch);
    }

    const contents = (await response.json()) as Array<{
      name: string;
      type: string;
    }>;

    return contents
      .filter((item) => item.type === "dir")
      .map((item) => item.name);
  } catch {
    return [];
  }
}

/**
 * List skills in repo root
 */
async function listGitHubSkillsRoot(
  owner: string,
  repo: string,
  branch: string,
): Promise<string[]> {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents?ref=${branch}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "personal-ai-skills-cli",
      },
    });

    if (!response.ok) {
      return [];
    }

    const contents = (await response.json()) as Array<{
      name: string;
      type: string;
    }>;

    // Check if SKILL.md exists in root
    const hasSkillMd = contents.some(
      (item) => item.name === "SKILL.md" && item.type === "file",
    );

    if (hasSkillMd) {
      // Repo itself is a single skill
      return [repo];
    }

    // Check for skill directories
    const skillDirs: string[] = [];
    for (const item of contents) {
      if (item.type === "dir") {
        // Check if directory has SKILL.md
        const dirApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${item.name}?ref=${branch}`;
        const dirResponse = await fetch(dirApiUrl, {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "personal-ai-skills-cli",
          },
        });

        if (dirResponse.ok) {
          const dirContents = (await dirResponse.json()) as Array<{
            name: string;
          }>;
          if (dirContents.some((f) => f.name === "SKILL.md")) {
            skillDirs.push(item.name);
          }
        }
      }
    }

    return skillDirs;
  } catch {
    return [];
  }
}

/**
 * Get source display string
 */
export function getSourceDisplayString(source: ContentSource): string {
  switch (source.type) {
    case "github":
      const path = source.path ? `/${source.path}` : "";
      return `github:${source.owner}/${source.repo}${path}`;
    case "url":
      return source.url;
    case "local":
      return `local:${source.path}`;
  }
}
