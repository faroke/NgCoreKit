---
description: Automated workflow to fix all ESLint and TypeScript errors with parallel processing
allowed-tools: Bash(pnpm :*), Read, Task, Grep
---

<objective>
Automatically fix all ESLint and TypeScript errors by discovering issues and processing them in parallel using Snipper agents.
</objective>

<process>
1. **Discover commands**: Check `package.json` for lint/typecheck scripts
2. **Run diagnostics**: Execute the appropriate lint and type-check commands:
   - From repo root: `pnpm lint` and `pnpm check-types`
   - For API only: `pnpm --filter @ngcorekit/api lint` and `pnpm --filter @ngcorekit/api check-types`
   - For web only: `pnpm --filter @ngcorekit/web lint` and `pnpm --filter @ngcorekit/web check-types`
3. **Analyze errors**: Group errors by file (max 5 files per group)
4. **Parallel processing**: Launch Snipper agents for each group via Task tool
5. **Verify**: Re-run diagnostics after fixes
6. **Format**: Run `pnpm format` if available
</process>

<agent_instructions>
For each file group, launch a Snipper agent with:

```
Fix all ESLint and TypeScript errors in these files:
[list of files with their specific errors]

Make minimal changes to fix errors while preserving functionality.
```

</agent_instructions>

<success_criteria>

- All lint errors fixed
- All TypeScript errors resolved
- Code formatted consistently
  </success_criteria>
