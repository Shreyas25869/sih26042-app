import { useMemo } from "react";
import { BookOpen, Bot, CheckCircle2, ChevronRight, CircleHelp, Layers3, Languages, Sparkles, WifiOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../../app/AppContext";
import { loadClassroom } from "../teacher/classroomStore";

export default function StudentJourneyPage() {
  const { state } = useApp();
  const completed = state.progress.completedLessons.length;
  const quizCount = Object.keys(state.progress.quizScores).length;
  const total = Math.max(state.lessons.length, 1);
  const progress = Math.round((completed / total) * 100);
  const nextLesson = state.lessons.find((lesson) => !state.progress.completedLessons.includes(lesson.id)) || state.lessons[0];
  const recentLessons = useMemo(() => state.lessons.slice(0, 3), [state.lessons]);
  const classroom = useMemo(() => loadClassroom(), []);
  const assignedContent = useMemo(() => {
    return classroom.assignments
      .map((assignment) => {
        const lesson = state.lessons.find((item) => item.id === assignment.contentId);
        const quiz = state.quizzes.find((item) => item.id === assignment.contentId);
        const content = lesson || quiz;
        if (!content) return null;
        return { ...assignment, content, contentType: lesson ? "lesson" : "quiz" };
      })
      .filter(Boolean)
      .slice(-6)
      .reverse();
  }, [classroom.assignments, state.lessons, state.quizzes]);

  return (
    <div className="student-journey page">
      <section className="student-hero">
        <div className="student-hero-copy">
          <span className="journey-kicker"><Sparkles size={15} /> Today's learning path</span>
          <h1>Hi, {state.user.name}! <span>Ready to learn?</span></h1>
          <p>One small step at a time. Learn a lesson, practice what you know, and revise whenever you need.</p>
          <div className="journey-actions">
            <Link className="btn btn-student btn-lg" to="/student/lessons">Start learning <ChevronRight size={18} /></Link>
            <Link className="journey-secondary" to="/student/tutor"><Bot size={18} /> Ask Learning Buddy</Link>
          </div>
        </div>
        <div className="journey-progress-card">
          <div className="progress-ring" style={{ "--progress": `${progress}%` }}><strong>{progress}%</strong><span>complete</span></div>
          <div><strong>Your progress</strong><p>{completed} of {state.lessons.length} lessons finished</p></div>
        </div>
      </section>

      <div className="journey-stats">
        <JourneyStat icon={BookOpen} value={completed} label="Lessons done" />
        <JourneyStat icon={CircleHelp} value={quizCount} label="Quizzes taken" />
        <JourneyStat icon={Layers3} value={state.flashcards.length} label="Revision cards" />
        <JourneyStat icon={Languages} value={state.language.toUpperCase()} label="Learning language" />
      </div>

      {assignedContent.length > 0 && (
        <section className="card journey-assigned-card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Teacher plan</span>
              <h2>Assigned for this classroom</h2>
              <p className="muted">Learning tasks prepared on this device. They remain available offline.</p>
            </div>
            <span className="badge">{assignedContent.length} tasks</span>
          </div>
          <div className="journey-assigned-list">
            {assignedContent.map((assignment) => {
              const isQuiz = assignment.contentType === "quiz";
              const to = isQuiz
                ? `/student/quizzes?quiz=${encodeURIComponent(assignment.content.id)}`
                : `/student/lessons/${encodeURIComponent(assignment.content.id)}`;
              return (
                <Link className="journey-assigned-item" to={to} key={assignment.id}>
                  <div className="journey-assigned-icon">{isQuiz ? <CircleHelp /> : <BookOpen />}</div>
                  <div>
                    <span>{isQuiz ? "Quiz" : "Lesson"} · {assignment.content.level || "Learning"}</span>
                    <strong>{assignment.content.title}</strong>
                  </div>
                  <ChevronRight />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="journey-stepper card">
        <div className="section-heading"><div><span className="eyebrow">Simple learning loop</span><h2>Learn → Practice → Revise → Grow</h2></div></div>
        <div className="journey-steps">
          <JourneyStep number="01" icon={BookOpen} title="Learn" text="Take a short lesson." to="/student/lessons" active={!completed} />
          <JourneyStep number="02" icon={CircleHelp} title="Practice" text="Check your understanding." to="/student/quizzes" active={completed > 0} />
          <JourneyStep number="03" icon={Layers3} title="Revise" text="Use quick flashcards." to="/student/revision" active={quizCount > 0} />
          <JourneyStep number="04" icon={CheckCircle2} title="Grow" text="See your progress." to="/student/progress" active={progress > 0} />
        </div>
      </section>

      <div className="journey-grid">
        <section className="card next-lesson-card">
          <div className="section-heading"><div><span className="eyebrow">Recommended next</span><h2>{nextLesson ? nextLesson.title : "You're all caught up"}</h2></div></div>
          {nextLesson ? <>
            <div className="next-lesson-meta"><span className="tag">{nextLesson.level}</span><span>{nextLesson.minutes} min</span></div>
            <p>{nextLesson.description}</p>
            <Link className="btn btn-primary" to={`/student/lessons/${encodeURIComponent(nextLesson.id)}`}>Open lesson <ChevronRight size={17} /></Link>
          </> : <p>Come back when new learning content is available.</p>}
        </section>

        <section className="card journey-tools-card">
          <div className="section-heading"><div><span className="eyebrow">Your toolkit</span><h2>Learn your way</h2></div></div>
          <div className="tool-list">
            <Link to="/student/tutor"><Bot /><div><strong>AI Learning Buddy</strong><span>Ask, explain or practice</span></div><ChevronRight /></Link>
            <Link to="/student/revision"><Layers3 /><div><strong>Revision deck</strong><span>{state.flashcards.length} flashcards ready</span></div><ChevronRight /></Link>
            <Link to="/student/languages"><Languages /><div><strong>Language assistant</strong><span>Translate and hear content</span></div><ChevronRight /></Link>
            <Link to="/student/offline"><WifiOff /><div><strong>Offline Center</strong><span>Prepare learning for low connectivity</span></div><ChevronRight /></Link>
          </div>
        </section>
      </div>

      <section className="card journey-content-card">
        <div className="section-heading"><div><span className="eyebrow">Continue learning</span><h2>Your lessons</h2></div><Link className="text-link" to="/student/lessons">View all <ChevronRight size={16} /></Link></div>
        <div className="journey-lessons">
          {recentLessons.map((lesson) => {
            const done = state.progress.completedLessons.includes(lesson.id);
            return <Link className={`journey-lesson ${done ? "complete" : ""}`} to={`/student/lessons/${encodeURIComponent(lesson.id)}`} key={lesson.id}>
              <div className="journey-lesson-icon">{done ? <CheckCircle2 /> : <BookOpen />}</div>
              <div><span>{lesson.level} · {lesson.minutes} min</span><strong>{lesson.title}</strong><p>{lesson.description}</p></div>
              <ChevronRight className="journey-chevron" />
            </Link>;
          })}
        </div>
      </section>
    </div>
  );
}

function JourneyStat({ icon: Icon, value, label }) {
  return <div className="journey-stat"><div><Icon size={18} /></div><strong>{value}</strong><span>{label}</span></div>;
}

function JourneyStep({ number, icon: Icon, title, text, to, active }) {
  return <Link to={to} className={`journey-step ${active ? "active" : ""}`}><span className="step-number">{number}</span><div className="step-icon"><Icon size={20} /></div><strong>{title}</strong><span>{text}</span></Link>;
}
