---
name: create-profile
description: Creates or updates a personal developer profile at ~/.claude/PROFILE.md. Run this once to tell Claude about your role, experience, and preferences so that explanations and other skills can tailor their output to you.
allowed-tools: Read(~/.claude/PROFILE.md), Write(~/.claude/PROFILE.md), AskUserQuestion
compatibility: Designed for Claude Code (or similar products)
metadata:
  author: rolemodel
  version: "1.0"
license: MIT
---

# Create Developer Profile

This skill interviews the user and writes `~/.claude/PROFILE.md`. Other skills read this file to tailor their output without re-asking these questions.

If `~/.claude/PROFILE.md` already exists, read it first so you can show current values and let the user update rather than start fresh.

---

## Interview

Ask these questions **one at a time** using `AskUserQuestion`, waiting for each answer before continuing. Tailor follow-up questions based on what you learn — the goal is a profile that feels like it was written by the person, not a form they filled out.

### 1. Role

**Header:** "What's your role?"

Options (allow free-form "Other"):
- Full-stack — works across frontend and backend
- Designer — UX, component design, design systems
- Non Technical — PM, product, ops, etc

### 2. Primary Stack

**Header:** "What frameworks and languages are you most familiar with? And how long have you been using them?"

DO NOT USE `AskUserQuestion` options for this — let them answer in their own words.

### 3. Domain Experience

**Header:** "Which of these domains are you most familiar with?"


DO NOT USE `AskUserQuestion` options for this — let them answer in their own words.

### 4. Tools

**Header:** "What tools and editors do you use day-to-day?"

DO NOT USE `AskUserQuestion` options for this — let them answer in their own words. (e.g. VS Code, Neovim, GitHub, Linear, Figma, etc.)

### 5. Working style

**Header:** "How do you prefer explanations?"

Options (allow free-form, allow multi-select):
- Start with the big picture, then drill down
- Jump straight to the code — I'll figure out the context
- Use analogies and plain language — avoid jargon when possible
- Be thorough — I'd rather have too much than miss something
- Be concise — skip the preamble, get to the point
- Other (please specify)

### 6. Open-ended preferences (plain text, not AskUserQuestion)

Ask as plain text: "Anything else you'd like me to know? For example: areas you're focused on, things you find confusing, topics you want me to go deeper on, or anything I should avoid."

Wait for the response. If the user says "no" or "nothing", that's fine — skip it in the profile.

---

## Writing the Profile

After collecting answers, write `~/.claude/PROFILE.md` with this structure (adapt the content to what the user actually said — do not copy options verbatim if their free-form answer is more expressive):

```markdown
# Developer Profile

## Role
<their role, in their words or the selected option>

## Primary Stack
<their experience level and any context they gave>

## Domain Experience
<domains they selected or described, as a short prose sentence or bullet list>

## Tools
<their day-to-day tools, as they described them>

## Working Style
<their stated preferences — rewrite as natural prose if they gave multiple options>

## Additional Preferences
<their open-ended answer, or omit this section entirely if they had nothing to add>
```

After writing the file, confirm to the user: "Your profile has been saved. Skills like `/explain` will now use it to tailor output to you. You can run `/create-profile` again any time to update it."
