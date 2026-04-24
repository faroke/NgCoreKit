---
description: Add an entry to CHANGELOG.md after a code change
allowed-tools: Read, Edit, Bash
---

<objective>
Add an entry to `CHANGELOG.md` at the root of the repository after completing a code change.
</objective>

<process>
1. **Read CHANGELOG.md** to find or create today's date section (`## YYYY-MM-DD`)
2. **Add entry** at the TOP of today's section using the correct prefix
3. **Confirm** the entry was added
</process>

<format>
```markdown
## 2026-04-23

FEATURE: Add organization switcher component
FIX: Correct auth guard redirect loop on login page
REFACTOR: Extract HTTP client wrapper to ApiService
CHORE: Update Angular to 21.2.8
```
</format>

<prefixes>
- `FEATURE:` — New feature or capability
- `FIX:` — Bug fix
- `REFACTOR:` — Code restructuring without behavior change
- `CHORE:` — Maintenance, dependencies, tooling
</prefixes>

<rules>
- One line per change
- Use present tense: "Add", "Fix", "Update" (not "Added")
- Be concise but descriptive
- Add entry IMMEDIATELY after completing the code change
- **This is NON-NEGOTIABLE. Every code change = changelog entry.**
</rules>

<success_criteria>
- Entry added under today's date in CHANGELOG.md
- Correct prefix used
- Description is concise and uses present tense
</success_criteria>

---

Add changelog entry for: $ARGUMENTS
