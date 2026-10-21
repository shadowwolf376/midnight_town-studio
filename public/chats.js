// --- PERSISTENT CHAT CONTROLLER ---
function getSavedChats() {
  try {
    const data = localStorage.getItem("mt_chats");
    if (data) return JSON.parse(data);
  } catch(e) {}

  const initial = [{
    id: "lost-archivist",
    name: "The Lost Archivist",
    avatar: "🕯️",
    history: [
      { sender: "ai", text: "*The Archivist looks up from the ancient ledger.* **Welcome to MidnightTown.** *What brings you here tonight?" }
    ]
  }];
  localStorage.setItem("mt_chats", JSON.stringify(initial));
  return initial;
}

function saveChats(chats) {
  localStorage.setItem("mt_chats", JSON.stringify(chats));
}

function openActiveChat(chatId) {
  const container = document.getElementById("persistent-chats-container") || document.body;
  const chats = getSavedChats();
  const chat = chats.find(c => c.id === chatId);
  if (!chat) return;

  let box = document.getElementById("active-chat-box");
  if (!box) {
    box = document.createElement("div");
    box.id = "active-chat-box";
    box.style.padding = "10px";
    box.style.maxHeight = "400px";
    box.style.overflowY = "auto";
    container.appendChild(box);
  }
  box.innerHTML = "";

  chat.history.forEach(msg => {
    const msgEl = document.createElement("div");
    msgEl.style.marginBottom = "10px";
    msgEl.style.padding = "8px 12px";
    msgEl.style.borderRadius = "8px";
    
    if (msg.sender === "ai") {
      msgEl.style.background = "#151026";
      msgEl.style.border = "1px solid #2b204e";
      msgEl.innerHTML = formatRP(msg.text);
      if (typeof addMessageControls === "function") {
        addMessageControls(msgEl, () => {
          console.log("Regenerate clicked for chat:", chatId);
        });
      }
    } else {
      msgEl.style.background = "#2b204e";
      msgEl.style.color = "#fff";
      msgEl.textContent = msg.text;
    }
    box.appendChild(msgEl);
  });

  let inputRow = document.getElementById("active-chat-input-row");
  if (!inputRow) {
    inputRow = document.createElement("div");
    inputRow.id = "active-chat-input-row";
    inputRow.style.display = "flex";
    inputRow.style.gap = "8px";
    inputRow.style.marginTop = "10px";

    const input = document.createElement("input");
    input.id = "chat-in";
    input.type = "text";
    input.placeholder = "Type a message...";
    input.style.flex = "1";

    const sendBtn = document.createElement("button");
    sendBtn.textContent = "Send";
    sendBtn.style.padding = "8px 16px";
    sendBtn.style.borderRadius = "24px";
    sendBtn.style.fontWeight = "bold";
    sendBtn.onclick = () => sendMsg(chat.id);

    inputRow.appendChild(input);
    inputRow.appendChild(sendBtn);
    box.appendChild(inputRow);
  }

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
