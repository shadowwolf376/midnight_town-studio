// --- STATE CONTROLLER WITH PINNING & TAGS ---
function getSavedChats() {
  let chats = [];
  try {
    chats = JSON.parse(localStorage.getItem("m_chats")) || [];
  } catch(e) {}
  
  if (!chats || chats.length === 0) {
    chats = [{
      id: "lost-archivist",
      name: "The Lost Archivist",
      avatar: "🏛️",
      msg: "Ready to chat...",
      time: new Date().toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"}),
      isPinned: true,
      tag: "Favorites",
      history: [
        { sender: "ai", text: "*The Archivist adjusts his lantern, casting warm light across the ancient leather-bound tomes.* **Welcome, traveler.** What secrets do you seek in MidnightTown tonight?" }
      ]
    }];
    localStorage.setItem("m_chats", JSON.stringify(chats));
  }
  return chats;
}

function saveChats(chats) {
  localStorage.setItem("m_chats", JSON.stringify(chats));
}

// Global active tag state
let currentActiveTag = "All";

// --- FORMATTER FOR ROLEPLAY TEXT ---
function formatRoleplayText(text) {
  if (!text) return "";
  let safe = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong style="color: #ffffff; font-weight: bold;">$1</strong>');
  safe = safe.replace(/\*([^*]+)\*/g, '<span style="color: #c4b5fd; font-style: italic;">$1</span>');
  safe = safe.replace(/"([^"]+)"/g, '<span style="color: #ffffff;">"$1"</span>');
  return safe.replace(/\n/g, '<br>');
}

