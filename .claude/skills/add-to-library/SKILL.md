---
name: add-to-library
description: Use when the user shares a website screenshot, design reference, or a URL and wants it catalogued, analysed, or added to the inspiration library — including "add this to the library", "what style is this", "analyse this design", or dropping an image into this repo with no other instruction.
---

# Add to Library

Turn one design screenshot into one `ENTRIES` object in `library.js`.

Look at the screenshot before writing anything. Every field must be traceable to
something visible in it. If you can't point at the pixels that justify a keyword,
it doesn't go in.

## First: get the source URL

However the image arrived — pasted into chat, grabbed off the clipboard, or already a
file on disk — **you need the source URL before you write anything to `library.js`.**

1. URL given in the message → use it verbatim.
2. Address bar visible in the screenshot **and every character legible** → read it off.
3. Otherwise → **ask the user for the link, and wait for the answer.**

Ask before you edit the file, not after. Adding the entry and then asking is the wrong
order — that is the habit this step exists to prevent.

Never invent a URL. Do not reconstruct one from a brand name, a logo, or a wordmark;
`Havena` does not license you to write `havena.com`. If you can see an address bar but
cannot resolve every character, you do not have the URL — ask.

**If the user says there is no source** — their own work, a concept piece, an image with
no page behind it — omit `source` and add the entry. That is a complete answer. Take it
and carry on; do not ask again or hold the entry back.

## The contract

Append to the `ENTRIES` array in `library.js`, grouped with its style neighbours:

```js
{
  id: 'kebab-slug',              // unique across ENTRIES
  group: 'existing-group-id',    // must be a GROUPS id — see "New group" below
  image: 'images/kebab-slug.png',// omit if the file isn't on disk
  source: 'https://…',           // required unless the user said there is none
  parts: ['hero'],               // what the screenshot covers — see below
  title: 'Short Name',
  formula: 'subject × treatment',// see below — the order is fixed
  blurb: 'One sentence naming the move that makes it work.',
  keywords: [/* 4–6 */],
  imagePrompt: '[SUBJECT: …] …',
  brief: 'One paragraph …',
}
```

### formula — always `subject × treatment`, in that order

Left of the `×` is what the page is **about** — its domain, product, or pictured
subject. Right of the `×` is **how it looks** — the visual technique, medium, or
render. Lowercase except for proper nouns and terms of art (`Atkinson dither`,
`1-bit`, `voxel 3D`). Exactly one `×`, spaces on both sides.

| ✅ | ❌ |
|---|---|
| `meditation × voxel 3D` | `voxel 3D × meditation` |
| `finance × topographic line` | `topography × finance` |
| `archive portrait × datamosh` | `datamosh × archive portrait` |
| `hospitality × sticker collage` | `sticker collage × hospitality` |

If both halves sound like techniques, you have not identified the subject yet.
Ask what the page is selling — that is the left half.

### parts — what the screenshot actually covers

Required, at least one, drawn only from the `PARTS` list at the top of `library.js`:

`full page` · `navbar` · `hero` · `features` · `gallery` · `testimonials` ·
`pricing` · `cta` · `contact` · `footer` · `auth` · `dashboard`

List every section genuinely visible in the image, not the whole site it came from.
A hero crop that includes the nav bar is `['navbar', 'hero']`. A full-page capture is
`['full page']` on its own — don't also enumerate its sections. If the design needs a
term that isn't on the list, add it to `PARTS` first; `check.mjs` rejects anything else.

This is the second filter axis, independent of `group`: style is *how it looks*,
parts is *which piece of a site it is*.

### keywords — 4 to 6 concrete visual traits

Noun phrases for things a person can see and a designer can reproduce.

- ✅ `halftone CMYK dot texture`, `pale sage ground`, `mono coordinate labels`, `lifted matte blacks`
- ❌ `modern`, `clean`, `professional`, `good hierarchy`, `user-friendly`

Cover at least: the imagery treatment, the ground colour, the type move, and the layout move.

### imagePrompt — for an image model, not a browser

