# Teacher feature

The teacher workspace is intentionally split into small components so content authoring, multilingual preparation, and classroom management can evolve independently.

- `TeacherStudioPage.jsx` — content studio entry screen.
- `TeacherContentTools.jsx` — reusable content creation cards.
- `TeacherLanguageWorkflow.jsx` — translation and audio preview workflow.
- `TeacherToolsRoute.jsx` — route-level wrapper for the studio.

The translator and speech services are kept in `src/services/` so the trained AI/audio implementation can replace the browser/offline adapters without changing teacher-facing components.
