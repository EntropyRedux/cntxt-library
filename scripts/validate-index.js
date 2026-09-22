#!/usr/bin/env node

/**
 * validate-index.js
 *
 * Validates the cntxt-library catalog manifest (`index.json`):
 * - Ensures index.json is valid and conforms strictly to the entry schema.
 * - Verifies unique kebab-case IDs.
 * - Confirms that every listed file exists on disk with matching format extension.
 * - Validates frontmatter in Markdown (.md), CNTXT (.cntxt), and text (.txt) files.
 * - Detects orphaned files in content directories that are missing from index.json.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const VALID_TYPES = new Set(['prompt', 'skill', 'template', 'dataset', 'pseudo-app']);
const VALID_FORMATS = new Set(['md', 'cntxt', 'json', 'yaml', 'csv', 'txt']);
const FORMAT_EXTENSION_MAP = {
  md: ['.md'],
  cntxt: ['.cntxt'],
  json: ['.json'],
  yaml: ['.yaml', '.yml'],
  csv: ['.csv'],
  txt: ['.txt']
};

const KEBAB_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SEMVER_REGEX = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/;

/**
 * Parses simple YAML frontmatter from string content.
 * Returns an object with key-value pairs or null if no frontmatter.
 */
function parseFrontmatter(rawContent) {
  const normalized = rawContent.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) {
    return null;
  }
  const endIndex = normalized.indexOf('\n---\n', 4);
  if (endIndex === -1) {
    return null;
  }

  const yamlBlock = normalized.substring(4, endIndex);
  const data = {};
  const lines = yamlBlock.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;

    const key = trimmed.slice(0, colonIndex).trim();
    let value = trimmed.slice(colonIndex + 1).trim();

    // Check for inline arrays [item1, item2]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
    } else {
      // Remove wrapping quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (value === 'true') value = true;
      if (value === 'false') value = false;
    }

    data[key] = value;
  }

  return data;
}

