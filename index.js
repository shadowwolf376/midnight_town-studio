const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

const API_KEY = process.env.OPENROUTER_API_KEY;
const DATA_FILE = path.join(__dirname, "data.json");

function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); } catch (e) {}
  }
  return { activeId: "aira", characters: {} };
}

function saveData(data) { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); }

let appData = loadData();
let history = [];

app.get("/characters", (req, res) => {
  const active = appData.characters[appData.activeId] || Object.values(appData.characters)[0] || {};
  res.json({
    active: active.id || "aira",
    list: Object.values(appData.characters),
    lorebook: appData.lorebook || [],
    userPersona: appData.userPersona || "",
    authorNote: appData.authorNote || ""
  });
});

app.post("/select-character", (req, res) => {
  const { characterId } = req.body;
  if (appData.characters[characterId]) {
    appData.activeId = characterId;
    saveData(appData); history = [];
    return res.json(appData.characters[characterId]);
  }
  res.status(400).json({ error: "Not found" });
});

app.post("/update-meta", (req, res) => {
  const { authorNote, userPersona } = req.body;
  if (authorNote !== undefined) appData.authorNote = authorNote;
  if (userPersona !== undefined) appData.userPersona = userPersona;
  saveData(appData); res.json({ success: true });
});

app.post("/chat", async (req, res) => {
  const { userMessage, clearHistory, regenerate } = req.body;
  const active = appData.characters[appData.activeId] || {};
  if (clearHistory) { history = []; return res.json({ reply: "Reset." }); }
  if (regenerate && history.length > 0) {
    if (history[history.length - 1].role === "assistant") history.pop();
  } else if (userMessage) {
    history.push({ role: "user", content: userMessage });
  } else {
    return res.status(400).json({ error: "No message" });
  }
  try {
    let systemPrompt = active.personality || "You are an AI assistant.";
    if (appData.userPersona) systemPrompt += "\n[User Persona: " + appData.userPersona + "]";
    let messages = [{ role: "system", content: systemPrompt }, ...history.slice(-10)];
    let r = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "nvidia/nemotron-3.5-lightning:free", messages
    }, { headers: { "Authorization": "Bearer " + API_KEY } });
    let reply = r.data.choices[0].message.content;
    history.push({ role: "assistant", content: reply });
    res.json({ reply });
  } catch(e) { history.pop(); res.status(500).json({ error: "AI Error" }); }
});


app.post("/save-lorebook", (req, res) => {
  if (Array.isArray(req.body.lorebook)) {
    appData.lorebook = req.body.lorebook;
    saveData(appData); res.json({ success: true });
  }
});


appData.sessions = appData.sessions || {};

app.post("/save-session", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });
  const charId = appData.activeId;
  if (!appData.sessions[charId]) appData.sessions[charId] = [];
  appData.sessions[charId].push({ name, history: [...history], timestamp: Date.now() });
  saveData(appData);
  res.json({ success: true, sessions: appData.sessions[charId] });
});

app.get("/get-sessions", (req, res) => {
  const charId = appData.activeId;
  res.json({ sessions: appData.sessions[charId] || [] });
});

app.post("/load-session", (req, res) => {
  const { index } = req.body;
  const charId = appData.activeId;
  if (appData.sessions[charId] && appData.sessions[charId][index]) {
    history = [...appData.sessions[charId][index].history];
    return res.json({ success: true, history });
  }
  res.status(400).json({ error: "Session not found" });
});

app.post("/import-character", (req, res) => {
  const { character } = req.body;
  if (!character || !character.name || !character.personality) {
    return res.status(400).json({ error: "Invalid character payload" });
  }
  const id = "import_" + Date.now();
  appData.characters[id] = {
    id,
    name: character.name,
    title: character.title || "Imported Character",
    avatar: character.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    background: character.background || "",
    greetings: character.greetings || [character.greeting || "Hello."],
    personality: character.personality
  };
  appData.activeId = id;
  saveData(appData);
  history = [];
  res.json({ success: true, character: appData.characters[id] });
});

app.listen(3000, () => console.log("Engine online on http://localhost:3000"));
