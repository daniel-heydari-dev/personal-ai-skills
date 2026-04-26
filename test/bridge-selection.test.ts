import { describe, expect, it } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import {
  generateBridgeFilesForIds,
  getAvailableBridgeTypes,
} from "../src/bridge.js";
import { ALL_BRIDGE_IDS } from "../src/prompts.js";

// ============================================================================
// Bridge Selection / parseBridgeFlag Tests
//
// parseBridgeFlag is an internal function in cli.ts, so we test its
// observable behaviour through generateBridgeFilesForIds and ALL_BRIDGE_IDS.
// ============================================================================

function makeTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "bridge-select-test-"));
}

describe("ALL_BRIDGE_IDS", () => {
  it("includes all 8 expected bridge types", () => {
    expect(ALL_BRIDGE_IDS).toContain("claude");
    expect(ALL_BRIDGE_IDS).toContain("vscode");
    expect(ALL_BRIDGE_IDS).toContain("cursor");
    expect(ALL_BRIDGE_IDS).toContain("webstorm");
    expect(ALL_BRIDGE_IDS).toContain("zed");
    expect(ALL_BRIDGE_IDS).toContain("windsurf");
    expect(ALL_BRIDGE_IDS).toContain("neovim");
    expect(ALL_BRIDGE_IDS).toContain("gemini");
    expect(ALL_BRIDGE_IDS).toHaveLength(8);
  });
});

describe("getAvailableBridgeTypes", () => {
  it("includes vscode in available types", () => {
    const types = getAvailableBridgeTypes();
    expect(types).toContain("vscode");
    expect(types).toContain("claude");
    expect(types).toContain("cursor");
  });
});

describe("generateBridgeFilesForIds — bridge selection logic", () => {
  it("empty list → no files generated", async () => {
    const tmp = makeTempDir();
    const files = await generateBridgeFilesForIds([], tmp);
    expect(files).toHaveLength(0);
    fs.rmSync(tmp, { recursive: true });
  });

  it("['none'] → no files generated", async () => {
    const tmp = makeTempDir();
    const files = await generateBridgeFilesForIds(["none"], tmp);
    expect(files).toHaveLength(0);
    fs.rmSync(tmp, { recursive: true });
  });

  it("['claude'] → exactly 1 file (CLAUDE.md)", async () => {
    const tmp = makeTempDir();
    const files = await generateBridgeFilesForIds(["claude"], tmp);
    expect(files).toHaveLength(1);
    expect(files[0].filePath).toBe("CLAUDE.md");
    fs.rmSync(tmp, { recursive: true });
  });

  it("['cursor'] → exactly 1 file (.cursor/rules/ai-config.mdc)", async () => {
    const tmp = makeTempDir();
    const files = await generateBridgeFilesForIds(["cursor"], tmp);
    expect(files).toHaveLength(1);
    expect(files[0].filePath).toBe(".cursor/rules/ai-config.mdc");
    fs.rmSync(tmp, { recursive: true });
  });

  it("['claude', 'cursor'] → exactly 2 files", async () => {
    const tmp = makeTempDir();
    const files = await generateBridgeFilesForIds(["claude", "cursor"], tmp);
    expect(files).toHaveLength(2);
    const paths = files.map((f) => f.filePath);
    expect(paths).toContain("CLAUDE.md");
    expect(paths).toContain(".cursor/rules/ai-config.mdc");
    fs.rmSync(tmp, { recursive: true });
  });

  it("['claude', 'cursor', 'vscode'] → exactly 3 files", async () => {
    const tmp = makeTempDir();
    const files = await generateBridgeFilesForIds(
      ["claude", "cursor", "vscode"],
      tmp,
    );
    expect(files).toHaveLength(3);
    const paths = files.map((f) => f.filePath);
    expect(paths).toContain("CLAUDE.md");
    expect(paths).toContain(".cursor/rules/ai-config.mdc");
    expect(paths).toContain(".vscode/settings.json");
    fs.rmSync(tmp, { recursive: true });
  });

  it("['codex'] → AGENTS.md (universal bridge)", async () => {
    const tmp = makeTempDir();
    const files = await generateBridgeFilesForIds(["codex"], tmp);
    // codex maps to 'universal' which generates AGENTS.md
    expect(files[0].filePath).toBe("AGENTS.md");
    fs.rmSync(tmp, { recursive: true });
  });

  it("['all'] → generates more than 3 files", async () => {
    const tmp = makeTempDir();
    const files = await generateBridgeFilesForIds(["all"], tmp);
    expect(files.length).toBeGreaterThan(3);
    fs.rmSync(tmp, { recursive: true });
  });

  it("unknown bridge ID → no file generated (silently skipped)", async () => {
    const tmp = makeTempDir();
    const files = await generateBridgeFilesForIds(["nonexistent-tool"], tmp);
    expect(files).toHaveLength(0);
    fs.rmSync(tmp, { recursive: true });
  });
});

describe("CLAUDE.md bridge — map pattern", () => {
  it("CLAUDE.md is map pattern — not a content dump", async () => {
    const tmp = makeTempDir();
    const files = await generateBridgeFilesForIds(["claude"], tmp);
    const claudeFile = files.find((f) => f.filePath === "CLAUDE.md");
    expect(claudeFile).toBeDefined();
    // Map-pattern CLAUDE.md has tables pointing to .ai/ — richer than old stub but not a content dump
    expect(claudeFile!.content.length).toBeLessThan(2500);
    fs.rmSync(tmp, { recursive: true });
  });

  it("CLAUDE.md content contains Always Load section", async () => {
    const tmp = makeTempDir();
    const files = await generateBridgeFilesForIds(["claude"], tmp);
    const claudeFile = files.find((f) => f.filePath === "CLAUDE.md");
    expect(claudeFile!.content).toContain("Always Load");
    fs.rmSync(tmp, { recursive: true });
  });
});
