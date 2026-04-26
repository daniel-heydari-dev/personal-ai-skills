# .raw — drop zone

This is your AI's ingestion folder. Drop **source files** here and Claude will organize them into `wiki/sources/` and link them from the right project folder.

## Structure

```text
.raw/
└── projects/
    ├── <project-slug>/        ← per-project source files
    │   └── README.md          ← what to drop in this project's folder
    └── shared/                ← cross-project source materials
```

## What goes here

- PDFs (papers, RFCs, vendor docs, security cheat sheets)
- Screenshots (design reviews, audit findings, conversation snippets)
- Videos / transcripts (architecture meetings, user-research interviews)
- Exported chats with subject-matter experts

## What does NOT go here

- Secrets / credentials — this folder is local but treat it as private
- Auto-generated artifacts (build outputs, test reports) — those belong elsewhere
- Files you want versioned with code — those go in the project repo, not the brain

## How to use

1. Drop a file in `.raw/projects/<slug>/`
2. Tell Claude "ingest this" or wait for the next session — claude-mem can summarise it
3. The summary lands in `wiki/sources/<topic>.md`
4. The source file stays here unchanged for re-reading or audit
