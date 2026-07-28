# Inspiration Library

Open `index.html` in a browser. No build, no server, no dependencies.

## Adding a reference with an agent (the usual way)

Open Claude Code in this folder, give it the screenshot, and say **"add this to the library."**
The `add-to-library` skill (`.claude/skills/add-to-library/SKILL.md`) tells it how to pick the
group, write the keywords, image prompt and build brief, drop the file in `images/`, and
validate with `node check.mjs`. Codex and other agents pick it up via `AGENTS.md`.

## Adding a screenshot

Click **Link images/ folder** once and pick this repo's `images/` folder. After that,
dragging an image onto a card writes a real file to `images/<id>.<ext>` — committable,
no `library.js` edit needed, the app finds it by id. **Remove** deletes the file too.

Without the link the upload still works, but the image only lives in this browser's
IndexedDB. **Save to disk** exports it so you can drop it into `images/` by hand.

The folder link is remembered, though the browser re-asks for write permission on the
first upload of each session.

## Recording where a design came from

Open a card and hit **Add source** to store the URL. It shows under the title as a link.
Agents set it via the `source` field in `library.js`; both work, and the in-app value wins.

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
