# Bizsaas Private Release Checklist

## Before building
- Confirm working tree is clean.
- Confirm visible branding says Bizsaas.
- Confirm no Firebase/Dyad setup page appears in landing.
- Confirm no installer binaries are tracked by Git.

## Build
- Remove old out folder.
- Run npm run make.

## Copy installer to Firebase Hosting
- Copy the latest Windows installer to landing/downloads/Bizsaas-Setup-Latest.exe.

## Deploy
- Run firebase deploy --only hosting.

## Test
- Open Firebase Hosting URL.
- Click Download for Windows.
- Confirm installer downloads.
- Install app.
- Confirm app opens.
- Confirm logo is Bizsaas.
- Confirm no visible Dyad branding.
- Confirm user can add AI API key.
- Confirm app can create a basic project.

## Do not do yet
- Do not replace engine.dyad.sh without Bizsaas engine backend.
- Do not replace OAuth endpoints without Bizsaas OAuth backend.
- Do not remove LICENSE or NOTICE.
- Do not commit installer binaries.