// --- RENDER CHAT LIST WITH PINNING & FILTER TAGS ---
function renderChatList() {
  const el = document.getElementById("view-chats");
  if (!el) return;
  
  el.style.display = "block";
  el.style.background = "#0b0813";
  el.style.minHeight = "100vh";
  el.style.color = "#ffffff";
  el.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  el.innerHTML = "";
  
  const container = document.createElement("div");
  container.style.padding = "16px";
  
  // Header Row
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.marginBottom = "14px";

  const chatsTab = document.createElement("span");
  chatsTab.textContent = "Chats";
  chatsTab.style.fontSize = "22px";
  chatsTab.style.fontWeight = "bold";
  chatsTab.style.color = "#f3f0ff";
  header.appendChild(chatsTab);

  container.appendChild(header);

  // TAG FILTER PILLS BAR
  const tagsRow = document.createElement("div");
  tagsRow.style.display = "flex";
  tagsRow.style.gap = "8px";
  tagsRow.style.marginBottom = "16px";
  tagsRow.style.overflowX = "auto";
  tagsRow.style.paddingBottom = "4px";

  const tagsList = ["All", "Favorites", "Roleplay", "Archived"];
  tagsList.forEach(tagName => {
    const pill = document.createElement("button");
    pill.textContent = tagName;
    pill.style.padding = "6px 14px";
    pill.style.borderRadius = "20px";
    pill.style.fontSize = "13px";
    pill.style.fontWeight = "bold";
    pill.style.cursor = "pointer";
    pill.style.border = "none";
    
    if (currentActiveTag === tagName) {
      pill.style.background = "linear-gradient(135deg, #8b5cf6, #d946ef)";
      pill.style.color = "#ffffff";
    } else {
      pill.style.background = "#151026";
      pill.style.color = "#948aa9";
      pill.style.border = "1px solid #2b204e";
    }

    pill.onclick = function() {
      currentActiveTag = tagName;
      renderChatList();
    };

    tagsRow.appendChild(pill);
  });

  container.appendChild(tagsRow);

  // CONVERSATION LIST SORTING (Pinned items first)
  let chats = getSavedChats();

  // Filter by selected tag tab
  if (currentActiveTag === "Favorites") {
    chats = chats.filter(c => c.isPinned || c.tag === "Favorites");
  } else if (currentActiveTag !== "All") {
    chats = chats.filter(c => c.tag === currentActiveTag);
  }

  // Sort: Pinned chats always on top
  chats.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  if (chats.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.style.textAlign = "center";
    emptyState.style.padding = "30px 10px";
    emptyState.style.color = "#948aa9";
    emptyState.style.fontSize = "14px";
    emptyState.textContent = `No chats found under "${currentActiveTag}".`;
    container.appendChild(emptyState);
  }

  chats.forEach(c => {
    const card = document.createElement("div");
    card.style.display = "flex";
    card.style.alignItems = "center";
    card.style.gap = "12px";
    card.style.padding = "12px";
    card.style.background = c.isPinned ? "#1f1838" : "#151026";
    card.style.borderRadius = "12px";
    card.style.marginBottom = "10px";
    card.style.border = c.isPinned ? "1px solid #8b5cf6" : "1px solid #2b204e";
    card.style.cursor = "pointer";
    
    // Avatar
    const avatar = document.createElement("div");
    avatar.style.width = "48px";
    avatar.style.height = "48px";
    avatar.style.borderRadius = "50%";
    avatar.style.background = "#2b204e";
    avatar.style.display = "flex";
    avatar.style.justifyContent = "center";
    avatar.style.alignItems = "center";
    avatar.style.fontSize = "22px";
    avatar.textContent = c.avatar || "👤";
    card.appendChild(avatar);

    // Main Details
    const textCol = document.createElement("div");
    textCol.style.flex = "1";
    textCol.style.overflow = "hidden";

    const titleRow = document.createElement("div");
    titleRow.style.display = "flex";
    titleRow.style.justifyContent = "space-between";

    const name = document.createElement("div");
    name.style.color = "#ffffff";
    name.style.fontWeight = "bold";
    name.style.fontSize = "16px";
    name.textContent = c.name;
    titleRow.appendChild(name);

    const time = document.createElement("div");
    time.style.color = "#948aa9";
    time.style.fontSize = "12px";
    time.textContent = c.time || "Recently";
    titleRow.appendChild(time);

    textCol.appendChild(titleRow);

    const subtitle = document.createElement("div");
    subtitle.style.color = "#948aa9";
    subtitle.style.fontSize = "13px";
    subtitle.style.marginTop = "4px";
    subtitle.style.whiteSpace = "nowrap";
    subtitle.style.overflow = "hidden";
    subtitle.style.textOverflow = "ellipsis";
    
    const rawLastMsg = c.history && c.history.length ? c.history[c.history.length - 1].text : "No messages yet";
    subtitle.textContent = rawLastMsg.replace(/[\*\"]/g, "");
    textCol.appendChild(subtitle);

    card.appendChild(textCol);

    // PIN TOGGLE STAR ICON BUTTON
    const pinBtn = document.createElement("div");
    pinBtn.textContent = c.isPinned ? "⭐" : "☆";
    pinBtn.style.fontSize = "20px";
    pinBtn.style.cursor = "pointer";
    pinBtn.style.padding = "4px";
    pinBtn.title = c.isPinned ? "Unpin chat" : "Pin chat to top";
    
    pinBtn.onclick = function(e) {
      e.stopPropagation();
      let allChats = getSavedChats();
      let target = allChats.find(item => item.id === c.id);
      if (target) {
        target.isPinned = !target.isPinned;
        saveChats(allChats);
        renderChatList();
      }
    };
    card.appendChild(pinBtn);

    card.onclick = function() {
      openActiveChat(c.id);
    };

    container.appendChild(card);
  });

  el.appendChild(container);
}

// --- RENDER ACTIVE CHAT SESSION ---
function openActiveChat(chatId) {
  const chats = getSavedChats();
  let chat = chats.find(c => c.id === chatId) || chats[0];

  const el = document.getElementById("view-chats");
  if (!el) return;
  el.style.display = "block";
  el.style.background = "#0b0813";
  el.innerHTML = "";

  const container = document.createElement("div");
  container.style.padding = "16px";

  // Header Bar
  const topBar = document.createElement("div");
  topBar.style.display = "flex";
  topBar.style.alignItems = "center";
  topBar.style.justifyContent = "space-between";
  topBar.style.marginBottom = "14px";

  const backBtn = document.createElement("button");
  backBtn.textContent = "← Back";
  backBtn.style.background = "#151026";
  backBtn.style.color = "#ffffff";
  backBtn.style.border = "1px solid #2b204e";
  backBtn.style.padding = "8px 14px";
  backBtn.style.borderRadius = "20px";
  backBtn.style.cursor = "pointer";
  backBtn.onclick = function() { renderChatList(); };
  topBar.appendChild(backBtn);

  const title = document.createElement("h3");
  title.style.color = "#ffffff";
  title.style.margin = "0";
  title.style.fontSize = "17px";
  title.textContent = chat.name;
  topBar.appendChild(title);

  const resetBtn = document.createElement("button");
  resetBtn.textContent = "🔄 Reset";
  resetBtn.style.background = "#2b142b";
  resetBtn.style.color = "#d946ef";
  resetBtn.style.border = "1px solid #5b215b";
  resetBtn.style.padding = "8px 12px";
  resetBtn.style.borderRadius = "20px";
  resetBtn.style.cursor = "pointer";
  resetBtn.onclick = function() {
    if (confirm("Reset conversation history?")) {
      chat.history = [{ sender: "ai", text: "*The scene resets.* \"Let us start from the beginning once more.\"" }];
      saveChats(chats);
      openActiveChat(chatId);
    }
  };
  topBar.appendChild(resetBtn);

  container.appendChild(topBar);

  // Chat Box Container
  const box = document.createElement("div");
  box.id = "chat-box";
  box.style.height = "calc(100vh - 200px)";
  box.style.overflowY = "auto";
  box.style.padding = "10px 0";

  if (chat.history) {
    chat.history.forEach((m, idx) => {
      renderSingleMessageUI(box, chat, m, idx);
    });
  }

  container.appendChild(box);

  // Input Row
  const inputRow = document.createElement("div");
  inputRow.style.display = "flex";
  inputRow.style.gap = "8px";
  inputRow.style.marginTop = "10px";

  const input = document.createElement("input");
  input.id = "chat-in";
  input.placeholder = "Type your response (*action*)...";
  input.style.flex = "1";
  input.style.background = "#151026";
  input.style.border = "1px solid #2b204e";
  input.style.color = "#ffffff";
  input.style.padding = "12px 16px";
  input.style.borderRadius = "24px";
  input.style.outline = "none";
  input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMsg(chat.id);
  });

  const sendBtn = document.createElement("button");
  sendBtn.textContent = "Send";
  sendBtn.style.background = "linear-gradient(135deg, #8b5cf6, #d946ef)";
  sendBtn.style.color = "#ffffff";
  sendBtn.style.border = "none";
  sendBtn.style.padding = "12px 20px";
  sendBtn.style.borderRadius = "24px";
  sendBtn.style.fontWeight = "bold";
  sendBtn.style.cursor = "pointer";
  sendBtn.onclick = function() { sendMsg(chat.id); };

  inputRow.appendChild(input);
  inputRow.appendChild(sendBtn);
  container.appendChild(inputRow);

  el.appendChild(container);
  setTimeout(() => { box.scrollTop = box.scrollHeight; }, 50);
}

