---
description: Automates the process of bumping the version, packaging, and preparing a new GitHub release for the Sulok browser extension.
---

# Release Extension Workflow

Use this workflow when the user wants to release a new version of the Sulok browser extension.

## Step 1: Confirm the New Version
1. Read `src/extension/manifest.json` to get the current version.
2. Ask the user what the new version number should be (e.g., major, minor, or patch bump). Wait for their confirmation before proceeding.

## Step 2: Update the Manifest
1. Update the `"version"` field in `src/extension/manifest.json` to the newly agreed-upon version.

## Step 3: Build and Package
1. Run `npm run pack:ext` via the `run_command` tool.
2. Wait for the command to finish. Verify that the output confirms the creation of a new `.zip` file in the `releases/` directory (e.g., `releases/sulok-extension-vX.Y.Z.zip`).

## Step 4: Prepare the GitHub Release
The GitHub download URL format in `install-page.tsx` expects the tag to perfectly match `v{version}` and the asset name to match `sulok-extension-v{version}.zip`.

1. Generate a quick pre-filled GitHub Release link for the user:
   `https://github.com/nmrisrl11/sulok/releases/new?tag=v<NEW_VERSION>&title=Sulok+Extension+v<NEW_VERSION>`
2. Present this link to the user and instruct them to:
   - Click the link to open the pre-filled GitHub release draft.
   - Write a brief description of the new features or fixes.
   - Drag and drop the newly created `releases/sulok-extension-v<NEW_VERSION>.zip` file into the "Attach binaries" section.
   - Publish the release.

## Step 5: Wrap Up
Remind the user that because the install page dynamically pulls the version from `manifest.json`, the website will automatically point to the new download link as soon as they deploy the web app. No further code changes to the website are necessary!