function runValidation() {
  console.log('🔍 Starting cntxt-library validation...\n');
  let errors = [];
  let warnings = [];

  const indexPath = path.join(REPO_ROOT, 'index.json');
  if (!fs.existsSync(indexPath)) {
    console.error('❌ FATAL: index.json not found at repository root.');
    process.exit(1);
  }

  let catalog;
  try {
    const content = fs.readFileSync(indexPath, 'utf-8');
    catalog = JSON.parse(content);
  } catch (err) {
    console.error(`❌ FATAL: Failed to parse index.json: ${err.message}`);
    process.exit(1);
  }

  if (!Array.isArray(catalog)) {
    console.error('❌ FATAL: index.json root must be a JSON array of catalog entries.');
    process.exit(1);
  }

  console.log(`📦 Found ${catalog.length} catalog entries in index.json.`);

  const seenIds = new Set();
  const seenPaths = new Set();

  catalog.forEach((entry, idx) => {
    const prefix = `Entry #${idx + 1} (${entry.id || 'unnamed'})`;

    // 1. Check ID
    if (!entry.id || typeof entry.id !== 'string') {
      errors.push(`${prefix}: Missing or invalid 'id' field.`);
    } else {
      if (!KEBAB_REGEX.test(entry.id)) {
        errors.push(`${prefix}: 'id' "${entry.id}" must be valid kebab-case.`);
      }
      if (seenIds.has(entry.id)) {
        errors.push(`${prefix}: Duplicate 'id' "${entry.id}". IDs must be globally unique.`);
      }
      seenIds.add(entry.id);
    }

    // 2. Check Name
    if (!entry.name || typeof entry.name !== 'string' || entry.name.trim() === '') {
      errors.push(`${prefix}: Missing or empty 'name'.`);
    }

    // 3. Check Description
    if (!entry.description || typeof entry.description !== 'string' || entry.description.trim() === '') {
      errors.push(`${prefix}: Missing or empty 'description'.`);
    }

    // 4. Check Type
    if (!entry.type || !VALID_TYPES.has(entry.type)) {
      errors.push(`${prefix}: Invalid 'type' "${entry.type}". Expected one of: ${[...VALID_TYPES].join(', ')}.`);
    }

    // 5. Check Tags
    if (!Array.isArray(entry.tags) || entry.tags.length === 0) {
      errors.push(`${prefix}: 'tags' must be a non-empty array of strings.`);
    } else {
      for (const tag of entry.tags) {
        if (typeof tag !== 'string' || tag.trim() === '') {
          errors.push(`${prefix}: Contains an empty or non-string tag.`);
        }
      }
    }

    // 6. Check Format
    if (!entry.format || !VALID_FORMATS.has(entry.format)) {
      errors.push(`${prefix}: Invalid 'format' "${entry.format}". Expected one of: ${[...VALID_FORMATS].join(', ')}.`);
    }

    // 7. Check Author
    if (!entry.author || typeof entry.author !== 'string') {
      errors.push(`${prefix}: Missing or invalid 'author'.`);
    }

    // 8. Check Version
    if (!entry.version || !SEMVER_REGEX.test(entry.version)) {
      errors.push(`${prefix}: 'version' "${entry.version}" must be valid semver (e.g. 1.0.0).`);
    }

    // 9. Check Verified
    if (typeof entry.verified !== 'boolean') {
      errors.push(`${prefix}: 'verified' must be a boolean (true or false).`);
    }

    // 10. Check Path and File Existence
    if (!entry.path || typeof entry.path !== 'string') {
      errors.push(`${prefix}: Missing or invalid 'path'.`);
    } else {
      if (entry.path.includes('\\')) {
        errors.push(`${prefix}: 'path' must use forward slashes ('/'), found backslashes.`);
      }

      if (seenPaths.has(entry.path)) {
        errors.push(`${prefix}: Duplicate 'path' "${entry.path}".`);
      }
      seenPaths.add(entry.path);

      const resolvedPath = path.resolve(REPO_ROOT, entry.path);
      if (!fs.existsSync(resolvedPath)) {
        errors.push(`${prefix}: File not found at path "${entry.path}".`);
      } else {
        // Check format extension match
        const ext = path.extname(resolvedPath).toLowerCase();
        const allowedExts = FORMAT_EXTENSION_MAP[entry.format] || [];
        if (!allowedExts.includes(ext)) {
          errors.push(`${prefix}: File extension "${ext}" does not match declared format "${entry.format}" (expected ${allowedExts.join(' or ')}).`);
        }

        // Check frontmatter for .md, .cntxt, and .txt files
        if (['md', 'cntxt', 'txt'].includes(entry.format)) {
          const raw = fs.readFileSync(resolvedPath, 'utf-8');
          const fm = parseFrontmatter(raw);
          if (entry.format === 'md' || entry.format === 'cntxt') {
            if (!fm) {
              errors.push(`${prefix}: File at "${entry.path}" is missing YAML frontmatter (delimited by '---').`);
            } else {
              if (fm.id && fm.id !== entry.id) {
                errors.push(`${prefix}: Frontmatter id "${fm.id}" does not match index.json id "${entry.id}".`);
              }
              if (fm.type && fm.type !== entry.type) {
                errors.push(`${prefix}: Frontmatter type "${fm.type}" does not match index.json type "${entry.type}".`);
              }
            }
          }
        }
      }
    }
  });

  // Check for unindexed orphan files in content folders
  const contentFolders = ['prompts', 'skills', 'templates', 'datasets', 'pseudo-apps'];
  function scanFolder(dirRel) {
    const fullDir = path.join(REPO_ROOT, dirRel);
    if (!fs.existsSync(fullDir)) return;
    const entries = fs.readdirSync(fullDir, { withFileTypes: true });
    for (const ent of entries) {
      const relPath = `${dirRel}/${ent.name}`.replace(/\\/g, '/');
      if (ent.isDirectory()) {
        scanFolder(relPath);
      } else {
        if (!seenPaths.has(relPath) && ent.name !== '.gitkeep' && !ent.name.startsWith('.')) {
          warnings.push(`Orphaned file detected (not in index.json): "${relPath}".`);
        }
      }
    }
  }

  for (const folder of contentFolders) {
    scanFolder(folder);
  }

  // Summary output
  console.log('----------------------------------------------------');
  if (warnings.length > 0) {
    console.log(`⚠️  ${warnings.length} Warning(s):`);
    warnings.forEach(w => console.log(`   - ${w}`));
    console.log('');
  }

  if (errors.length > 0) {
    console.error(`❌ Validation FAILED with ${errors.length} error(s):`);
    errors.forEach(e => console.error(`   - ${e}`));
    console.error('\nPlease resolve all errors before pushing to GitHub.');
    process.exit(1);
  } else {
    console.log(`✅ All ${catalog.length} entries in index.json successfully validated!`);
    console.log('✨ All files exist, formats match, and frontmatter schemas are verified.\n');
    process.exit(0);
  }
}

runValidation();
