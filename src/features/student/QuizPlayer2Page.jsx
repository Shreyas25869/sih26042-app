import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, CircleHelp, RotateCcw, Trophy, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../../app/AppContext";

const questionBank = [
  { id: "water-1", text: "Which is a natural source of water?", options: ["River", "Notebook", "Chair", "Bag"], answer: 0, explanation: "Rivers are natural sources of fresh water." },
  { id: "water-2", text: "Why should we save water?", options: ["Water is unlimited", "Fresh water is limited", "Water is not useful", "Only plants need water"], answer: 1, explanation: "Fresh water is limited, so careful use helps every community." },
  { id: "water-3", text: "Which action helps conserve water?", options: ["Leave taps running", "Repair leaking taps", "Waste clean water", "Keep water uncovered"], answer: 1, explanation: "Repairing leaks prevents clean water from being wasted." },
  { id: "water-4", text: "Which water source can be found underground?", options: ["Well", "Cloud", "Rainbow", "Sun"], answer: 0, explanation: "Wells can reach groundwater below the surface." },
  { id: "water-5", text: "What should we do before drinking unsafe-looking water?", options: ["Drink it immediately", "Ignore it", "Treat or filter it safely", "Add soil"], answer: 2, explanation: "Water should be treated or filtered using a safe method before drinking." },
];

function buildQuestions(quiz) { return questionBank.slice(0, Math.max(1, Math.min(quiz?.questions || 5, questionBank.length))); }
function saveAttempt(id, score, total) { const key = "sih26042:quiz-attempts"; try { const items = JSON.parse(localStorage.getItem(key) || "[]"); items.push({ id: `attempt-${Date.now()}`, quizId: id, score, total, completedAt: new Date().toISOString() }); localStorage.setItem(key, JSON.stringify(items.slice(-30))); } catch {} }

export default function QuizPlayer2Page() {
  const { state, actions } = useApp();
  const quiz = state.quizzes[0];
  const questions = useMemo(() => buildQuestions(quiz), [quiz]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const current = questions[index];
  const score = questions.reduce((sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0), 0);
  const answered = Object.keys(answers).length;

  if (!quiz) return <div className="page quiz2"><div className="quiz2-empty"><CircleHelp/><h1>No quiz available</h1><p>Create a quiz from the teacher content studio first.</p><Link className="btn btn-primary" to="/student">Back home</Link></div></div>;

  function choose(option) { if (finished) return; setAnswers((old) => ({ ...old, [index]: option })); }
  function next() { if (index < questions.length - 1) setIndex((i) => i + 1); else { const finalScore = questions.reduce((sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0), 0); actions.saveQuizScore(quiz.id, finalScore); saveAttempt(quiz.id, finalScore, questions.length); setFinished(true); } }
  function restart() { setIndex(0); setAnswers({}); setFinished(false); }

  if (finished) return <div className="page quiz2"><div className="quiz2-result card"><div className="quiz2-result-icon"><Trophy/></div><span className="eyebrow">Quiz complete</span><h1>{score}/{questions.length}</h1><p className="muted">{score === questions.length ? "Excellent work! You got every answer right." : score >= Math.ceil(questions.length * .6) ? "Good job. Review the explanations and try again when ready." : "Keep practising. You can retry this quiz anytime."}</p><div className="quiz2-result-bar"><span style={{ width: `${(score / questions.length) * 100}%` }}/></div><div className="quiz2-result-actions"><button className="btn btn-primary" onClick={restart}><RotateCcw size={17}/> Try again</button><Link className="btn btn-secondary" to="/student">Back to learning</Link></div></div></div>;

  const selected = answers[index];
  return <div className="page quiz2"><div className="quiz2-top"><Link to="/student" className="back-link"><ArrowLeft size={16}/> Back to learning</Link><span className="badge">{answered}/{questions.length} answered</span></div><div className="quiz2-hero"><div><span className="eyebrow">Practice check</span><h1>{quiz.title}</h1><p className="muted">Question {index + 1} of {questions.length} · Your progress is saved on this device.</p></div><div className="quiz2-progress"><span style={{ width: `${((index + 1) / questions.length) * 100}%` }}/></div></div><div className="quiz2-layout"><section className="card quiz2-question"><div className="quiz2-question-number">Q{index + 1}</div><h2>{current.text}</h2><div className="quiz2-options">{current.options.map((option, optionIndex) => { const chosen = selected === optionIndex; return <button key={option} className={`quiz2-option ${chosen ? "selected" : ""}`} onClick={() => choose(optionIndex)}><span className="quiz2-letter">{String.fromCharCode(65 + optionIndex)}</span><span>{option}</span>{chosen && <CheckCircle2 size={18}/>}</button>; })}</div>{selected !== undefined && <div className="quiz2-feedback"><CheckCircle2 size={18}/><div><strong>Answer selected</strong><span>You can change it before continuing.</span></div></div>}<div className="quiz2-footer"><span>{selected === undefined ? "Choose one answer" : "Ready to continue"}</span><button className="btn btn-primary" disabled={selected === undefined} onClick={next}>{index === questions.length - 1 ? "Finish quiz" : "Next question"}</button></div></section><aside className="quiz2-side card"><span className="eyebrow">Question map</span><div className="quiz2-map">{questions.map((q, i) => <button key={q.id} className={`${i === index ? "current" : ""} ${answers[i] !== undefined ? "answered" : ""}`} onClick={() => setIndex(i)}>{i + 1}</button>)}</div><div className="quiz2-note"><CircleHelp size={17}/><span>No internet is required for this quiz once its content is available locally.</span></div></aside></div></div>;
}
