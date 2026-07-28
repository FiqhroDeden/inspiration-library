// node check.mjs — validates library.js after you hand-edit it.
import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';

const src = readFileSync(new URL('./library.js', import.meta.url), 'utf8');
const { GROUPS, ENTRIES, PARTS } = new Function(`${src}; return { GROUPS, ENTRIES, PARTS }`)();
const ids = new Set(GROUPS.map(g => g.id));
const parts = new Set(PARTS);
const seen = new Set();

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
  if (e.source) assert(/^https?:\/\/\S+$/.test(e.source), `${e.id}: source must be an http(s) URL`);
}
console.log(`ok — ${GROUPS.length} groups, ${ENTRIES.length} entries`);
