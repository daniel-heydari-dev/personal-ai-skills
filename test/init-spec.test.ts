import { describe, expect, it, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

// ============================================================================
// init spec Tests
//
// cmdInitSpec and updateSpecMap are internal to cli.ts so we test their
// behaviour through the file-system side effects.
// We import updateSpecMap by extracting it into a testable unit below.
// ============================================================================

/**
 * Inline copy of updateSpecMap logic for unit testing without spawning CLI.
 * Keep this in sync with src/cli.ts:updateSpecMap.
 */
async function updateSpecMap(
  rootSpecPath: string,
  specName: string,
  specRelPath: string,
): Promise<void> {
  let content: string;
  try {
    content = await fs.promises.readFile(rootSpecPath, "utf-8");
  } catch {
    return;
  }

  const lines = content.split("\n");
  const headerIdx = lines.findIndex((l) => l.includes("| Topic"));
  if (headerIdx === -1) return;

  let lastTableLine = headerIdx;
  for (let i = headerIdx + 1; i < lines.length; i++) {
    if (lines[i].trimStart().startsWith("|")) {
      lastTableLine = i;
    } else if (
      lines[i].trim() !== "" &&
      !lines[i].trimStart().startsWith("|")
    ) {
      break;
    }
  }

  const newRow = `| ${specName} | ${specRelPath} |`;
  lines.splice(lastTableLine + 1, 0, newRow);
  await fs.promises.writeFile(rootSpecPath, lines.join("\n"), "utf-8");
}

function makeTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "init-spec-test-"));
}

const SPEC_ROOT_CONTENT = `# My Project

## 🗺️ Spec Map (load only when relevant)

| Topic       | Load                         |
| ----------- | ---------------------------- |
| {{TOPIC_1}} | docs/spec/{{AREA_1}}/SPEC.md |
`;

describe("updateSpecMap", () => {
  it("appends a row to the Spec Map table", async () => {
    const tmp = makeTempDir();
    const specPath = path.join(tmp, "SPEC.md");
    await fs.promises.writeFile(specPath, SPEC_ROOT_CONTENT, "utf-8");

    await updateSpecMap(specPath, "auth", "docs/spec/auth/SPEC.md");

    const result = await fs.promises.readFile(specPath, "utf-8");
    expect(result).toContain("| auth | docs/spec/auth/SPEC.md |");
    fs.rmSync(tmp, { recursive: true });
  });

  it("appending a second spec adds a second row without breaking the first", async () => {
    const tmp = makeTempDir();
    const specPath = path.join(tmp, "SPEC.md");
    await fs.promises.writeFile(specPath, SPEC_ROOT_CONTENT, "utf-8");

    await updateSpecMap(specPath, "auth", "docs/spec/auth/SPEC.md");
    await updateSpecMap(specPath, "billing", "docs/spec/billing/SPEC.md");

    const result = await fs.promises.readFile(specPath, "utf-8");
    expect(result).toContain("| auth | docs/spec/auth/SPEC.md |");
    expect(result).toContain("| billing | docs/spec/billing/SPEC.md |");
    fs.rmSync(tmp, { recursive: true });
  });

  it("does nothing if SPEC.md does not exist", async () => {
    const tmp = makeTempDir();
    // Should not throw when file is missing
    await expect(
      updateSpecMap(path.join(tmp, "SPEC.md"), "auth", "docs/spec/auth/SPEC.md"),
    ).resolves.toBeUndefined();
    fs.rmSync(tmp, { recursive: true });
  });

  it("does nothing if SPEC.md has no Spec Map table", async () => {
    const tmp = makeTempDir();
    const specPath = path.join(tmp, "SPEC.md");
    const content = "# My Project\n\nNo table here.\n";
    await fs.promises.writeFile(specPath, content, "utf-8");

    await updateSpecMap(specPath, "auth", "docs/spec/auth/SPEC.md");

    const result = await fs.promises.readFile(specPath, "utf-8");
    expect(result).toBe(content); // Unchanged
    fs.rmSync(tmp, { recursive: true });
  });

  it("preserves content before and after the Spec Map table", async () => {
    const tmp = makeTempDir();
    const specPath = path.join(tmp, "SPEC.md");
    const content = `# My Project

Some content before.

## 🗺️ Spec Map

| Topic | Load |
| ----- | ---- |

Some content after.
`;
    await fs.promises.writeFile(specPath, content, "utf-8");

    await updateSpecMap(specPath, "auth", "docs/spec/auth/SPEC.md");

    const result = await fs.promises.readFile(specPath, "utf-8");
    expect(result).toContain("Some content before.");
    expect(result).toContain("Some content after.");
    expect(result).toContain("| auth | docs/spec/auth/SPEC.md |");
    fs.rmSync(tmp, { recursive: true });
  });
});

describe("SPEC templates — file content validation", () => {
  it("SPEC.root.md template exists and contains expected placeholders", async () => {
    // Find templates dir relative to this test file
    const templatesDir = path.join(
      path.dirname(new URL(import.meta.url).pathname),
      "..",
      "templates",
      "shared",
    );
    const rootSpecPath = path.join(templatesDir, "SPEC.root.md");
    const content = await fs.promises.readFile(rootSpecPath, "utf-8");

    expect(content).toContain("{{PROJECT_NAME}}");
    expect(content).toContain("{{ONE_LINE_DESCRIPTION}}");
    expect(content).toContain("{{TECH_STACK}}");
    expect(content).toContain("{{PROJECT_SLUG}}");
    expect(content).toContain("Spec Map");
    expect(content).toContain("Skills Map");
  });

  it("SPEC.page.md template exists and contains expected placeholders", async () => {
    const templatesDir = path.join(
      path.dirname(new URL(import.meta.url).pathname),
      "..",
      "templates",
      "shared",
    );
    const pageSpecPath = path.join(templatesDir, "SPEC.page.md");
    const content = await fs.promises.readFile(pageSpecPath, "utf-8");

    expect(content).toContain("{{PAGE_NAME}}");
    expect(content).toContain("Purpose");
    expect(content).toContain("Current State");
    expect(content).toContain("Business Rules");
  });
});
