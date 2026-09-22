## Description
<!-- Provide a concise description of the prompt, skill, template, dataset, or pseudo-app added or updated. -->

## Type of Contribution
- [ ] New Prompt (`prompts/`)
- [ ] New Skill (`skills/`)
- [ ] New Template (`templates/`)
- [ ] New Dataset (`datasets/`)
- [ ] New Pseudo-App (`pseudo-apps/`)
- [ ] Metadata / Index Fix
- [ ] Script / Tooling Improvement

## Contributor Checklist
Please verify each of the following points before submitting your pull request:

- [ ] **File Format**: The file uses a supported extension (`.md`, `.cntxt`, `.json`, `.yaml`/`.yml`, `.csv`, `.txt`).
- [ ] **Frontmatter / Metadata**: Markdown (`.md`), pseudo-apps (`.cntxt`), and text (`.txt`) files include valid YAML frontmatter matching the schema:
  - `id`: kebab-case unique identifier
  - `name`: descriptive title
  - `description`: one-sentence explanation
  - `type`: `prompt` | `skill` | `template` | `dataset` | `pseudo-app`
  - `tags`: array of relevant lowercase tags
  - `author`: GitHub username
  - `version`: semantic version (e.g., `1.0.0`)
  - `verified`: `false` (will be reviewed by maintainers)
- [ ] **Catalog Registration**: An entry has been added to `index.json` at the repo root with exact matching values for `id`, `name`, `description`, `type`, `tags`, `format`, `path`, `author`, `version`, and `verified`.
- [ ] **Original Adaptation**: Content is original or properly adapted/attributed under open-source licenses; no verbatim copyrighted material.
- [ ] **Validation Pass**: Executed `npm run validate` (or `node scripts/validate-index.js`) locally and all checks passed with 0 errors.
- [ ] **Clean Git Diff**: No binary files, build artifacts, or extraneous OS files committed.
