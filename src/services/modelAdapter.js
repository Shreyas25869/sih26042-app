const CONFIG_KEY = "sih26042:model-config";

const defaults = { aiTutorUrl:"", translatorUrl:"", speechRecognitionUrl:"", speechSynthesisUrl:"", mode:"auto", timeoutMs:12000 };

export function loadModelConfig(){try{return{...defaults,...(JSON.parse(localStorage.getItem(CONFIG_KEY))||{})};}catch{return defaults;}}
export function saveModelConfig(config){const next={...defaults,...config};localStorage.setItem(CONFIG_KEY,JSON.stringify(next));return next;}
export function getModelConfig(){return loadModelConfig();}
export function getModelStatus(){const c=loadModelConfig();return{aiTutor:Boolean(c.aiTutorUrl),translator:Boolean(c.translatorUrl),speechRecognition:Boolean(c.speechRecognitionUrl),speechSynthesis:Boolean(c.speechSynthesisUrl),mode:c.mode};}

export async function postModel(url,body,{signal}={}){
 const config=getModelConfig(); const controller=signal?null:new AbortController(); const timer=controller?setTimeout(()=>controller.abort(),Number(config.timeoutMs)||12000):null;
 try{const response=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),signal:signal||controller?.signal});if(!response.ok)throw new Error(`Model request failed (${response.status})`);return response.json();}
 finally{if(timer)clearTimeout(timer);}
}

export async function checkModelHealth(url){if(!url)return{configured:false,online:false};const base=url.replace(/\/$/,"");try{const response=await fetch(`${base}/health`,{method:"GET",cache:"no-store"});return{configured:true,online:response.ok};}catch{return{configured:true,online:false};}}
export async function checkAllModels(){const c=getModelConfig();const entries=await Promise.all(Object.entries({aiTutor:c.aiTutorUrl,translator:c.translatorUrl,speechRecognition:c.speechRecognitionUrl,speechSynthesis:c.speechSynthesisUrl}).map(async([key,url])=>[key,await checkModelHealth(url)]));return Object.fromEntries(entries);}
