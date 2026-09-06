# Phase 7 — Production Hardening

## Delivered

- GitHub Actions CI builds the Vite application on pushes and pull requests to `main`.
- Device diagnostics report connectivity, Cache Storage, service-worker, speech support and local-storage usage.
- Diagnostics can be exported locally as JSON for field troubleshooting.
- Settings now exposes production-readiness checks for both teacher and student workspaces.
- `.env.example` documents optional local/LAN AI, translation and speech endpoints.
- The core application remains local-first: model services are optional and browser/offline fallbacks remain available.

## Field validation checklist

1. Install dependencies with `npm install`.
2. Run `npm run build` and confirm the CI workflow is green.
3. Serve the production build and open it once while connected.
4. Enter both teacher and student flows.
5. Open Offline Center and prepare learning content.
6. Disable the network and verify lessons, revision, quizzes and saved state still work.
7. Re-enable the network and verify queued changes remain available for export/sync preparation.
8. Test every supported language in the Language Assistant.
9. Configure a teammate's local/LAN model endpoints in Settings and use **Check services**.
10. Export diagnostics if a field device has browser, storage or connectivity problems.

## Model integration contract

All model services are optional. The UI should not depend on a server being reachable. Local/LAN integrations are configured through environment variables or the model settings panel. The adapter layer normalizes service responses so model implementations can change without replacing the learning UI.

## Important limitation

This phase does not claim that trained AI/model binaries are bundled. The actual trained model service must be supplied by the AI/audio teammate and connected through the documented adapter contract.
