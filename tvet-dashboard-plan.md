# MY TVET Dashboard — Plan

## Top-Level Overview

Build a single HTML page titled **MY TVET Dashboard** that gives a facilitator an at-a-glance view of their student workshop. The page includes:

- A page header with the title "MY TVET Dashboard"
- Three summary cards: **Students Registered**, **Tasks Remaining**, and **Workshop Status**
- One **Preparation Checklist** with sample items

All data is hardcoded as sample data (no backend, no API). The output is a single self-contained `index.html` file using plain HTML, CSS, and minimal vanilla JavaScript (for checklist interactivity only).

**Non-goals:**
- No backend or data persistence
- No frameworks (React, Vue, etc.) unless already present in the workspace
- No charts or graphs beyond what is described

---

## Sub-Tasks

---

### Sub-Task 1 — Page Shell & Header

**Intent**
Create the base HTML document with a styled header showing the dashboard title.

**Expected Outcomes**
- A valid HTML5 file exists at `index.html`
- The page renders a top header bar with the text "MY TVET Dashboard"
- Global CSS variables and reset styles are in place for consistent spacing and color

**Todo List**
1. Create `index.html` with standard HTML5 boilerplate
2. Add a `<header>` element with the title "MY TVET Dashboard"
3. Define CSS custom properties for colors, spacing, and font-family
4. Apply a clean, neutral background to the page body

**Relevant Context**
- No existing files to reuse — this is a greenfield page
- Use a sans-serif system font stack for readability

**Status:** [x] done

---

### Sub-Task 2 — Three Summary Cards

**Intent**
Render three visually distinct summary cards in a responsive row.

**Cards and Sample Data:**

| Card | Label | Sample Value | Supporting Detail |
|---|---|---|---|
| 1 | Students Registered | 30 | 24 confirmed, 6 pending |
| 2 | Tasks Remaining | 5 | Out of 12 total tasks |
| 3 | Workshop Status | In Progress | Module 2 of 4 |

**Expected Outcomes**
- Three cards displayed in a horizontal row (wraps on small screens)
- Each card shows an icon or emoji, a bold numeric/status value, a label, and a sub-detail line
- Cards are visually differentiated (accent color per card or a subtle border)

**Todo List**
1. Add a `<section class="cards">` container inside `<main>`
2. Create a reusable card HTML structure with slots for icon, value, label, and detail
3. Populate the three cards with the sample data from the table above
4. Style the card grid using CSS Flexbox or Grid with a responsive wrap
5. Apply distinct accent colors or left-border highlights to each card

**Relevant Context**
- Keep cards purely presentational — no JavaScript needed here

**Status:** [x] done

---

### Sub-Task 3 — Preparation Checklist

**Intent**
Render an interactive pre-workshop checklist below the summary cards. Users can tick items off; ticked items get a visual strikethrough.

**Sample Checklist Items:**
1. Confirm room booking and share meeting link with students
2. Upload slide deck and demo materials to shared folder
3. Distribute starter lab files to all participants
4. Prepare attendance sheet / registration form
5. Open communication channel (Teams / Slack) and invite students
6. Brief backup facilitator or TA
7. Create and share post-workshop feedback form

**Expected Outcomes**
- A titled checklist section appears below the cards
- Each item renders as a checkbox + label pair
- Checking a box applies a strikethrough style to the label
- Two items are pre-checked as sample "already done" state (items 1 and 4)

**Todo List**
1. Add a `<section class="checklist">` below the cards section
2. Add a section heading "Preparation Checklist"
3. Render each item as `<input type="checkbox">` + `<label>` inside a `<ul>`
4. Pre-check items 1 and 4 via the `checked` attribute
5. Add a small CSS rule + one JS event listener that toggles a `completed` class on the label when checked
6. Style completed labels with `text-decoration: line-through` and reduced opacity

**Relevant Context**
- Keep JavaScript minimal — a single delegated event listener on the `<ul>` is sufficient

**Status:** [x] done

---

### Sub-Task 4 — Polish & Responsive Layout

**Intent**
Ensure the full page looks cohesive, is readable on both desktop and mobile, and has a footer.

**Expected Outcomes**
- The layout does not break on screens narrower than 480px
- A simple footer shows "MY TVET Dashboard © 2025"
- Consistent padding, font sizes, and color contrast throughout
- No horizontal scroll on any viewport

**Todo List**
1. Add a `<footer>` element with the copyright line
2. Add a `@media` breakpoint so cards stack vertically on small screens
3. Do a visual pass — verify padding, font scale, and color contrast are consistent
4. Confirm the file is fully self-contained (no external CSS or JS dependencies)

**Relevant Context**
- All styles live in a single `<style>` block in `<head>` — no separate stylesheet needed

**Status:** [x] done

---

## File Deliverable

| File | Description |
|---|---|
| `index.html` | Single self-contained dashboard page |

