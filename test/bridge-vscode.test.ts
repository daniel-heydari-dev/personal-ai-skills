import { describe, expect, it, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import {
  generateBridgeFiles,
  generateBridgeFilesForIds,
  writeBridgeFiles,
} from "../src/bridge.js";
import type { AssistantConfig } from "../src/types.js";

// ============================================================================
// VS Code Bridge Tests
// ============================================================================

/** Create a temp directory for each test */
function makeTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "bridge-vscode-test-"));
}

/** Minimal AssistantConfig for vscode */
const vscodeFakeAssistant: AssistantConfig = {
  id: "vscode",
  name: "VS Code",
  description: "VS Code with Copilot",
  detectInstalled: async () => false,
  paths: {},
  globalPaths: {},
};

describe("VS Code bridge — generateBridgeFilesForIds", () => {
  it("generates a vscode bridge file when requested", async () => {
    const tmp = makeTempDir();
    const files = await generateBridgeFilesForIds(["vscode"], tmp);
    expect(files).toHaveLength(1);
    expect(files[0].filePath).toBe(".vscode/settings.json");
    expect(files[0].alwaysWrite).toBe(true);
    fs.rmSync(tmp, { recursive: true });
  });

  it("generates valid JSON content", async () => {
    const tmp = makeTempDir();
    const files = await generateBridgeFilesForIds(["vscode"], tmp);
    const content = JSON.parse(files[0].content) as Record<string, unknown>;
    expect(content).toHaveProperty(
      "github.copilot.chat.codeGeneration.instructions",
    );
    expect(content).toHaveProperty(
      "github.copilot.chat.testGeneration.instructions",
    );
    expect(content).toHaveProperty(
      "github.copilot.chat.reviewSelection.instructions",
    );
    fs.rmSync(tmp, { recursive: true });
  });

  it("merges into existing settings — preserves unrelated keys", async () => {
    const tmp = makeTempDir();
    fs.mkdirSync(path.join(tmp, ".vscode"));
    fs.writeFileSync(
      path.join(tmp, ".vscode", "settings.json"),
      JSON.stringify({ "editor.fontSize": 14, "editor.tabSize": 2 }, null, 2),
    );

    const files = await generateBridgeFilesForIds(["vscode"], tmp);
    const content = JSON.parse(files[0].content) as Record<string, unknown>;

    expect(content["editor.fontSize"]).toBe(14);
    expect(content["editor.tabSize"]).toBe(2);
    expect(content).toHaveProperty(
      "github.copilot.chat.codeGeneration.instructions",
    );
    fs.rmSync(tmp, { recursive: true });
  });

  it("does NOT overwrite existing copilot keys", async () => {
    const tmp = makeTempDir();
    const existingInstructions = [{ text: "My custom instruction" }];
    fs.mkdirSync(path.join(tmp, ".vscode"));
    fs.writeFileSync(
      path.join(tmp, ".vscode", "settings.json"),
      JSON.stringify(
        {
          "github.copilot.chat.codeGeneration.instructions":
            existingInstructions,
        },
        null,
        2,
      ),
    );

    const files = await generateBridgeFilesForIds(["vscode"], tmp);
    const content = JSON.parse(files[0].content) as Record<string, unknown>;
    const instructions = content[
      "github.copilot.chat.codeGeneration.instructions"
    ] as unknown[];

    // Should keep the user's original value, not our new default
    expect(instructions).toEqual(existingInstructions);
    fs.rmSync(tmp, { recursive: true });
  });

  it("gracefully handles invalid JSON in existing settings file", async () => {
    const tmp = makeTempDir();
    fs.mkdirSync(path.join(tmp, ".vscode"));
    fs.writeFileSync(
      path.join(tmp, ".vscode", "settings.json"),
      "{ this is not valid json }",
    );

    // Should not throw — falls back to empty object
    const files = await generateBridgeFilesForIds(["vscode"], tmp);
    expect(files).toHaveLength(1);
    const content = JSON.parse(files[0].content) as Record<string, unknown>;
    expect(content).toHaveProperty(
      "github.copilot.chat.codeGeneration.instructions",
    );
    fs.rmSync(tmp, { recursive: true });
  });
});

describe("VS Code bridge — writeBridgeFiles with alwaysWrite", () => {
  it("writes even when file already exists (alwaysWrite=true)", async () => {
    const tmp = makeTempDir();
    fs.mkdirSync(path.join(tmp, ".vscode"));
    fs.writeFileSync(
      path.join(tmp, ".vscode", "settings.json"),
      JSON.stringify({ "editor.fontSize": 14 }, null, 2),
    );

    const files = await generateBridgeFilesForIds(["vscode"], tmp);
    const { written, skipped } = await writeBridgeFiles(
      files,
      tmp,
      false, // overwrite=false — but alwaysWrite should bypass this
    );

    expect(written).toContain(".vscode/settings.json");
    expect(skipped).not.toContain(".vscode/settings.json");
    fs.rmSync(tmp, { recursive: true });
  });

  it("normal bridge files are still skipped when they exist", async () => {
    const tmp = makeTempDir();
    fs.writeFileSync(path.join(tmp, "CLAUDE.md"), "existing content");

    const files = await generateBridgeFilesForIds(["claude"], tmp);
    const { written, skipped } = await writeBridgeFiles(files, tmp, false);

    expect(skipped).toContain("CLAUDE.md");
    expect(written).not.toContain("CLAUDE.md");
    fs.rmSync(tmp, { recursive: true });
  });
});

describe("generateBridgeFilesForIds — filtering", () => {
  it("returns empty array for 'none'", async () => {
    const tmp = makeTempDir();
    const files = await generateBridgeFilesForIds(["none"], tmp);
    expect(files).toHaveLength(0);
    fs.rmSync(tmp, { recursive: true });
  });

  it("returns empty array for empty list", async () => {
    const tmp = makeTempDir();
    const files = await generateBridgeFilesForIds([], tmp);
    expect(files).toHaveLength(0);
    fs.rmSync(tmp, { recursive: true });
  });

  it("returns only requested bridge types", async () => {
    const tmp = makeTempDir();
    const files = await generateBridgeFilesForIds(["claude", "gemini"], tmp);
    const filePaths = files.map((f) => f.filePath);
    expect(filePaths).toContain("CLAUDE.md");
    expect(filePaths).toContain("GEMINI.md");
    expect(filePaths).not.toContain(".vscode/settings.json");
    expect(filePaths).not.toContain("AGENTS.md");
    fs.rmSync(tmp, { recursive: true });
  });

  it("returns all bridge types for 'all'", async () => {
    const tmp = makeTempDir();
    const files = await generateBridgeFilesForIds(["all"], tmp);
    expect(files.length).toBeGreaterThan(3);
    fs.rmSync(tmp, { recursive: true });
  });
});
