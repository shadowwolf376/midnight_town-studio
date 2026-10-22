// --- MIDNIGHTTOWN CHAT CONTROLLER ---

function getSavedChats() {
  try {
    const data = localStorage.getItem("mt_chats");
    if (data && JSON.parse(data).length > 0) return JSON.parse(data);
  } catch(e) {}

  const initial = [
    {
      id: "lost-archivist",
      name: "The Lost Archivist",
      avatar: "🕯️",
      updatedAt: "Today",
      history: [
        { sender: "ai", text: "*The room is dim, illuminated only by the flickering glow...* Welcome to Shadow Vale, traveler." }
      ]
    },
    {
      id: "harley-sawyer",
      name: "Harley Sawyer",
      avatar: "👁️",
      updatedAt: "07/31",
      history: [
        { sender: "ai", text: "*Sam pushes off from the doorframe and takes a step closer...*" }
      ]
    }
  ];
  localStorage.setItem("mt_chats", JSON.stringify(initial));
  return initial;
}

function renderChatsList() {
  const container = document.getElementById("saved-chats-list");
  if (!container) return;

  const chats = getSavedChats();

  // Forcefully overwrite whatever static HTML is inside
  let html = "";

  chats.forEach(chat => {
    const lastMsg = chat.history.length > 0 ? chat.history[chat.history.length - 1].text : "No messages yet";
    const shortSnippet = lastMsg.length > 45 ? lastMsg.substring(0, 45) + "..." : lastMsg;

    html += `
      <div onclick="openActiveChat('${chat.id}'); if(typeof switchView==='function')switchView('chat-room');" 
           style="display:flex; align-items:center; gap:14px; padding:14px; background:#110c24; border:1px solid #2d1f52; border-radius:14px; margin-bottom:12px; cursor:pointer;">
        <div style="font-size:22px; background:#20153f; width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          ${chat.avatar || "💬"}
        </div>
        <div style="flex:1; overflow:hidden;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <strong style="color:#fff; font-size:16px;">${chat.name}</strong>
            <span style="font-size:12px; color:#777;">${chat.updatedAt || "Recent"}</span>
          </div>
          <div style="font-size:13px; color:#aaa; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${shortSnippet}
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function openActiveChat(chatId) {
  if (!chatId) return;
  localStorage.setItem("mt_active_chat", chatId);

  const box = document.getElementById("chat-messages");
  if (!box) return;

  let chats = getSavedChats();
  let chat = chats.find(c => c.id === chatId);

  if (!chat) return;

  box.innerHTML = "";

  chat.history.forEach((msg) => {
    const msgEl = document.createElement("div");
    msgEl.style.marginBottom = "10px";
    msgEl.style.padding = "10px 14px";
    msgEl.style.borderRadius = "8px";

    if (msg.sender === "ai") {
      msgEl.style.background = "#151026";
      msgEl.style.border = "1px solid #2b204e";
      msgEl.style.color = "#eee";
      msgEl.innerHTML = typeof formatRP === "function" ? formatRP(msg.text) : msg.text;
    } else {
      msgEl.style.background = "#2b204e";
      msgEl.style.color = "#fff";
      msgEl.textContent = msg.text;
    }
    box.appendChild(msgEl);
  });

  box.scrollTop = box.scrollHeight;
}

// Automatically render when DOM loads and when window gains focus
document.addEventListener("DOMContentLoaded", renderChatsList);
window.addEventListener("focus", renderChatsList);

window.renderChatsList = renderChatsList;
window.openActiveChat = openActiveChat;