// --- RENDER SINGLE MESSAGE BUBBLE & ACTIONS ---
function renderSingleMessageUI(box, chat, msg, idx) {
  const msgWrapper = document.createElement("div");
  msgWrapper.style.marginBottom = "16px";

  const msgEl = document.createElement("div");
  msgEl.style.padding = "12px 16px";
  msgEl.style.borderRadius = "16px";
  msgEl.style.maxWidth = "85%";
  msgEl.style.wordBreak = "break-word";
  msgEl.style.fontSize = "14px";
  msgEl.style.lineHeight = "1.5";

  if (msg.sender === "user") {
    msgEl.style.background = "linear-gradient(135deg, #8b5cf6, #7c3aed)";
    msgEl.style.color = "#ffffff";
    msgEl.style.marginLeft = "auto";
    msgEl.style.borderBottomRightRadius = "4px";
    msgEl.innerHTML = formatRoleplayText(msg.text);
    msgWrapper.appendChild(msgEl);
  } else {
    msgEl.style.background = "#151026";
    msgEl.style.color = "#e2d9f3";
    msgEl.style.border = "1px solid #2b204e";
    msgEl.style.borderBottomLeftRadius = "4px";
    msgEl.innerHTML = formatRoleplayText(msg.text);
    msgWrapper.appendChild(msgEl);

    // AI MESSAGE ACTION ROW
    const actionRow = document.createElement("div");
    actionRow.style.display = "flex";
    actionRow.style.gap = "12px";
    actionRow.style.marginTop = "6px";
    actionRow.style.paddingLeft = "4px";
    actionRow.style.fontSize = "12px";

    const copyBtn = createActionButton("📋 Copy", function() {
      navigator.clipboard.writeText(msg.text);
      copyBtn.textContent = "✅ Copied";
      setTimeout(() => copyBtn.textContent = "📋 Copy", 1500);
    });
    actionRow.appendChild(copyBtn);

    const regenBtn = createActionButton("🔄 Regenerate", function() {
      chat.history.splice(idx, 1);
      saveChats(getSavedChats());
      triggerAiResponse(chat.id);
    });
    actionRow.appendChild(regenBtn);

    const editBtn = createActionButton("✏️ Edit", function() {
      const newText = prompt("Edit AI response:", msg.text);
      if (newText !== null && newText.trim() !== "") {
        msg.text = newText.trim();
        saveChats(getSavedChats());
        openActiveChat(chat.id);
      }
    });
    actionRow.appendChild(editBtn);

    const quoteBtn = createActionButton("💬 Quote", function() {
      const input = document.getElementById("chat-in");
      if (input) {
        input.value = `> "${msg.text.slice(0, 40)}..."\n` + input.value;
        input.focus();
      }
    });
    actionRow.appendChild(quoteBtn);

    msgWrapper.appendChild(actionRow);
  }

  box.appendChild(msgWrapper);
}

