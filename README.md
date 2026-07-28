# Inspiration Library

Open `index.html` in a browser. No build, no server, no dependencies.

## Adding a reference with an agent (the usual way)

Open Claude Code in this folder, give it the screenshot, and say **"add this to the library."**
The `add-to-library` skill (`.claude/skills/add-to-library/SKILL.md`) tells it how to pick the
group, write the keywords, image prompt and build brief, drop the file in `images/`, and
validate with `node check.mjs`. Codex and other agents pick it up via `AGENTS.md`.

## Adding a screenshot

Drag an image file onto any card, or open a card and hit **Upload screenshot**.
It's stored in the browser (IndexedDB), survives reloads, and overrides the entry's
`image` field. **Remove** clears it.

That storage is per-browser-profile and not in git. To make a screenshot permanent,
hit **Save to disk**, move the file into `images/`, and set `image:` on the entry.

## Adding a reference

1. Drop the screenshot in `images/` (or upload it in-app, above).
2. Add an entry to `ENTRIES` in `library.js`:

```js
{
  id: 'unique-slug',
  group: 'print-tech-paper',        // must match a GROUPS id
  image: 'images/your-shot.png',    // optional — omit for a placeholder
  title: 'Name',
  formula: 'thing × thing',
  blurb: 'One sentence on what makes it work.',
  keywords: ['at least', 'three', 'concrete visual traits'],
  imagePrompt: '[SUBJECT: …] then the style instructions',
  brief: 'Paragraph you paste into a coding agent to build the whole site.',
}
```

3. Validate:

```bash
node check.mjs
```

## Adding a style group

Add to `GROUPS` in `library.js` — needs `id`, `name`, `tagline`, `what`, `means`, and a
`vocabulary` array of `[term, definition]` pairs. The filter chip and the dossier panel
build themselves from it.

## Keys

`←` `→` browse inside the modal · `esc` closes · the URL hash is the active filter,
so `#dither-mono` is a shareable link.