Opens with `[SUBJECT: a concrete thing]` so the user can swap the subject and reuse
the style. After the bracket, describe only what a renderer needs: medium and
technique, palette (name the colours), lighting, composition and crop, and the
negative constraints that keep it on-style (`no gradients`, `no colour beyond…`,
`no perspective`). One flowing sentence, comma-separated.

Never mention buttons, navigation, headlines, or anything else that lives in the DOM.

### brief — for a coding agent, not a person

One paragraph, second person imperative, specific enough to build from cold:

- ground colour **as a hex value**, ink colour, and the single accent plus what it's allowed to touch
- the type pairing, with actual sizes and the roles they play
- the layout structure (grid, columns, what bleeds, what's sticky)
- one distinctive component or motion detail
- the prohibitions that hold the style together — `no shadows`, `no radius above 2px`, `no colour outside the palette`

Judge it by one question: could an agent build a convincing page from this alone?

## New group

Only if the screenshot genuinely doesn't fit an existing group — check all of them
first. Then add to `GROUPS`:

`id`, `name`, `tagline` (lowercase fragment), `what` (2 sentences describing the
visual system), `means` (2–3 sentences on what it signals and when to reach for it),
and `vocabulary`: 6–8 `[term, definition]` pairs of the real names for the techniques —
`error diffusion`, `contrapposto`, `aerial perspective`. The definition is one clause,
plain language. This glossary is the point of the app; don't pad it with generic
design words.

### source

The URL the design lives at — the field the user most cares about not losing.
Resolved before you start writing; see **First: get the source URL** above.

## The screenshot file

If the image exists on disk, copy it to `images/<id>.<ext>` and set `image`.

If it was pasted into chat with no path — a macOS screenshot goes to the clipboard,
and pasting does not clear it — grab it from the clipboard:

```bash
./clip.sh <id>
```

**Then read the saved file back and look at it.** The clipboard holds whatever was
copied *last*, which is not always the image in the conversation. If it isn't the
design you are cataloguing, delete it and ask the user to re-copy — never file an
image you have not looked at.

If the clipboard has moved on and the user can't re-copy, leave `image` out and tell
them to drag the file onto the card in the app instead.

## Verify

```bash
node check.mjs
```

Must print `ok — N groups, M entries`. Fix anything it reports before you're done.
Then tell the user the title, the group, and the one keyword that decided the group.

If the entry went in without a `source` because the user said there wasn't one, say so
in that sentence, so it reads as a decision rather than an oversight.

## Worked example

Screenshot: a meditation site, blocky 3D mountain landscape, serif headline, white ground.

```js
{
  id: 'stillness',
  group: 'voxel-dimensional',
  parts: ['navbar', 'hero'],
  title: 'Stillness',
  formula: 'meditation × voxel 3D',
  blurb: 'The meditation landscape is built from blocks — digital material, calm subject.',
  keywords: ['voxel-rendered landscape', 'pixel mountains and river', 'serif headline with green emphasis', 'clean white ground', 'muted blue-coral-green palette', 'soft product buttons'],
  imagePrompt: '[SUBJECT: a serene mountain landscape with a river and pine trees] built entirely from small 3D voxels, Minecraft-diorama style at high fidelity, STRICT muted palette of slate-blue and dusty navy with white snow, coral-salmon accent patches, and sage-green foliage — no saturated greens, no browns, soft even studio light with gentle ambient occlusion in the crevices, isolated diorama on a clean white ground with generous empty space above for typography',
  brief: 'Build a landing page for an AI-guided meditation product. Ground is clean white with a very slight warm tint (#FDFDFB). Headline is a transitional serif at 52px, black, with one clause set in the sage green to carry the emphasis. Subhead is two lines of 15px grey sans. Two buttons: primary is a deep olive-green pill with a trailing chevron, secondary is a plain outlined pill — both small, never full-width. The voxel diorama sits below the type as a full-width band with empty white above it and no border or shadow. Palette is white, near-black, olive-green, and the three diorama colours pulled directly from the image. Keep the whole page airy: minimum 120px of vertical padding per section.',
}
```

Note what the keywords do: name the render technique, the type move, the ground, and
the palette — not the mood. The `imagePrompt` says nothing about buttons; the `brief`
says nothing about voxel rendering technique. They are two different jobs.
