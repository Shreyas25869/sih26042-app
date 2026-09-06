# SIH 26042 — Phase 8

## Final integration and demonstration layer

Phase 8 turns the completed offline-first foundations into a repeatable field/demo workflow.

### End-to-end story

1. **Teacher creates content** in Content Studio.
2. **Content is saved locally** and prepared for offline learning.
3. **Device loses connectivity**; cached learning content remains available.
4. **Student opens lessons, revision, quizzes and AI support** using available local/browser fallbacks.
5. **Completion and quiz activity are recorded locally.**
6. **Offline changes remain queued** for a future sync/export path.
7. **Diagnostics can be exported** from Settings when validating a field device.

## Model integration contract

The UI accepts optional local/LAN endpoints through the model adapter. Real trained models should be connected only through these adapters; UI components should not call model providers directly.

- AI Tutor: `POST` JSON → `{ answer: string }`
- Translation: `POST` JSON → `{ translation: string }`
- STT: `POST` request → `{ transcript: string }`
- TTS: `POST` request → model-specific audio/JSON response
- Optional health endpoint: `GET <endpoint>/health`

## Field validation checklist

- [ ] Install/open the PWA on a target Android device.
- [ ] Create a teacher profile.
- [ ] Create a lesson, quiz and flashcard.
- [ ] Prepare learning content offline.
- [ ] Switch the device to airplane mode.
- [ ] Open the student workflow.
- [ ] Complete a lesson and quiz.
- [ ] Confirm progress remains after reload.
- [ ] Confirm pending changes are visible in Offline Center.
- [ ] Restore connectivity and verify the queue can be prepared/exported.
- [ ] Open Settings and export diagnostics.
- [ ] Connect the teammate's real model endpoints and run model health checks.

## Important scope boundary

This repository remains frontend-first. A real shared server-side synchronization service, hosted model inference, and production identity system are optional integrations and are not fabricated by this phase.
