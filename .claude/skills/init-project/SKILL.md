---
name: init-project
description: Initialize NgCoreKit project with app name, purpose, theme, and environment configuration
argument-hint: "[app-name]"
---

# Init Project - NgCoreKit Initialization Workflow

<objective>
Initialize an NgCoreKit project by gathering project information, updating CLAUDE.md files, configuring app settings, applying a theme, and setting up environment variables for both the NestJS API and Angular frontend.
</objective>

<when_to_use>
Use this workflow when:
- Starting a new project based on NgCoreKit
- Reconfiguring an existing NgCoreKit project with new branding
- Setting up project documentation and configuration from scratch
</when_to_use>

<parameters>
**Arguments:**
- `[app-name]` - Optional app name to skip the first question

**No flags** - This workflow is fully interactive to gather all necessary information.
</parameters>

<process>

## Step 1 — Gather Info

Ask the user:
1. App name (if not provided as argument)
2. App purpose / main description
3. Main features (list)
4. Target audience
5. Whether they have a PRD or architecture document to share

## Step 2 — Update CLAUDE.md files

Update three CLAUDE.md files:
- Root `CLAUDE.md` — Update "Monorepo Structure" section to reflect active workspaces
- `apps/api/CLAUDE.md` — Update "About" section with project description
- `apps/web/CLAUDE.md` — Update "About" section with project description

## Step 3 — Update configuration files

- `apps/api/src/main.ts` — Update app title in Swagger config
- `apps/web/src/app/app.config.ts` — Update any app-level configuration
- Update environment variables references (app name, description, URLs)

## Step 4 — Update theme

NgCoreKit uses TailwindCSS v4. To apply a theme:
- Check `apps/web/src/app/app.css` for CSS custom properties
- Update `--primary`, `--secondary`, `--accent` colors if requested
- Keep consistent with Zard UI component expectations

## Step 5 — Setup .env files

Guide the user through setting up:
- `apps/api/.env` — DATABASE_URL, BETTER_AUTH_SECRET, STRIPE_SECRET_KEY, etc.
- `apps/web/.env` — API_URL, BETTER_AUTH_URL, etc.

Show which variables are required vs optional.
</process>

<important_files>
**Files that will be modified:**

| File | Changes |
|------|---------|
| `CLAUDE.md` | Project description, workspace structure |
| `apps/api/CLAUDE.md` | API project description and features |
| `apps/web/CLAUDE.md` | Web project description and features |
| `apps/api/src/main.ts` | Swagger title and description |
| `apps/web/src/app/app.css` | Theme colors (if requested) |
| `apps/api/.env` | API environment variables |
| `apps/web/.env` | Web environment variables |
</important_files>

<success_criteria>
- Root and workspace CLAUDE.md files updated with project info
- App name consistent across all config files
- Environment files created or updated
- Theme applied if requested
</success_criteria>