function createActionButton(label, onClick) {
  const btn = document.createElement("span");
  btn.textContent = label;
  btn.style.color = "#948aa9";
  btn.style.cursor = "pointer";
  btn.style.userSelect = "none";
  btn.onmouseover = () => btn.style.color = "#d946ef";
  btn.onmouseout = () => btn.style.color = "#948aa9";
  btn.onclick = onClick;
  return btn;
}

// --- SEND MESSAGE & SIMULATE RESPONSES ---
function sendMsg(chatId) {
  const inEl = document.getElementById("chat-in");
  if (!inEl || !inEl.value.trim()) return;

  const userText = inEl.value.trim();
  inEl.value = "";

  const chats = getSavedChats();
  let chat = chats.find(c => c.id === chatId);
  if (!chat) return;

  chat.history.push({ sender: "user", text: userText });
  chat.time = new Date().toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"});
  saveChats(chats);

  openActiveChat(chatId);
  triggerAiResponse(chatId);
}

function triggerAiResponse(chatId) {
  const chats = getSavedChats();
  let chat = chats.find(c => c.id === chatId);
  if (!chat) return;

  const box = document.getElementById("chat-box");

  const typingEl = document.createElement("div");
  typingEl.id = "typing-indicator";
  typingEl.style.color = "#8b5cf6";
  typingEl.style.fontSize = "13px";
  typingEl.style.fontStyle = "italic";
  typingEl.style.marginBottom = "10px";
  typingEl.textContent = `${chat.name} is thinking...`;
  box.appendChild(typingEl);
  box.scrollTop = box.scrollHeight;

  setTimeout(() => {
    const tInd = document.getElementById("typing-indicator");
    if (tInd) tInd.remove();

    const responses = [
      "*Nods thoughtfully, examining your expressions.* **\"Your words hold a deeper meaning than you realize.** Tell me, what drives your search?\"",
      "*Steps closer, the shadows lengthening around us.* **\"An intriguing response.** Few who enter MidnightTown speak with such conviction.\"",
      "*A faint smile touches their lips as they lean back.* **\"If that is your decision,** then let us proceed carefully.\""
    ];

    const aiReply = responses[Math.floor(Math.random() * responses.length)];
    chat.history.push({ sender: "ai", text: aiReply });
    saveChats(chats);

    openActiveChat(chatId);
  }, 1200);
}

window.openActiveChat = openActiveChat;
window.renderChatList = renderChatList;
