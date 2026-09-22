# Contributing to `cntxt-library`

Thank you for contributing to `cntxt-library`! This repository is the open community prompt, skill, and template library for **CNTXT (ContextPad)** — an AI-augmented, local-first workspace application.

---

## Architectural Context: How CNTXT Uses This Repo

1. **Zero-Backend Architecture**: CNTXT has no central server or database. It communicates directly with GitHub's raw CDN (`https://raw.githubusercontent.com/<owner>/cntxt-library/main/`).
2. **Catalog-Driven Discovery**: CNTXT fetches `index.json` at the repo root first. All client-side searching, filtering, and tag exploration happen against `index.json`.
3. **On-Demand Fetching**: When a user selects an item in the CNTXT catalog, the application downloads the specific file referenced by `entry.path`.
4. **Local Runtime Execution**: Downloaded prompts, skills, and templates are saved locally on the user's device for immediate use in their local documents.

---

## File Format Support

Contributions can be authored in any of the following formats:

| Format | Extension | Typical Use Cases |
| :--- | :--- | :--- |
| **Markdown** | `.md` | Conversational prompts, reasoning chains, doc templates, roleplay personas |
| **CNTXT Doc** | `.cntxt` | Interactive pseudo-apps, multi-block documents, executable live templates |
| **JSON** | `.json` | Structured schemas, API payload templates, machine-readable tool specs |
| **YAML** | `.yaml` / `.yml` | Procedural multi-step skills, agent directives, workflow orchestrations |
| **CSV** | `.csv` | Tabular datasets, reference sheets, lookup tables, benchmark tests |
| **Plain Text** | `.txt` | Raw system instructions, clipboard snippets, minimal unformatted prompts |

---

## Frontmatter & Schema Guidelines

### 1. Markdown (`.md`), CNTXT (`.cntxt`), and Text (`.txt`) Frontmatter

Every text-based document MUST begin with standard YAML frontmatter enclosed in triple dashes (`---`):

```yaml
---
id: code-reviewer
name: Code Reviewer & Security Auditor
description: Perform comprehensive static analysis, security checks, and code quality reviews.
type: prompt
tags: [coding, security, review, refactoring]
author: octocat
version: 1.0.0
verified: false
---

[Your prompt, template, or document content starts here...]
```

### 2. `index.json` Entry Schema

Whenever a new file is added, an entry MUST be added to `index.json` at the repository root:

```json
{
  "id": "code-reviewer",
  "name": "Code Reviewer & Security Auditor",
  "description": "Perform comprehensive static analysis, security checks, and code quality reviews.",
  "type": "prompt",
  "tags": ["coding", "security", "review", "refactoring"],
  "format": "md",
  "path": "prompts/coding/code-reviewer.md",
  "author": "octocat",
  "version": "1.0.0",
  "verified": false
}
```

### Field Definitions

- **`id`** (`string`): Unique kebab-case slug matching `^[a-z0-9]+(-[a-z0-9]+)*$`. Must be globally unique across all entries.
- **`name`** (`string`): Concise, human-readable display title.
- **`description`** (`string`): One crisp sentence (under 160 characters recommended) explaining what this resource does.
- **`type`** (`string`): One of `prompt`, `skill`, `template`, `dataset`, `pseudo-app`.
- **`tags`** (`array<string>`): Lowercase tags for flexible search and discovery (e.g. `["coding", "python", "testing"]`).
- **`format`** (`string`): File format identifier: `md`, `cntxt`, `json`, `yaml`, `csv`, or `txt`.
- **`path`** (`string`): Relative file path from the repository root using forward slashes (e.g. `prompts/coding/code-reviewer.md`).
- **`author`** (`string`): GitHub username of the author or adapter.
- **`version`** (`string`): Semantic version (e.g. `1.0.0`).
- **`verified`** (`boolean`): Always `false` on initial PR submission. Maintained and verified by community reviewers upon testing.

---

## Folder Organization Philosophy

We follow a **flat-first, tag-based** approach:
- Top-level folders are categorized by primary function:
  - `prompts/` (subdivided into broad human categories: `writing/`, `coding/`, `research/`, `analysis/`, `productivity/`, `roleplay/`, `summarization/`)
  - `skills/` (procedural directives and tool workflows)
  - `templates/` (document scaffolds and project structures)
  - `datasets/` (tabular files and reference collections)
  - `pseudo-apps/` (interactive `.cntxt` notebooks and mini-apps)
- Do **not** create deep nested directory hierarchies (e.g. `prompts/coding/backend/python/django/v4/`). Tagging handles granular classification without fragmenting paths.

---

## Step-by-Step Contribution Workflow

1. **Fork & Branch**:
   ```bash
   git checkout -b feat/add-my-prompt
   ```
2. **Author Your Resource**:
   - Place the file in the designated folder.
   - Include valid YAML frontmatter (for `.md`, `.cntxt`, `.txt`) or metadata attributes (for `.json`/`.yaml`).
3. **Register in `index.json`**:
   - Add your entry object to the `index.json` array.
   - Keep keys alphabetically sorted or append cleanly.
4. **Validate Locally**:
   Run the repository validation script to ensure frontmatter and `index.json` are 100% aligned:
   ```bash
   npm run validate
   # or directly with Node:
   node scripts/validate-index.js
   ```
5. **Commit & Submit PR**:
   - Write a clear commit message: `feat(prompts): add code-reviewer prompt`.
   - Open a pull request against the `main` branch.
   - Fill out the PR template checklist.

---

## Licensing & Attribution

- All original contributions to `cntxt-library` are licensed under the **MIT License**.
- When adapting prompts from open-source collections (e.g., Fabric, awesome-chatgpt-prompts, LangChain Hub), provide appropriate attribution in the frontmatter or header and ensure compliance with their source licenses.
- Never submit confidential, proprietary, or infringing material.
