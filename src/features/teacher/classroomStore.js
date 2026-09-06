const KEY = "sih26042:classroom";

const defaults = { classes: [], assignments: [], students: [] };
export function loadClassroom() { try { return { ...defaults, ...(JSON.parse(localStorage.getItem(KEY)) || {}) }; } catch { return defaults; } }
export function saveClassroom(value) { localStorage.setItem(KEY, JSON.stringify(value)); }
export function createClassroom(data) { const state = loadClassroom(); const item = { id: `class-${Date.now()}`, createdAt: new Date().toISOString(), ...data }; state.classes.push(item); saveClassroom(state); return item; }
export function addStudent(data) { const state = loadClassroom(); const item = { id: `student-${Date.now()}`, joinedAt: new Date().toISOString(), ...data }; state.students.push(item); saveClassroom(state); return item; }
export function assignContent(data) { const state = loadClassroom(); const item = { id: `assignment-${Date.now()}`, createdAt: new Date().toISOString(), status: "assigned", ...data }; state.assignments.push(item); saveClassroom(state); return item; }
