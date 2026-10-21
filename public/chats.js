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

// Automatically open the active chat on page load
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        if (typeof openActiveChat === "function") {
            openActiveChat("lost-archivist");
        }
    }, 100);
});

// --- MESSAGE ACTION CONTROLS ---

// --- ROBUST MESSAGE ACTION CONTROLS ---
function addMessageControls(messageElement, msg, chatId, msgIndex) {
    if (!messageElement || messageElement.querySelector(".message-actions")) return;

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "message-actions";
    actionsDiv.style.cssText = "display: flex; gap: 12px; margin-top: 8px; font-size: 12px; opacity: 0.8;";

    // Copy Button
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "📋 Copy";
    copyBtn.style.cssText = "background: none; border: none; color: #b19cd9; cursor: pointer; padding: 0; font-family: inherit;";
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(messageElement.innerText);
        copyBtn.textContent = "Copied!";
        setTimeout(() => copyBtn.textContent = "📋 Copy", 2000);
    };
    actionsDiv.appendChild(copyBtn);

    // Regenerate Button (For AI messages)
    if (msg.sender === "ai") {
        const regenBtn = document.createElement("button");
        regenBtn.textContent = "🔄 Regenerate";
        regenBtn.style.cssText = "background: none; border: none; color: #b19cd9; cursor: pointer; padding: 0; font-family: inherit;";
        regenBtn.onclick = () => {
            const chats = getSavedChats();
            const chat = chats.find(c => c.id === chatId);
            if (chat) {
                chat.history.splice(msgIndex); // Remove this and subsequent messages
                saveChats(chats);
                openActiveChat(chatId);
            }
        };
        actionsDiv.appendChild(regenBtn);
    }

    // Delete Button
    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️ Delete";
    delBtn.style.cssText = "background: none; border: none; color: #ff7b72; cursor: pointer; padding: 0; font-family: inherit;";
    delBtn.onclick = () => {
        const chats = getSavedChats();
        const chat = chats.find(c => c.id === chatId);
        if (chat) {
            chat.history.splice(msgIndex, 1);
            saveChats(chats);
            openActiveChat(chatId);
        }
    };
    actionsDiv.appendChild(delBtn);

    messageElement.appendChild(actionsDiv);
}
window.addMessageControls = addMessageControls;
;

    actionsDiv.appendChild(copyBtn);
    
    if (onRegenerate) {
        const regenBtn = document.createElement('button');
        regenBtn.textContent = '🔄 Regenerate';
        regenBtn.style.cssText = 'background: none; border: none; color: #b19cd9; cursor: pointer; padding: 0; font-family: inherit;';
        regenBtn.onclick = () => onRegenerate();
        actionsDiv.appendChild(regenBtn);
    }

    messageElement.appendChild(actionsDiv);
}
window.addMessageControls = addMessageControls;
