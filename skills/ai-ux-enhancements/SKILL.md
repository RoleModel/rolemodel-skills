---
name: ai-ux-enhancements
description: Automated UX review rules optimized for AI-driven design evaluations, addressing gaps in usability and user empowerment. Complementary to laws-of-ux skill, focusing on efficiency, control, cognitive workload, learnability, and personalization.
metadata:
  triggers:
    - ux review
    - automated ux
    - ai ux
    - ux heuristics
    - ux automation
    - accessibility review
---

# SKILL: Automated UX Review Rules – AI-Optimized Subset (2026)

**Skill Name:** AI-Automated UX Heuristic Checks – non-duplicative Complement  
**Version:** 1.0  
**Date Created:** February 25, 2026  
**Purpose:** Provide a concise, highly automatable set of UX design rules that complement (without duplicating) Nielsen's 10 Usability Heuristics and the Laws of UX (lawsofux.com). Optimized for **AI-driven / programmatic design reviews**, linting tools, accessibility scanners, computer-vision UI analyzers, and automated prototyping checks.

## Background & Scope

This skill is used **after / in parallel with** checks based on:
- Nielsen's 10 Usability Heuristics
- Laws of UX psychological & perceptual principles (Aesthetic-Usability, Fitts’s, Hick’s, Jakob’s, Gestalt, Cognitive Load, etc.)

The 12 rules below target **gaps** — especially in:
- Expert/power-user efficiency
- User empowerment & locus of control
- Cognitive engineering for data-heavy/complex interfaces
- Self-explanation & fast learnability
- Personalization, inclusivity & cultural accommodation

All rules are selected because they are **measurable / detectable via automation** (code inspection, DOM analysis, accessibility APIs, performance metrics, pattern matching, NLP, CV layout analysis, etc.).

## Core Automated Review Rules (12 Rules)

### 1. Efficiency & Expert Support

1. **Enable Shortcuts for Frequent Users**  
   **Check:** Look for keyboard shortcuts, gesture support, or command palette / quick actions for ≥ 80% of primary / frequent operations.  
   **Automation ideas:** Scan for `keydown`, `keyup`, `shortcut` attributes; check tooltips / help menus for accelerator labels; verify aria-keyshortcuts where applicable.  
   **Fail message example:** "Missing accelerators for power users (e.g., no keyboard shortcut for 'Save', 'Undo', 'Search')."

2. **Optimize User Efficiency**  
   **Check:** Minimize interaction cost — aim for shallow navigation depth (≤ 3 clicks/taps for 90% of core tasks) and fast perceived performance.  
   **Automation ideas:** Static path analysis, Lighthouse Performance/SEO scores, simulated task completion time, element count per view.  
   **Fail message example:** "Task requires >3 steps / excessive scrolling; consider progressive disclosure or smart defaults."

### 2. User Empowerment & Control

3. **Support Internal Locus of Control**  
   **Check:** Users should feel they initiate and direct actions; avoid unexpected system interruptions or forced flows.  
   **Automation ideas:** Detect modal pop-ups without user trigger, auto-play/auto-advance carousels/videos, forced redirects, high % of system-initiated events in interaction logs.  
   **Fail message example:** "System-initiated modal / auto-advance interrupts user flow → reduces sense of control."

4. **Encourage Explorable Interfaces**  
   **Check:** Allow safe trial-and-error (non-destructive previews, undo at multiple levels, draft / preview modes).  
   **Automation ideas:** Check for preview buttons, non-permanent form states, undo/redo presence, destructive action confirmations with cancel option.  
   **Fail message example:** "No preview or safe experimentation mechanism detected for high-stakes actions."

### 3. Cognitive Workload Reduction (Especially Data-Intensive UIs)

5. **Automate Unwanted Workload**  
   **Check:** Eliminate manual calculations, copying, repetitive entry; provide auto-complete, smart defaults, calculations.  
   **Automation ideas:** Scan for input fields lacking auto-suggest / calculator integrations; detect manual date/math entry vs. picker / formula support.  
   **Fail message example:** "Users must manually calculate totals / convert units — automation opportunity missed."

6. **Fuse and Summarize Data**  
   **Check:** Aggregate raw data into meaningful summaries, charts, cards, or KPIs instead of showing long raw tables/lists.  
   **Automation ideas:** Detect tables > 20 rows without summary view; check for presence of aggregated visualizations / totals.  
   **Fail message example:** "Raw data table shown without summary, chart, or key metrics → high cognitive load."

7. **Use Judicious Redundancy**  
   **Check:** Repeat only mission-critical information in 1–2 strategic locations (e.g., total in header + footer). Avoid useless or excessive repetition.  
   **Automation ideas:** NLP similarity analysis across labels / text nodes; flag strings with > 90% similarity when they appear 3+ times within the same view, excluding clearly mission-critical information intentionally repeated in ≤2 locations.  
   **Fail message example:** "Excessive repeated text detected (e.g., same CTA copy 5× on screen)."

8. **Provide Multiple Data Codings**  
   **Check:** Critical status / priority items use ≥2 visual channels (color + icon + size + position).  
   **Automation ideas:** CSS / style analysis for combined encodings; accessibility tools flag color-only meaning.  
   **Fail message example:** "Error / success status communicated by color alone — violates redundancy best practice."

### 4. Learnability & Self-Explanation

9. **Ensure Self-Descriptiveness**  
   **Check:** Every interactive element explains itself (clear labels, tooltips, aria-label, visible help text, contextual instructions).  
   **Automation ideas:** Run axe-core / WAVE → flag missing alt text, aria-label, title, visible labels.  
   **Fail message example:** "Icon-only button lacks visible label or tooltip → not self-descriptive."

10. **Promote Suitability for Learning**  
    **Check:** Interface supports quick mastery (progressive disclosure, onboarding hints, low initial complexity).  
    **Automation ideas:** Count visible elements on first screen (< 50–60 recommended); detect tour / tooltip / helper presence on first load.  
    **Fail message example:** "First-view complexity too high (X elements); consider progressive disclosure."

### 5. Personalization & Inclusivity

11. **Support Individualization**  
    **Check:** Offer meaningful customization (theme, layout density, content filters, default views, font size).  
    **Automation ideas:** Scan for settings / preferences menu; check localStorage / user profile API calls for saved prefs.  
    **Fail message example:** "No personalization options detected (theme, density, saved filters, etc.)."

12. **Accommodate Diversity**  
    **Check:** Meet modern accessibility + cultural / locale sensitivity standards (WCAG 2.2 AA minimum, RTL support, date/number formatting).  
    **Automation ideas:** Lighthouse Accessibility score ≥ 90–95; locale-aware formatting checks; cultural marker detection (icons, colors).  
    **Fail message example:** "Accessibility violations detected (contrast, keyboard nav, screen reader issues)."

## Implementation Guidance for AI Agents

- **Priority order:** Run Rules 9, 12, and 1 first (highest automation maturity & impact).
- **Scoring suggestion:** Binary pass/fail per rule + severity weighting (1–4) for reporting.
- **Tools to integrate / emulate:**
  - axe-core, pa11y, WAVE → Rules 9, 12
  - Google Lighthouse → Rules 2, 10, 12
  - Custom DOM/CSS parsers → Rules 4, 6, 7, 8
  - NLP similarity → Rule 7
  - Interaction log analysis → Rules 3, 4
- **When to skip a rule:** If product context clearly makes it irrelevant (e.g., no data views → skip 6–8).

Use this skill to generate structured, actionable feedback reports that extend — but never repeat — Nielsen + Laws of UX findings.

Last updated: February 25, 2026
