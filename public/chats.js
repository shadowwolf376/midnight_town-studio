// --- MIDNIGHTTOWN CHAT CONTROLLER ---

function getSavedChats() {
  try {
    const data = localStorage.getItem("mt_chats");
    if (data) return JSON.parse(data);
  } catch(e) {}

  const initial = [{
    id: "lost-archivist",
    name: "The Lost Archivist",
    history: [
      { sender: "ai", text: "*The room is dim, illuminated only by the flickering glow...* Welcome to Shadow Vale, traveler." }
    ]
  }];
  localStorage.setItem("mt_chats", JSON.stringify(initial));
  return initial;
}

function saveChats(chats) {
  localStorage.setItem("mt_chats", JSON.stringify(chats));
}

function addMessageControls(element, msg, chatId, index) {
  if (!element || element.querySelector(".msg-actions")) return;

  const actions = document.createElement("div");
  actions.className = "msg-actions";
  actions.style.cssText = "display:flex; gap:12px; margin-top:6px; font-size:12px; opacity:0.85;";

  // Copy
  const copyBtn = document.createElement("span");
  copyBtn.innerHTML = "📋 Copy";
  copyBtn.style.cursor = "pointer";
  copyBtn.onclick = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(msg.text);
    copyBtn.innerHTML = "✓ Copied";
    setTimeout(() => copyBtn.innerHTML = "📋 Copy", 2000);
  };
  actions.appendChild(copyBtn);

  // Regenerate (AI only)
  if (msg.sender === "ai") {
    const regenBtn = document.createElement("span");
    regenBtn.innerHTML = "🔄 Regenerate";
    regenBtn.style.cursor = "pointer";
    regenBtn.onclick = (e) => {
      e.stopPropagation();
      let chats = getSavedChats();
      let c = chats.find(item => item.id === chatId);
      if (c && c.history.length > index) {
        c.history.splice(index);
        saveChats(chats);
        openActiveChat(chatId);
      }
    };
    actions.appendChild(regenBtn);
  }

  // Delete
  const delBtn = document.createElement("span");
  delBtn.innerHTML = "🗑️ Delete";
  delBtn.style.color = "#ff7b72";
  delBtn.style.cursor = "pointer";
  delBtn.onclick = (e) => {
    e.stopPropagation();
    let chats = getSavedChats();
    let c = chats.find(item => item.id === chatId);
    if (c) {
      c.history.splice(index, 1);
      saveChats(chats);
      openActiveChat(chatId);
    }
  };
  actions.appendChild(delBtn);

  element.appendChild(actions);
}

function openActiveChat(chatId) {
  if (!chatId) chatId = "lost-archivist";
  localStorage.setItem("mt_active_chat", chatId);

  const box = document.getElementById("chat-messages");
  if (!box) return;

  let chats = getSavedChats();
  let chat = chats.find(c => c.id === chatId);

  if (!chat) {
    chat = { id: chatId, name: "Active Session", history: [] };
    chats.push(chat);
    saveChats(chats);
  }

  box.innerHTML = "";

  chat.history.forEach((msg, idx) => {
    const msgEl = document.createElement("div");
    msgEl.style.marginBottom = "10px";
    msgEl.style.padding = "10px 14px";
    msgEl.style.borderRadius = "8px";

    if (msg.sender === "ai") {
      msgEl.style.background = "#151026";
      msgEl.style.border = "1px solid #2b204e";
      msgEl.innerHTML = typeof formatRP === "function" ? formatRP(msg.text) : msg.text;
    } else {
      msgEl.style.background = "#2b204e";
      msgEl.style.color = "#fff";
      msgEl.textContent = msg.text;
    }

    addMessageControls(msgEl, msg, chatId, idx);
    box.appendChild(msgEl);
  });

  box.scrollTop = box.scrollHeight;
}

// Auto-restore chat on boot
window.addEventListener("DOMContentLoaded", () => {
  const activeId = localStorage.getItem("mt_active_chat") || "lost-archivist";
  openActiveChat(activeId);
});

window.openActiveChat = openActiveChat;
window.getSavedChats = getSavedChats;
window.saveChats = saveChats;
