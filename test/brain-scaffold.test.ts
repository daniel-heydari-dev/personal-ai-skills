import { describe, expect, it, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { scaffoldBrain } from "../src/brain-scaffold.js";

// ============================================================================
// Brain Scaffold Tests
//
// scaffoldBrain creates the canonical Obsidian brain layout:
//   <vault>/config/, <vault>/.raw/, <vault>/wiki/{hot.md,index.md,projects/...}
//
// Tests use mkdtempSync for isolation. Each test gets a fresh tmp vault.
// ============================================================================

let vaultDir: string;

beforeEach(() => {
  vaultDir = fs.mkdtempSync(path.join(os.tmpdir(), "brain-scaffold-"));
});

afterEach(() => {
  fs.rmSync(vaultDir, { recursive: true, force: true });
});

describe("scaffoldBrain — Case A (fresh vault)", () => {
  it("creates the full vault skeleton on first install", async () => {
    const result = await scaffoldBrain({
      vaultPath: vaultDir,
      projectSlug: "my-app",
      projectName: "My App",
      projectDescription: "A test SaaS app",
      projectType: "app",
    });

    expect(result.vaultCreated).toBe(true);
    expect(result.projectCreated).toBe(true);
    expect(result.alreadyUpToDate).toBe(false);

    // Skeleton
    expect(fs.existsSync(path.join(vaultDir, "config", "always.md"))).toBe(true);
    expect(fs.existsSync(path.join(vaultDir, "config", "integrations", "obsidian.md"))).toBe(true);
    expect(fs.existsSync(path.join(vaultDir, "config", "integrations", "claude-mem.md"))).toBe(true);
    expect(fs.existsSync(path.join(vaultDir, "config", "integrations", "graphify.md"))).toBe(true);
    expect(fs.existsSync(path.join(vaultDir, "wiki", "index.md"))).toBe(true);
    expect(fs.existsSync(path.join(vaultDir, "wiki", "hot.md"))).toBe(true);
    expect(fs.existsSync(path.join(vaultDir, "wiki", "projects", "shared", "api-contracts.md"))).toBe(true);
    expect(fs.existsSync(path.join(vaultDir, ".raw", "README.md"))).toBe(true);

    // Per-project (app type)
    expect(fs.existsSync(path.join(vaultDir, ".raw", "projects", "my-app", "README.md"))).toBe(true);
    expect(fs.existsSync(path.join(vaultDir, "wiki", "projects", "my-app", "index.md"))).toBe(true);
    expect(fs.existsSync(path.join(vaultDir, "wiki", "projects", "my-app", "decisions.md"))).toBe(true);
    expect(fs.existsSync(path.join(vaultDir, "wiki", "projects", "my-app", "architecture.md"))).toBe(true);
    expect(fs.existsSync(path.join(vaultDir, "wiki", "projects", "my-app", "api-contracts.md"))).toBe(true);
    expect(fs.existsSync(path.join(vaultDir, "wiki", "projects", "my-app", "dependencies.md"))).toBe(true);
  });

  it("library type produces the 5 library files (incl. decisions.md)", async () => {
    await scaffoldBrain({
      vaultPath: vaultDir,
      projectSlug: "my-lib",
      projectName: "My Lib",
      projectDescription: "A test component library",
      projectType: "library",
    });

    const folder = path.join(vaultDir, "wiki", "projects", "my-lib");
    expect(fs.existsSync(path.join(folder, "index.md"))).toBe(true);
    expect(fs.existsSync(path.join(folder, "components.md"))).toBe(true);
    expect(fs.existsSync(path.join(folder, "design-tokens.md"))).toBe(true);
    expect(fs.existsSync(path.join(folder, "changelog.md"))).toBe(true);
    expect(fs.existsSync(path.join(folder, "decisions.md"))).toBe(true);
  });

  it("service type produces the 4 service files", async () => {
    await scaffoldBrain({
      vaultPath: vaultDir,
      projectSlug: "my-auth",
      projectName: "My Auth",
      projectDescription: "An auth microservice",
      projectType: "service",
    });

    const folder = path.join(vaultDir, "wiki", "projects", "my-auth");
    expect(fs.existsSync(path.join(folder, "index.md"))).toBe(true);
    expect(fs.existsSync(path.join(folder, "roles-matrix.md"))).toBe(true);
    expect(fs.existsSync(path.join(folder, "api-contracts.md"))).toBe(true);
    expect(fs.existsSync(path.join(folder, "flows.md"))).toBe(true);
  });

  it("cli type produces the 4 cli files", async () => {
    await scaffoldBrain({
      vaultPath: vaultDir,
      projectSlug: "my-cli",
      projectName: "My CLI",
      projectDescription: "A CLI tool",
      projectType: "cli",
    });

    const folder = path.join(vaultDir, "wiki", "projects", "my-cli");
    expect(fs.existsSync(path.join(folder, "index.md"))).toBe(true);
    expect(fs.existsSync(path.join(folder, "decisions.md"))).toBe(true);
    expect(fs.existsSync(path.join(folder, "architecture.md"))).toBe(true);
    expect(fs.existsSync(path.join(folder, "catalog.md"))).toBe(true);
  });

  it("generic type produces the 2 generic files", async () => {
    await scaffoldBrain({
      vaultPath: vaultDir,
      projectSlug: "my-thing",
      projectName: "My Thing",
      projectDescription: "Something",
      projectType: "generic",
    });

    const folder = path.join(vaultDir, "wiki", "projects", "my-thing");
    expect(fs.existsSync(path.join(folder, "index.md"))).toBe(true);
    expect(fs.existsSync(path.join(folder, "decisions.md"))).toBe(true);
  });
});

describe("scaffoldBrain — banner + H1 substitution", () => {
  it("prepends the EDITME banner to example-sourced files", async () => {
    await scaffoldBrain({
      vaultPath: vaultDir,
      projectSlug: "my-app",
      projectName: "My App",
      projectDescription: "x",
      projectType: "app",
    });

    const indexContent = fs.readFileSync(
      path.join(vaultDir, "wiki", "projects", "my-app", "index.md"),
      "utf-8",
    );
    expect(indexContent).toContain("EXAMPLE based on `erp-pro`");
  });

  it("swaps the H1 to {{PROJECT_NAME}} for example-sourced files", async () => {
    await scaffoldBrain({
      vaultPath: vaultDir,
      projectSlug: "my-app",
      projectName: "My Awesome App",
      projectDescription: "x",
      projectType: "app",
    });

    const indexContent = fs.readFileSync(
      path.join(vaultDir, "wiki", "projects", "my-app", "index.md"),
      "utf-8",
    );
    expect(indexContent).toMatch(/^# My Awesome App\b/m);
    // Original "# erp-pro" H1 should be gone
    expect(indexContent).not.toMatch(/^# erp-pro\b/m);
  });

  it("does NOT add banner to generic-type files (no source project)", async () => {
    await scaffoldBrain({
      vaultPath: vaultDir,
      projectSlug: "my-thing",
      projectName: "My Thing",
      projectDescription: "x",
      projectType: "generic",
    });

    const indexContent = fs.readFileSync(
      path.join(vaultDir, "wiki", "projects", "my-thing", "index.md"),
      "utf-8",
    );
    expect(indexContent).not.toContain("EXAMPLE based on");
  });
});

describe("scaffoldBrain — Case B (vault exists, new project)", () => {
  it("skips skeleton creation; only adds the new project folder", async () => {
    // First install
    await scaffoldBrain({
      vaultPath: vaultDir,
      projectSlug: "first-app",
      projectName: "First App",
      projectDescription: "x",
      projectType: "app",
    });

    // Mark a skeleton file so we can detect overwrites
    const alwaysPath = path.join(vaultDir, "config", "always.md");
    const before = fs.readFileSync(alwaysPath, "utf-8");
    fs.writeFileSync(alwaysPath, before + "\n<!-- USER-EDITED-MARKER -->\n");
    const marked = fs.readFileSync(alwaysPath, "utf-8");

    // Second install — different project
    const result = await scaffoldBrain({
      vaultPath: vaultDir,
      projectSlug: "second-lib",
      projectName: "Second Lib",
      projectDescription: "y",
      projectType: "library",
    });

    expect(result.vaultCreated).toBe(false);
    expect(result.projectCreated).toBe(true);

    // Skeleton file untouched
    expect(fs.readFileSync(alwaysPath, "utf-8")).toBe(marked);

    // Both project folders exist
    expect(fs.existsSync(path.join(vaultDir, "wiki", "projects", "first-app", "index.md"))).toBe(true);
    expect(fs.existsSync(path.join(vaultDir, "wiki", "projects", "second-lib", "index.md"))).toBe(true);
  });

  it("appends a row to wiki/index.md Projects table for each project", async () => {
    await scaffoldBrain({
      vaultPath: vaultDir,
      projectSlug: "first-app",
      projectName: "First App",
      projectDescription: "x",
      projectType: "app",
    });
    await scaffoldBrain({
      vaultPath: vaultDir,
      projectSlug: "second-lib",
      projectName: "Second Lib",
      projectDescription: "y",
      projectType: "library",
    });

    const idx = fs.readFileSync(path.join(vaultDir, "wiki", "index.md"), "utf-8");
    expect(idx).toContain("[[projects/first-app/index]]");
    expect(idx).toContain("[[projects/second-lib/index]]");
  });
});

describe("scaffoldBrain — Case C (re-run in same project)", () => {
  it("returns alreadyUpToDate=true on second run with same slug", async () => {
    await scaffoldBrain({
      vaultPath: vaultDir,
      projectSlug: "my-app",
      projectName: "My App",
      projectDescription: "x",
      projectType: "app",
    });
    const result = await scaffoldBrain({
      vaultPath: vaultDir,
      projectSlug: "my-app",
      projectName: "My App",
      projectDescription: "x",
      projectType: "app",
    });

    expect(result.vaultCreated).toBe(false);
    expect(result.projectCreated).toBe(false);
    expect(result.alreadyUpToDate).toBe(true);
  });

  it("does not overwrite user edits in project files on re-run", async () => {
    await scaffoldBrain({
      vaultPath: vaultDir,
      projectSlug: "my-app",
      projectName: "My App",
      projectDescription: "x",
      projectType: "app",
    });

    const decisionsPath = path.join(vaultDir, "wiki", "projects", "my-app", "decisions.md");
    fs.writeFileSync(decisionsPath, "# Custom decisions\n\nADR-99: I edited this\n");

    await scaffoldBrain({
      vaultPath: vaultDir,
      projectSlug: "my-app",
      projectName: "My App",
      projectDescription: "x",
      projectType: "app",
    });

    expect(fs.readFileSync(decisionsPath, "utf-8")).toBe(
      "# Custom decisions\n\nADR-99: I edited this\n",
    );
  });
});

describe("scaffoldBrain — Case D (no-op)", () => {
  it("returns no-op when vaultPath is empty", async () => {
    const result = await scaffoldBrain({
      vaultPath: "",
      projectSlug: "my-app",
      projectName: "My App",
      projectDescription: "x",
      projectType: "app",
    });

    expect(result).toEqual({ vaultCreated: false, projectCreated: false, alreadyUpToDate: false });
  });

  it("returns no-op when projectSlug is empty", async () => {
    const result = await scaffoldBrain({
      vaultPath: vaultDir,
      projectSlug: "",
      projectName: "My App",
      projectDescription: "x",
      projectType: "app",
    });

    expect(result).toEqual({ vaultCreated: false, projectCreated: false, alreadyUpToDate: false });
    expect(fs.existsSync(path.join(vaultDir, "config"))).toBe(false);
  });
});
