# cntxt-library

> **The open community prompt, skill, and template library for [CNTXT (ContextPad)](https://github.com/cntxt-app/cntxt).**

`cntxt-library` is a community-driven repository of curated prompts, procedural skills, document templates, tabular datasets, and interactive pseudo-apps designed to run locally within the CNTXT workspace.

---

## ⚡ How It Works (Zero-Backend CDN Delivery)

CNTXT is an AI-augmented, local-first workspace app that prioritizes user privacy, speed, and decentralization:

```
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Raw CDN                         │
│   https://raw.githubusercontent.com/<owner>/cntxt-library/  │
└──────────────────────────────┬──────────────────────────────┘
                               │
               1. Fetch Catalog (index.json)
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       CNTXT Desktop                         │
│  - Instant search & tag-based catalog filtering             │
│  - Zero telemetry, zero server database                     │
└──────────────────────────────┬──────────────────────────────┘
                               │
               2. Download Selected Resource
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    User Local Storage                       │
│  - Prompts saved to local document store                    │
│  - Executed locally with your configured AI providers       │
└─────────────────────────────────────────────────────────────┘
```

1. **Catalog Manifest**: When browsing the library, CNTXT requests `index.json` from the repository root via GitHub's raw CDN.
2. **Local Indexing & Search**: Search queries, tag filtering, and format filtering execute entirely in-memory on the client machine.
3. **On-Demand Retrieval**: Only when you choose to inspect or import a prompt, skill, or template does CNTXT fetch the individual asset from its relative `path`.
4. **Local Runtime Execution**: Assets are injected directly into your active workspace or saved to your personal library.

---

## 📂 Repository Layout

We employ a **flat-first, tag-based** structure designed to scale effortlessly to hundreds of resources without brittle hierarchy reorganizations:

```
cntxt-library/
├── README.md               # Overview, architecture, and quickstart
├── CONTRIBUTING.md         # Guide for community contributors
├── LICENSE                 # MIT License
├── index.json              # Primary catalog manifest parsed by CNTXT
├── package.json            # Node.js project definition & scripts
├── prompts/                # AI system & user prompt templates
│   ├── writing/            # Editing, copywriting, storytelling, technical documentation
│   ├── coding/             # Code reviews, refactoring, testing, SQL optimization, architecture
│   ├── research/           # Literature synthesis, competitive analysis, first-principles inquiry
│   ├── analysis/           # Root cause analysis, anomaly diagnosis, decision matrices
│   ├── productivity/       # Prioritization, standups, retrospectives, action extraction
│   ├── summarization/      # Executive briefs, insight extraction, TL;DR condensing
│   └── roleplay/           # Socratic tutors, devil's advocates, persona simulations
├── skills/                 # Multi-step procedural directives (.yaml, .json, .md)
├── templates/              # Document scaffolds (incident postmortems, specs, briefs)
├── datasets/               # Tabular references and benchmark lookup tables (.csv)
├── pseudo-apps/            # Interactive CNTXT pseudo-app documents (.cntxt)
├── scripts/
│   └── validate-index.js   # Automated schema, integrity, and frontmatter validation
└── .github/
    └── PULL_REQUEST_TEMPLATE.md
```

---

## 📄 Supported File Formats

`cntxt-library` supports multiple document and data formats:

- **`.md`** — Markdown prompts, templates, reasoning instructions, and persona definitions.
- **`.cntxt`** — CNTXT interactive pseudo-apps and live reactive documents.
- **`.json`** — Structured schemas, API payload templates, and machine-readable definitions.
- **`.yaml` / `.yml`** — Procedural multi-step skill routines and workflow orchestration rules.
- **`.csv`** — Reference datasets, lookup tables, and test matrices.
- **`.txt`** — Plain text prompts and unformatted raw instructions.

---

## 🔍 `index.json` Catalog Schema

Every resource in the repository is cataloged in `index.json` using the following schema:

```json
{
  "id": "code-reviewer",
  "name": "Code Reviewer & Security Auditor",
  "description": "Perform comprehensive static analysis, security checks, and code quality reviews.",
  "type": "prompt",
  "tags": ["coding", "security", "review", "refactoring"],
  "format": "md",
  "path": "prompts/coding/code-reviewer.md",
  "author": "community",
  "version": "1.0.0",
  "verified": false
}
```

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique kebab-case slug (`^[a-z0-9]+(-[a-z0-9]+)*$`) |
| `name` | `string` | Human-readable title displayed in CNTXT |
| `description` | `string` | Single-sentence synopsis |
| `type` | `string` | `prompt` \| `skill` \| `template` \| `dataset` \| `pseudo-app` |
| `tags` | `string[]` | Discovery and classification tags |
| `format` | `string` | `md` \| `cntxt` \| `json` \| `yaml` \| `csv` \| `txt` |
| `path` | `string` | Relative path from repo root (forward slashes) |
| `author` | `string` | GitHub username or contributor tag |
| `version` | `string` | Semantic version string |
| `verified` | `boolean` | Verification badge flag |

---

## 🧪 Validating the Catalog

We provide an automated Node.js validation script to ensure that `index.json` stays strictly in sync with the files in the repository:

```bash
# Run catalog validation
npm run validate

# Or directly:
node scripts/validate-index.js
```

The validator checks:
1. Valid JSON syntax in `index.json`.
2. Required fields, regex patterns, and type invariants on every record.
3. Global uniqueness of all IDs.
4. Physical existence of each target file on disk.
5. Matching format extension between `format` and `path`.
6. Frontmatter parsing for `.md`, `.cntxt`, and `.txt` files to guarantee parity with `index.json`.

---

## 🤝 Contributing

Contributions from the community are warmly welcome! Whether you are porting a favorite prompt from Fabric or LangChain Hub, authoring a new CNTXT pseudo-app, or adding a dataset, please check our [CONTRIBUTING.md](CONTRIBUTING.md) guide before opening a PR.

---

## 📜 License

This repository is distributed under the [MIT License](LICENSE).
