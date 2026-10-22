// --- MIDNIGHTTOWN CHAT CONTROLLER ---

function getSavedChats() {
  try {
    const data = localStorage.getItem("mt_chats");
    if (data) return JSON.parse(data);
  } catch(e) {}

  const initial = [{
    id: "lost-archivist",
    name: "The Lost Archivist",
    avatar: "🕯️",
    updatedAt: "Today",
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

// Render Emochi-style list on the Chats tab
function renderChatsList() {
  const container = document.getElementById("saved-chats-list");
  if (!container) return;

  const chats = getSavedChats();
  container.innerHTML = "";

  if (chats.length === 0) {
    container.innerHTML = `<div style="text-align:center; color:#888; padding:20px;">No active chat sessions found.</div>`;
    return;
  }

  chats.forEach(chat => {
    const lastMsg = chat.history.length > 0 ? chat.history[chat.history.length - 1].text : "No messages yet";
    const shortSnippet = lastMsg.length > 45 ? lastMsg.substring(0, 45) + "..." : lastMsg;

    const item = document.createElement("div");
    item.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #130f26;
      border: 1px solid #432c7a;
      border-radius: 12px;
      margin-bottom: 10px;
      cursor: pointer;
    `;

    item.innerHTML = `
      <div style="font-size:24px; background:#2b204e; width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center;">
        ${chat.avatar || "💬"}
      </div>
      <div style="flex:1; overflow:hidden;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong style="color:#fff; font-size:15px;">${chat.name}</strong>
          <span style="font-size:11px; color:#888;">${chat.updatedAt || "Active"}</span>
        </div>
        <div style="font-size:12px; color:#aaa; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:3px;">
          ${shortSnippet}
        </div>
      </div>
    `;

    item.onclick = () => {
      openActiveChat(chat.id);
      if (typeof switchView === "function") switchView("chat-room");
    };

    container.appendChild(item);
  });
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

  // Regenerate
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
    chat = { id: chatId, name: "Active Session", avatar: "💬", history: [] };
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
  renderChatsList();
}

window.addEventListener("DOMContentLoaded", () => {
  renderChatsList();
  const activeId = localStorage.getItem("mt_active_chat") || "lost-archivist";
  openActiveChat(activeId);
});

window.openActiveChat = openActiveChat;
window.renderChatsList = renderChatsList;
window.getSavedChats = getSavedChats;
window.saveChats = saveChats;
