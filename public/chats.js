
function getSavedChats() {
  let chats = [];
  try {
    chats = JSON.parse(localStorage.getItem("m_chats")) || [];
  } catch(e) {}
  
  if (!chats || chats.length === 0) {
    chats = [{
      name: "The Lost Archivist",
      msg: "Ready to chat"
    }];
    localStorage.setItem("m_chats", JSON.stringify(chats));
  }
  return chats;
}

function renderChatList() {
  const el = document.getElementById("view-chats");
  if (!el) return;
  el.innerHTML = "";
  
  const wrapper = document.createElement("div");
  wrapper.style.padding = "15px";
  
  const heading = document.createElement("h2");
  heading.style.color = "#fff";
  heading.style.marginBottom = "12px";
  heading.textContent = "Your chats";
  wrapper.appendChild(heading);
  
  const chats = getSavedChats();
  chats.forEach(c => {
    const card = document.createElement("div");
    card.style.background = "#150f2e";
    card.style.padding = "12px";
    card.style.borderRadius = "8px";
    card.style.marginBottom = "8px";
    card.style.border = "1px solid #2a1f52";
    card.style.cursor = "pointer";
    
    const title = document.createElement("b");
    title.style.color = "#fff";
    title.textContent = "💬 " + c.name;
    card.appendChild(title);
    
    const subtitle = document.createElement("p");
    subtitle.style.color = "#aaa";
    subtitle.style.margin = "4px 0 0";
    subtitle.style.fontSize = "12px";
    subtitle.textContent = c.msg;
    card.appendChild(subtitle);
    
    card.addEventListener("click", function(e) {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
      openActiveChat(c.name);
    });
    
    wrapper.appendChild(card);
  });
  
  el.appendChild(wrapper);
}

function openActiveChat(name) {
  const el = document.getElementById("view-chats");
  if (!el) return;
  el.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.style.padding = "15px";

  const topBar = document.createElement("div");
  topBar.style.display = "flex";
  topBar.style.alignItems = "center";
  topBar.style.gap = "10px";
  topBar.style.marginBottom = "12px";

  const backBtn = document.createElement("button");
  backBtn.textContent = "← Back";
  backBtn.style.background = "#251a52";
  backBtn.style.color = "#fff";
  backBtn.style.border = "1px solid #2a1f52";
  backBtn.style.padding = "6px 12px";
  backBtn.style.borderRadius = "6px";
  backBtn.style.cursor = "pointer";
  backBtn.addEventListener("click", function(e) {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
    renderChatList();
  });
  topBar.appendChild(backBtn);

  const title = document.createElement("h3");
  title.style.color = "#fff";
  title.style.margin = "0";
  title.textContent = "💬 " + name;
  topBar.appendChild(title);
  wrapper.appendChild(topBar);

  const box = document.createElement("div");
  box.id = "chat-box";
  box.style.height = "320px";
  box.style.background = "#150f2e";
  box.style.border = "1px solid #2a1f52";
  box.style.borderRadius = "8px";
  box.style.padding = "10px";
  box.style.overflowY = "auto";
  box.style.marginBottom = "10px";

  const notice = document.createElement("div");
  notice.style.background = "#251a52";
  notice.style.color = "#ff6600";
  notice.style.padding = "8px";
  notice.style.borderRadius = "6px";
  notice.style.fontSize = "12px";
  notice.style.marginBottom = "8px";
  notice.innerHTML = "✨ Active session loaded for <b>" + name + "</b>";
  box.appendChild(notice);
  wrapper.appendChild(box);

  const inputRow = document.createElement("div");
  inputRow.style.display = "flex";
  inputRow.style.gap = "8px";

  const input = document.createElement("input");
  input.id = "chat-in";
  input.placeholder = "Type a message...";
  input.style.flex = "1";
  input.style.background = "#150f2e";
  input.style.border = "1px solid #2a1f52";
  input.style.color = "#fff";
  input.style.padding = "8px";
  input.style.borderRadius = "6px";
  input.style.outline = "none";
  inputRow.appendChild(input);

  const sendBtn = document.createElement("button");
  sendBtn.textContent = "Send";
  sendBtn.style.background = "#ff6600";
  sendBtn.style.color = "#fff";
  sendBtn.style.border = "none";
  sendBtn.style.padding = "8px 16px";
  sendBtn.style.borderRadius = "6px";
  sendBtn.style.fontWeight = "bold";
  sendBtn.style.cursor = "pointer";
  sendBtn.addEventListener("click", function(e) {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
    sendMsg(name);
  });
  inputRow.appendChild(sendBtn);

  wrapper.appendChild(inputRow);
  el.appendChild(wrapper);
}

function sendMsg(name) {
  const inEl = document.getElementById("chat-in");
  if (!inEl || !inEl.value.trim()) return;
  const box = document.getElementById("chat-box");
  const val = inEl.value;
  
  const userMsg = document.createElement("div");
  userMsg.style.background = "#2e2354";
  userMsg.style.color = "#fff";
  userMsg.style.padding = "8px";
  userMsg.style.borderRadius = "6px";
  userMsg.style.marginBottom = "6px";
  userMsg.style.textAlign = "right";
  userMsg.textContent = val;
  box.appendChild(userMsg);
  
  inEl.value = "";
  box.scrollTop = box.scrollHeight;

  // Typing / Thinking Indicator
  const typingId = "typing-" + Date.now();
  const typingEl = document.createElement("div");
  typingEl.id = typingId;
  typingEl.style.background = "#251a52";
  typingEl.style.color = "#ff6600";
  typingEl.style.padding = "8px";
  typingEl.style.borderRadius = "6px";
  typingEl.style.marginBottom = "6px";
  typingEl.style.border = "1px solid #2a1f52";
  typingEl.style.fontStyle = "italic";
  typingEl.textContent = name + " is thinking...";
  box.appendChild(typingEl);
  box.scrollTop = box.scrollHeight;

  setTimeout(() => {
    const tEl = document.getElementById(typingId);
    if (tEl) tEl.remove();

    const aiMsg = document.createElement("div");
    aiMsg.style.background = "#251a52";
    aiMsg.style.color = "#fff";
    aiMsg.style.padding = "8px";
    aiMsg.style.borderRadius = "6px";
    aiMsg.style.marginBottom = "6px";
    aiMsg.style.border = "1px solid #2a1f52";
    aiMsg.textContent = "I received your message. Let us continue the story...";
    box.appendChild(aiMsg);
    box.scrollTop = box.scrollHeight;

    let chats = getSavedChats();
    let idx = chats.findIndex(c => c.name === name);
    if (idx >= 0) { 
      chats[idx].msg = "Last active: " + new Date().toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"}); 
      localStorage.setItem("m_chats", JSON.stringify(chats)); 
    }
  }, 1400);
}

window.openActiveChat = openActiveChat;
window.renderChatList = renderChatList;
window.sendMsg = sendMsg;

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(renderChatList, 100);
});
