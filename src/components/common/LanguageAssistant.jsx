import { useEffect, useRef, useState } from "react";
import { Languages, Mic, Square, Volume2 } from "lucide-react";
import { createSpeechRecognition, isSpeechRecognitionSupported, speakText, stopSpeaking } from "../../services/speech";
import { translateText, saveOfflineTranslation } from "../../services/translator";

const languageOptions = [
  ["en", "English"], ["hi", "Hindi"], ["bn", "Bengali"], ["ta", "Tamil"],
  ["te", "Telugu"], ["mr", "Marathi"], ["san", "Santhali"],
];

const speechLocales = { en: "en-IN", hi: "hi-IN", bn: "bn-IN", ta: "ta-IN", te: "te-IN", mr: "mr-IN", san: "hi-IN" };

export default function LanguageAssistant({ initialText = "", sourceLanguage = "en" }) {
  const [text, setText] = useState(initialText);
  const [targetLanguage, setTargetLanguage] = useState("hi");
  const [translation, setTranslation] = useState("");
  const [listening, setListening] = useState(false);
  const [busy, setBusy] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => () => recognitionRef.current?.abort(), []);

  const startListening = () => {
    const recognition = createSpeechRecognition({
      language: speechLocales[sourceLanguage] || "en-IN",
      onResult: (value) => setText(value),
      onEnd: () => setListening(false),
      onError: () => setListening(false),
    });
    if (!recognition) return;
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const translate = async () => {
    setBusy(true);
    try {
      const result = await translateText({ text, sourceLanguage, targetLanguage });
      setTranslation(result);
      saveOfflineTranslation({ text, translation: result, sourceLanguage, targetLanguage });
    } finally {
      setBusy(false);
    }
  };

  const play = () => speakText(translation || text, speechLocales[targetLanguage] || "hi-IN");

  return (
    <section className="language-assistant card" aria-label="Language and audio assistant">
      <div className="card-header">
        <div><h2 className="card-title"><Languages size={18} /> Language & Audio Assistant</h2><p className="card-description">Type or speak, translate, then listen to the result.</p></div>
      </div>
      <div className="assistant-grid">
        <label className="field"><span className="field-label">Your text</span><textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a sentence or use the microphone…" /></label>
        <label className="field"><span className="field-label">Translate to</span><select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>{languageOptions.map(([code, name]) => <option value={code} key={code}>{name}</option>)}</select><div className="assistant-actions"><button className="btn btn-secondary" type="button" onClick={listening ? stopListening : startListening} disabled={!isSpeechRecognitionSupported()}>{listening ? <Square size={17} /> : <Mic size={17} />}{listening ? "Stop" : "Speak"}</button><button className="btn btn-primary" type="button" onClick={translate} disabled={busy || !text.trim()}>{busy ? "Translating…" : "Translate"}</button></div>{!isSpeechRecognitionSupported() && <small className="text-muted">Speech input is not supported by this browser.</small>}</label>
      </div>
      {translation && <div className="assistant-output"><div><span className="badge badge-success">Translation</span><p>{translation}</p></div><button className="btn btn-secondary" type="button" onClick={play}><Volume2 size={17} /> Play audio</button><button className="btn btn-ghost" type="button" onClick={stopSpeaking}>Stop</button></div>}
    </section>
  );
}
