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

// --- EXPORT CHATS TO JSON FILE ---
function exportChats() {
  const chats = getSavedChats();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(chats, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", "midnight_town_chats_backup.json");
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// --- IMPORT CHATS FROM JSON FILE ---
function importChats(event) {
  const fileReader = new FileReader();
  if (event.target.files && event.target.files[0]) {
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      try {
        const importedChats = JSON.parse(e.target.result);
        if (Array.isArray(importedChats)) {
          saveChats(importedChats);
          alert("Chats successfully imported!");
          renderChatList();
        } else {
          alert("Invalid backup file format.");
        }
      } catch (err) {
        alert("Failed to parse JSON backup file.");
      }
    };
  }
}

// --- RENDER CHAT LIST WITH SEARCH & BACKUPS ---
function renderChatList(filterQuery = "") {
  const el = document.getElementById("view-chats");
  if (!el) return;
  
  el.style.display = "block";
  el.innerHTML = "";
  
  const chats = getSavedChats();
  const query = filterQuery.toLowerCase().trim();
  
  const filteredChats = chats.filter(c => 
    c.name.toLowerCase().includes(query) || 
    (c.msg && c.msg.toLowerCase().includes(query))
  );
  
  const wrapper = document.createElement("div");
  wrapper.style.padding = "15px";
  
  // Header with dynamic chat count
  const headerRow = document.createElement("div");
  headerRow.style.display = "flex";
  headerRow.style.justifyContent = "space-between";
  headerRow.style.alignItems = "center";
  headerRow.style.marginBottom = "12px";

  const heading = document.createElement("h2");
  heading.style.color = "#fff";
  heading.style.margin = "0";
  heading.textContent = "Your chats";
  headerRow.appendChild(heading);

  const countBadge = document.createElement("span");
  countBadge.style.color = "#8c82a8";
  countBadge.style.fontSize = "14px";
  countBadge.textContent = chats.length + (chats.length === 1 ? " chat" : " chats");
  headerRow.appendChild(countBadge);

  wrapper.appendChild(headerRow);

  // Backup Action Buttons Bar (Export / Import)
  const actionRow = document.createElement("div");
  actionRow.style.display = "flex";
  actionRow.style.gap = "8px";
  actionRow.style.marginBottom = "12px";

  const exportBtn = document.createElement("button");
  exportBtn.textContent = "📥 Export JSON";
  exportBtn.style.flex = "1";
  exportBtn.style.background = "#251a52";
  exportBtn.style.color = "#fff";
  exportBtn.style.border = "1px solid #2a1f52";
  exportBtn.style.padding = "8px";
  exportBtn.style.borderRadius = "8px";
  exportBtn.style.cursor = "pointer";
  exportBtn.style.fontSize = "13px";
  exportBtn.onclick = function(e) {
    e.preventDefault();
    exportChats();
  };
  actionRow.appendChild(exportBtn);

  const importLabel = document.createElement("label");
  importLabel.textContent = "📤 Import JSON";
  importLabel.style.flex = "1";
  importLabel.style.background = "#251a52";
  importLabel.style.color = "#fff";
  importLabel.style.border = "1px solid #2a1f52";
  importLabel.style.padding = "8px";
  importLabel.style.borderRadius = "8px";
  importLabel.style.textAlign = "center";
  importLabel.style.cursor = "pointer";
  importLabel.style.fontSize = "13px";
  
  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.accept = ".json";
  importInput.style.display = "none";
  importInput.onchange = importChats;
  importLabel.appendChild(importInput);
  
  actionRow.appendChild(importLabel);
  wrapper.appendChild(actionRow);

  // Search Input Bar
  const searchInput = document.createElement("input");
  searchInput.id = "chat-search-input";
  searchInput.type = "text";
  searchInput.placeholder = "Search chats...";
  searchInput.value = filterQuery;
  searchInput.style.width = "100%";
  searchInput.style.background = "#150f2e";
  searchInput.style.border = "1px solid #2a1f52";
  searchInput.style.color = "#fff";
  searchInput.style.padding = "10px";
  searchInput.style.borderRadius = "8px";
  searchInput.style.outline = "none";
  searchInput.style.marginBottom = "14px";
  
  searchInput.addEventListener("input", function(e) {
    renderChatList(e.target.value);
  });
  
  wrapper.appendChild(searchInput);
  
  // Empty State if no match
  if (filteredChats.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.style.background = "#150f2e";
    emptyState.style.padding = "20px";
    emptyState.style.borderRadius = "10px";
    emptyState.style.textAlign = "center";
    emptyState.style.color = "#8c82a8";
    emptyState.style.border = "1px solid #2a1f52";
    emptyState.textContent = "No chats found matching \"" + filterQuery + "\"";
    wrapper.appendChild(emptyState);
  }

  // Render Filtered Chat Cards
  filteredChats.forEach(c => {
    const card = document.createElement("div");
    card.style.background = "#150f2e";
    card.style.padding = "14px";
    card.style.borderRadius = "10px";
    card.style.marginBottom = "10px";
    card.style.border = "1px solid #2a1f52";
    card.style.cursor = "pointer";
    
    const title = document.createElement("b");
    title.style.color = "#fff";
    title.style.fontSize = "15px";
    title.style.display = "block";
    title.textContent = "💬 " + c.name;
    card.appendChild(title);
    
    const subtitle = document.createElement("p");
    subtitle.style.color = "#aaa";
    subtitle.style.margin = "6px 0 0";
    subtitle.style.fontSize = "12px";
    subtitle.textContent = "Last active: " + (c.time || "Recently") + " • " + c.msg;
    card.appendChild(subtitle);
    
    // Direct click handler to open active chat session
    card.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (typeof openActiveChat === "function") {
        openActiveChat(c.id);
      }
      return false;
    };
    
    wrapper.appendChild(card);
  });
  
  el.appendChild(wrapper);

  if (filterQuery) {
    setTimeout(() => {
      const input = document.getElementById("chat-search-input");
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }, 10);
  }
}

