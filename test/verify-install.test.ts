import { describe, expect, it, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { verifyInstall } from "../src/verify-install.js";

let projectDir: string;

beforeEach(() => {
  projectDir = fs.mkdtempSync(path.join(os.tmpdir(), "verify-install-"));
});

afterEach(() => {
  fs.rmSync(projectDir, { recursive: true, force: true });
});

describe("verifyInstall — file existence checks", () => {
  it("reports missing SPEC.md / CLAUDE.md as warnings", async () => {
    const result = await verifyInstall({
      projectRoot: projectDir,
      installedSkills: [],
      installedAgents: [],
      installedRules: [],
      bridgeIds: [],
    });

    expect(result.warnings).toBeGreaterThan(0);
    expect(result.lines.some((l) => l.includes("SPEC.md missing"))).toBe(true);
    expect(result.lines.some((l) => l.includes("CLAUDE.md missing"))).toBe(true);
  });

  it("reports passing checks when files exist", async () => {
    fs.writeFileSync(path.join(projectDir, "SPEC.md"), "# Spec\n\nx\n");
    fs.writeFileSync(path.join(projectDir, "CLAUDE.md"), "# CLAUDE.md\n\nx\n");

    const result = await verifyInstall({
      projectRoot: projectDir,
      installedSkills: [],
      installedAgents: [],
      installedRules: [],
      bridgeIds: [],
    });

    expect(result.passed).toBeGreaterThanOrEqual(2);
  });
});

describe("verifyInstall — @-import resolution", () => {
  it("flags broken @-imports as errors", async () => {
    fs.writeFileSync(
      path.join(projectDir, "CLAUDE.md"),
      "# CLAUDE.md\n\n- Root spec: @SPEC.md\n- @.ai/rules/missing/RULE.md\n",
    );
    // SPEC.md does NOT exist — should fail

    const result = await verifyInstall({
      projectRoot: projectDir,
      installedSkills: [],
      installedAgents: [],
      installedRules: [],
      bridgeIds: [],
    });

    expect(result.errors).toBeGreaterThan(0);
    expect(result.lines.some((l) => l.includes("@SPEC.md does NOT resolve"))).toBe(true);
  });

  it("passes when all @-imports resolve", async () => {
    fs.writeFileSync(path.join(projectDir, "SPEC.md"), "# Spec\n");
    fs.mkdirSync(path.join(projectDir, ".ai", "rules"), { recursive: true });
    fs.writeFileSync(path.join(projectDir, ".ai", "rules", "always.md"), "# Always\n");
    fs.writeFileSync(
      path.join(projectDir, "CLAUDE.md"),
      "# CLAUDE.md\n\n- Root spec: @SPEC.md\n- Rules: @.ai/rules/always.md\n",
    );

    const result = await verifyInstall({
      projectRoot: projectDir,
      installedSkills: [],
      installedAgents: [],
      installedRules: [],
      bridgeIds: [],
    });

    expect(result.lines.some((l) => l.includes("@SPEC.md resolves"))).toBe(true);
    expect(result.lines.some((l) => l.includes("@.ai/rules/always.md resolves"))).toBe(true);
  });
});

describe("verifyInstall — Spec Map row check", () => {
  it("flags Spec Map rows that point to missing docs/spec/ files", async () => {
    fs.writeFileSync(
      path.join(projectDir, "CLAUDE.md"),
      [
        "# CLAUDE.md",
        "",
        "## Spec Map",
        "| Topic | Keywords | Load |",
        "| --- | --- | --- |",
        "| billing | billing | `docs/spec/billing/SPEC.md` |",
      ].join("\n"),
    );

    const result = await verifyInstall({
      projectRoot: projectDir,
      installedSkills: [],
      installedAgents: [],
      installedRules: [],
      bridgeIds: [],
    });

    expect(result.errors).toBeGreaterThan(0);
    expect(result.lines.some((l) => l.includes("docs/spec/billing/SPEC.md"))).toBe(true);
  });
});

describe("verifyInstall — paste prompt", () => {
  it("includes installed skills/agents/rules in the paste prompt", async () => {
    const result = await verifyInstall({
      projectRoot: projectDir,
      projectSlug: "my-app",
      projectType: "app",
      installedSkills: ["clean-typescript", "modern-react"],
      installedAgents: ["code-reviewer"],
      installedRules: ["small-components"],
      bridgeIds: ["claude", "codex"],
    });

    expect(result.pastePrompt).toContain("Slug: my-app");
    expect(result.pastePrompt).toContain("Type: app");
    expect(result.pastePrompt).toContain("clean-typescript, modern-react");
    expect(result.pastePrompt).toContain("code-reviewer");
    expect(result.pastePrompt).toContain("small-components");
    expect(result.pastePrompt).toContain("claude, codex");
  });

  it("includes the static-check summary in the paste prompt", async () => {
    const result = await verifyInstall({
      projectRoot: projectDir,
      installedSkills: [],
      installedAgents: [],
      installedRules: [],
      bridgeIds: [],
    });

    expect(result.pastePrompt).toMatch(/\d+ passed, \d+ warnings, \d+ errors/);
  });
});
