// node check.mjs — validates library.js after you hand-edit it.
import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';

const src = readFileSync(new URL('./library.js', import.meta.url), 'utf8');
const { GROUPS, ENTRIES, PARTS } = new Function(`${src}; return { GROUPS, ENTRIES, PARTS }`)();
const ids = new Set(GROUPS.map(g => g.id));
const parts = new Set(PARTS);
const seen = new Set();
const scopes = new Map();   // source + parts -> id, to catch re-cataloguing the same shot
const bySource = new Map();

for (const g of GROUPS) {
  for (const f of ['id', 'name', 'tagline', 'what', 'means']) assert(g[f], `group ${g.id}: missing ${f}`);
  assert(g.vocabulary?.length, `group ${g.id}: empty vocabulary`);
}
for (const e of ENTRIES) {
  for (const f of ['id', 'group', 'title', 'formula', 'blurb', 'imagePrompt', 'brief']) assert(e[f], `${e.id}: missing ${f}`);
  assert(!seen.has(e.id), `duplicate id ${e.id}`); seen.add(e.id);
  assert(ids.has(e.group), `${e.id}: unknown group "${e.group}"`);
  assert(e.parts?.length, `${e.id}: needs at least one part`);
  e.parts.forEach(p => assert(parts.has(p), `${e.id}: unknown part "${p}" — add it to PARTS first`));
  assert(/^[^×]+ × [^×]+$/.test(e.formula), `${e.id}: formula must be "subject × treatment" (one ×, spaces both sides)`);
  assert(e.keywords?.length >= 3, `${e.id}: needs 3+ keywords`);
  assert(e.imagePrompt.includes('[SUBJECT'), `${e.id}: imagePrompt has no [SUBJECT: …] slot`);
  if (e.image) assert(existsSync(new URL('./' + e.image, import.meta.url)), `${e.id}: missing file ${e.image}`);
  if (e.source) {
    assert(/^https?:\/\/\S+$/.test(e.source), `${e.id}: source must be an http(s) URL`);
    // one source may back several entries at different scopes (hero vs full page),
    // but the same source at the same scope is the same reference added twice
    const scope = `${e.source}|${[...e.parts].sort().join(',')}`;
    assert(!scopes.has(scope), `${e.id}: duplicate of "${scopes.get(scope)}" — same source, same parts`);
    scopes.set(scope, e.id);
    bySource.set(e.source, (bySource.get(e.source) || 0) + 1);
  }
}
console.log(`ok — ${GROUPS.length} groups, ${ENTRIES.length} entries`);
for (const [source, n] of bySource) if (n > 1) console.log(`  note: ${n} entries share ${source}`);
const missing = ENTRIES.filter(e => !e.source).map(e => e.id);
if (missing.length) console.log(`  note: no source on ${missing.join(', ')}`);