// --- RENDER ACTIVE CHAT SESSION WITH RESET BUTTON ---
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

  // Top Navigation Bar with Back & Reset Buttons
  const topBar = document.createElement("div");
  topBar.style.display = "flex";
  topBar.style.alignItems = "center";
  topBar.style.justifyContent = "space-between";
  topBar.style.marginBottom = "14px";

  const topLeft = document.createElement("div");
  topLeft.style.display = "flex";
  topLeft.style.alignItems = "center";
  topLeft.style.gap = "10px";

  const backBtn = document.createElement("button");
  backBtn.textContent = "← Back";
  backBtn.style.background = "#251a52";
  backBtn.style.color = "#fff";
  backBtn.style.border = "1px solid #2a1f52";
  backBtn.style.padding = "8px 12px";
  backBtn.style.borderRadius = "8px";
  backBtn.style.cursor = "pointer";
  backBtn.style.fontWeight = "bold";
  backBtn.onclick = function(e) {
    e.preventDefault();
    renderChatList();
  };
  topLeft.appendChild(backBtn);

  const title = document.createElement("h3");
  title.style.color = "#fff";
  title.style.margin = "0";
  title.style.fontSize = "16px";
  title.textContent = "💬 " + chat.name;
  topLeft.appendChild(title);
  
  topBar.appendChild(topLeft);

  // Clear / Reset History Button
  const resetBtn = document.createElement("button");
  resetBtn.textContent = "🔄 Reset";
  resetBtn.style.background = "#3a1b3a";
  resetBtn.style.color = "#ff8888";
  resetBtn.style.border = "1px solid #5a2b5b";
  resetBtn.style.padding = "8px 12px";
  resetBtn.style.borderRadius = "8px";
  resetBtn.style.cursor = "pointer";
  resetBtn.style.fontSize = "13px";
  resetBtn.style.fontWeight = "bold";
  resetBtn.onclick = function(e) {
    e.preventDefault();
    if (confirm("Are you sure you want to reset this chat history?")) {
      let allChats = getSavedChats();
      let targetChat = allChats.find(c => c.id === chatId);
      if (targetChat) {
        targetChat.history = [{ sender: "ai", text: "Chat history has been reset. A fresh start!" }];
        targetChat.msg = "History reset";
        targetChat.time = new Date().toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"});
        saveChats(allChats);
        openActiveChat(chatId); // Refresh view
      }
    }
  };
  topBar.appendChild(resetBtn);

  wrapper.appendChild(topBar);

  // Chat Box Container
  const box = document.createElement("div");
  box.id = "chat-box";
  box.style.height = "360px";
  box.style.background = "#150f2e";
  box.style.border = "1px solid #2a1f52";
  box.style.borderRadius = "10px";
  box.style.padding = "12px";
  box.style.overflowY = "auto";
  box.style.marginBottom = "12px";

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
  input.style.padding = "10px";
  input.style.borderRadius = "8px";
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
  sendBtn.style.padding = "10px 18px";
  sendBtn.style.borderRadius = "8px";
  sendBtn.style.fontWeight = "bold";
  sendBtn.style.cursor = "pointer";
  sendBtn.onclick = function(e) {
    e.preventDefault();
    sendMsg(chat.id);
  };
  inputRow.appendChild(sendBtn);

  wrapper.appendChild(inputRow);
  el.appendChild(wrapper);

  setTimeout(() => { box.scrollTop = box.scrollHeight; }, 50);
}

// --- UTILITY: APPEND MESSAGE UI ---
function appendMessageUI(box, sender, text) {
  const msgEl = document.createElement("div");
  msgEl.style.padding = "10px 14px";
  msgEl.style.borderRadius = "8px";
  msgEl.style.marginBottom = "8px";
  msgEl.style.maxWidth = "85%";
  msgEl.style.wordBreak = "break-word";
  msgEl.style.fontSize = "14px";
  msgEl.style.lineHeight = "1.4";

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
  typingEl.style.padding = "8px 12px";
  typingEl.style.borderRadius = "8px";
  typingEl.style.marginBottom = "8px";
  typingEl.style.border = "1px solid #2a1f52";
  typingEl.style.fontStyle = "italic";
  typingEl.style.fontSize = "13px";
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
