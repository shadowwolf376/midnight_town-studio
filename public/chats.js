// --- STATE & LOCAL STORAGE CONTROLLER ---
function getSavedChats() {
  let chats = [];
  try {
    chats = JSON.parse(localStorage.getItem("m_chats")) || [];
  } catch(e) {}
  
  if (!chats || chats.length === 0) {
    chats = [{
      id: "lost-archivist",
      name: "The Lost Archivist",
      msg: "Ready to chat",
      time: new Date().toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"}),
      history: [
        { sender: "ai", text: "Welcome to the chat! Type a message below to begin your journey." }
      ]
    }];
    localStorage.setItem("m_chats", JSON.stringify(chats));
  }
  return chats;
}

function saveChats(chats) {
  localStorage.setItem("m_chats", JSON.stringify(chats));
}

// --- RENDER CHAT LIST ---
function renderChatList() {
  const el = document.getElementById("view-chats");
  if (!el) return;
  
  el.style.display = "block";
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
    title.style.display = "block";
    title.textContent = "💬 " + c.name;
    card.appendChild(title);
    
    const subtitle = document.createElement("p");
    subtitle.style.color = "#aaa";
    subtitle.style.margin = "4px 0 0";
    subtitle.style.fontSize = "12px";
    subtitle.textContent = "Last active: " + (c.time || "Recently") + " • " + c.msg;
    card.appendChild(subtitle);
    
    // Encapsulated event handler - Direct State Trigger
    card.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      openActiveChat(c.id);
    });
    
    wrapper.appendChild(card);
  });
  
  el.appendChild(wrapper);
}

// --- RENDER ACTIVE CHAT SESSION ---
function openActiveChat(chatId) {
  const chats = getSavedChats();
  let chat = chats.find(c => c.id === chatId);
  
  if (!chat) {
    chat = {
      id: chatId,
      name: chatId,
      msg: "Active session",
      time: new Date().toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"}),
      history: [{ sender: "ai", text: "Welcome to the chat!" }]
    };
  }

  const el = document.getElementById("view-chats");
  if (!el) return;
  el.style.display = "block";
  el.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.style.padding = "15px";

  // Top Navigation Bar
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
    e.preventDefault();
    renderChatList();
  });
  topBar.appendChild(backBtn);

  const title = document.createElement("h3");
  title.style.color = "#fff";
  title.style.margin = "0";
  title.textContent = "💬 " + chat.name;
  topBar.appendChild(title);
  wrapper.appendChild(topBar);

  // Chat Box Container
  const box = document.createElement("div");
  box.id = "chat-box";
  box.style.height = "340px";
  box.style.background = "#150f2e";
  box.style.border = "1px solid #2a1f52";
  box.style.borderRadius = "8px";
  box.style.padding = "10px";
  box.style.overflowY = "auto";
  box.style.marginBottom = "10px";

  // Render Saved History
  if (chat.history && chat.history.length > 0) {
    chat.history.forEach(msg => {
      appendMessageUI(box, msg.sender, msg.text);
    });
  }

  wrapper.appendChild(box);

  // Input Row
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
  
  input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMsg(chat.id);
    }
  });

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
    e.preventDefault();
    sendMsg(chat.id);
  });
  inputRow.appendChild(sendBtn);

  wrapper.appendChild(inputRow);
  el.appendChild(wrapper);

  // Auto Scroll to bottom on load
  setTimeout(() => { box.scrollTop = box.scrollHeight; }, 50);
}

// --- UTILITY: APPEND MESSAGE UI ---
function appendMessageUI(box, sender, text) {
  const msgEl = document.createElement("div");
  msgEl.style.padding = "8px 12px";
  msgEl.style.borderRadius = "6px";
  msgEl.style.marginBottom = "8px";
  msgEl.style.maxWidth = "85%";
  msgEl.style.wordBreak = "break-word";

  if (sender === "user") {
    msgEl.style.background = "#ff6600";
    msgEl.style.color = "#fff";
    msgEl.style.marginLeft = "auto";
    msgEl.style.textAlign = "right";
  } else {
    msgEl.style.background = "#251a52";
    msgEl.style.color = "#fff";
    msgEl.style.border = "1px solid #2a1f52";
  }

  msgEl.textContent = text;
  box.appendChild(msgEl);
  box.scrollTop = box.scrollHeight;
}

// --- SEND MESSAGE & PERSIST STATE ---
function sendMsg(chatId) {
  const inEl = document.getElementById("chat-in");
  if (!inEl || !inEl.value.trim()) return;
  
  const box = document.getElementById("chat-box");
  const userText = inEl.value.trim();
  inEl.value = "";

  appendMessageUI(box, "user", userText);

  let chats = getSavedChats();
  let chat = chats.find(c => c.id === chatId);
  if (!chat) {
    chat = { id: chatId, name: chatId, history: [] };
    chats.push(chat);
  }

  if (!chat.history) chat.history = [];
  chat.history.push({ sender: "user", text: userText });
  
  const currentTime = new Date().toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"});
  chat.time = currentTime;
  chat.msg = userText;
  saveChats(chats);

  // Show Typing Indicator
  const typingId = "typing-" + Date.now();
  const typingEl = document.createElement("div");
  typingEl.id = typingId;
  typingEl.style.background = "#251a52";
  typingEl.style.color = "#ff6600";
  typingEl.style.padding = "8px";
  typingEl.style.borderRadius = "6px";
  typingEl.style.marginBottom = "8px";
  typingEl.style.border = "1px solid #2a1f52";
  typingEl.style.fontStyle = "italic";
  typingEl.textContent = chat.name + " is typing...";
  box.appendChild(typingEl);
  box.scrollTop = box.scrollHeight;

  // AI Response Simulation
  setTimeout(() => {
    const tEl = document.getElementById(typingId);
    if (tEl) tEl.remove();

    const aiResponse = "I have recorded your message in the ledger. What shall we explore next?";
    appendMessageUI(box, "ai", aiResponse);

    chat.history.push({ sender: "ai", text: aiResponse });
    saveChats(chats);
  }, 1200);
}

// Global Exports
window.openActiveChat = openActiveChat;
window.renderChatList = renderChatList;
window.sendMsg = sendMsg;
