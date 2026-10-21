// --- PERSISTENT CHAT CONTROLLER ---
function getSavedChats() {
  try {
    const data = localStorage.getItem("mt_chats");
    if (data) return JSON.parse(data);
  } catch(e) {}
  
  const initial = [{
    id: "lost-archivist",
    name: "The Lost Archivist",
    avatar: "🏛️",
    history: [
      { sender: "ai", text: "*The Archivist looks up from the ancient ledger.* **Welcome to MidnightTown.** What brings you here tonight?" }
    ]
  }];
  localStorage.setItem("mt_chats", JSON.stringify(initial));
  return initial;
}

function saveChats(chats) {
  localStorage.setItem("mt_chats", JSON.stringify(chats));
}

// Simple Roleplay Formatter
function formatRP(text) {
  if (!text) return "";
  let safe = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#fff;">$1</strong>');
  safe = safe.replace(/\*([^*]+)\*/g, '<span style="color:#c4b5fd; font-style:italic;">$1</span>');
  return safe.replace(/\n/g, '<br>');
}

// --- RENDER CLEAN CHAT LIST ---
function renderChatList() {
  const el = document.getElementById("view-chats");
  if (!el) return;
  
  el.style.display = "block";
  el.style.background = "#0b0813";
  el.style.minHeight = "100vh";
  el.style.padding = "16px";
  el.innerHTML = "";

  const title = document.createElement("h2");
  title.style.color = "#fff";
  title.style.marginTop = "0";
  title.textContent = "Your Chats";
  el.appendChild(title);

  const chats = getSavedChats();
  chats.forEach(c => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.padding = "14px";
    row.style.background = "#151026";
    row.style.border = "1px solid #2b204e";
    row.style.borderRadius = "12px";
    row.style.marginBottom = "10px";
    row.style.cursor = "pointer";

    const lastMsg = c.history && c.history.length ? c.history[c.history.length - 1].text : "No messages";

    row.innerHTML = `
      <div style="font-size:24px; margin-right:12px;">${c.avatar || "💬"}</div>
      <div style="flex:1; overflow:hidden;">
        <div style="color:#fff; font-weight:bold; font-size:16px;">${c.name}</div>
        <div style="color:#948aa9; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:4px;">
          ${lastMsg.replace(/[\*\"]/g, "")}
        </div>
      </div>
    `;

    row.onclick = () => openActiveChat(c.id);
    el.appendChild(row);
  });
}

// --- RENDER ACTIVE CONVERSATION ---
function openActiveChat(chatId) {
  const chats = getSavedChats();
  const chat = chats.find(c => c.id === chatId) || chats[0];

  const el = document.getElementById("view-chats");
  if (!el) return;
  el.style.display = "block";
  el.style.background = "#0b0813";
  el.style.padding = "16px";
  el.innerHTML = "";

  // Header
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.alignItems = "center";
  header.style.justifyContent = "space-between";
  header.style.marginBottom = "12px";

  const backBtn = document.createElement("button");
  backBtn.textContent = "← Back";
  backBtn.style.background = "#151026";
  backBtn.style.color = "#fff";
  backBtn.style.border = "1px solid #2b204e";
  backBtn.style.padding = "8px 14px";
  backBtn.style.borderRadius = "20px";
  backBtn.onclick = () => renderChatList();
  header.appendChild(backBtn);

  const name = document.createElement("h3");
  name.style.color = "#fff";
  name.style.margin = "0";
  name.textContent = chat.name;
  header.appendChild(name);

  el.appendChild(header);

  // Chat Log Container
  const box = document.createElement("div");
  box.id = "chat-box";
  box.style.height = "calc(100vh - 190px)";
  box.style.overflowY = "auto";
  box.style.marginBottom = "10px";

  chat.history.forEach(m => {
    const msgEl = document.createElement("div");
    msgEl.style.padding = "12px 16px";
    msgEl.style.borderRadius = "16px";
    msgEl.style.marginBottom = "10px";
    msgEl.style.maxWidth = "85%";
    msgEl.style.fontSize = "14px";
    msgEl.style.lineHeight = "1.5";

    if (m.sender === "user") {
      msgEl.style.background = "linear-gradient(135deg, #8b5cf6, #7c3aed)";
      msgEl.style.color = "#fff";
      msgEl.style.marginLeft = "auto";
    } else {
      msgEl.style.background = "#151026";
      msgEl.style.color = "#e2d9f3";
      msgEl.style.border = "1px solid #2b204e";
    }

    msgEl.innerHTML = formatRP(m.text);
        if (m.sender !== "user" && typeof addMessageControls === "function") {
            addMessageControls(msgEl, () => {
                alert("Regenerate triggered!");
            });
        }
    box.appendChild(msgEl);
  });

  el.appendChild(box);

  // Input Row
  const inputRow = document.createElement("div");
  inputRow.style.display = "flex";
  inputRow.style.gap = "8px";

  const input = document.createElement("input");
  input.id = "chat-in";
  input.placeholder = "Type a message...";
  input.style.flex = "1";
  input.style.background = "#151026";
  input.style.border = "1px solid #2b204e";
  input.style.color = "#fff";
  input.style.padding = "12px 16px";
  input.style.borderRadius = "24px";
  input.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMsg(chat.id); });

  const sendBtn = document.createElement("button");
  sendBtn.textContent = "Send";
  sendBtn.style.background = "linear-gradient(135deg, #8b5cf6, #d946ef)";
  sendBtn.style.color = "#fff";
  sendBtn.style.border = "none";
  sendBtn.style.padding = "12px 20px";
  sendBtn.style.borderRadius = "24px";
  sendBtn.style.fontWeight = "bold";
  sendBtn.onclick = () => sendMsg(chat.id);

  inputRow.appendChild(input);
  inputRow.appendChild(sendBtn);
  el.appendChild(inputRow);

  setTimeout(() => { box.scrollTop = box.scrollHeight; }, 50);
}

// --- SEND MESSAGE & PERSIST ---
function sendMsg(chatId) {
  const inEl = document.getElementById("chat-in");
  if (!inEl || !inEl.value.trim()) return;

  const text = inEl.value.trim();
  inEl.value = "";

  const chats = getSavedChats();
  const chat = chats.find(c => c.id === chatId);
  if (!chat) return;

  chat.history.push({ sender: "user", text: text });
  saveChats(chats);
  openActiveChat(chatId);

  // AI Response Simulation
  setTimeout(() => {
    const aiResponses = [
      "*Nods slowly.* **\"I hear you clearly.** Let us see where this path takes us next.\"",
      "*Smiles faintly.* **\"An interesting thought.** MidnightTown holds many answers if you know where to look.\""
    ];
    const reply = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    chat.history.push({ sender: "ai", text: reply });
    saveChats(chats);
    openActiveChat(chatId);
  }, 1000);
}

window.openActiveChat = openActiveChat;
window.renderChatList = renderChatList;
