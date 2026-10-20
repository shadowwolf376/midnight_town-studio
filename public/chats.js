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
      avatar: "🏛️",
      msg: "Ready to chat...",
      time: "17:50",
      description: "Keeper of the lost starlight archive.",
      lore: "Guarding ancient knowledge.",
      history: [{ sender: "ai", text: "Welcome to the archive." }]
    }];
    localStorage.setItem("m_chats", JSON.stringify(chats));
  }
  return chats;
}

function saveChats(chats) {
  localStorage.setItem("m_chats", JSON.stringify(chats));
}

// --- RENDER EMOCHI-STYLE CHATS VIEW ---
function renderChatList() {
  const el = document.getElementById("view-chats");
  if (!el) return;
  
  el.style.display = "block";
  el.style.background = "#000000"; // Pure dark Emochi style
  el.style.minHeight = "100vh";
  el.style.color = "#ffffff";
  el.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  el.innerHTML = "";
  
  const container = document.createElement("div");
  container.style.padding = "16px";
  
  // 1. TOP HEADER ROW (Chats / Album + Notification & Search icons)
  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.marginBottom = "20px";

  // Sub-tabs: Chats / Album
  const tabsLeft = document.createElement("div");
  tabsLeft.style.display = "flex";
  tabsLeft.style.gap = "20px";
  tabsLeft.style.alignItems = "center";

  const chatsTab = document.createElement("span");
  chatsTab.textContent = "Chats";
  chatsTab.style.fontSize = "22px";
  chatsTab.style.fontWeight = "bold";
  chatsTab.style.color = "#ffffff";
  tabsLeft.appendChild(chatsTab);

  const albumTab = document.createElement("span");
  albumTab.textContent = "Album";
  albumTab.style.fontSize = "22px";
  albumTab.style.fontWeight = "bold";
  albumTab.style.color = "#555555";
  albumTab.style.cursor = "pointer";
  tabsLeft.appendChild(albumTab);

  header.appendChild(tabsLeft);

  // Top Right Action Icons
  const iconsRight = document.createElement("div");
  iconsRight.style.display = "flex";
  iconsRight.style.gap = "18px";
  iconsRight.style.fontSize = "20px";

  const bellIcon = document.createElement("span");
  bellIcon.textContent = "🔔";
  bellIcon.style.cursor = "pointer";
  iconsRight.appendChild(bellIcon);

  const searchIcon = document.createElement("span");
  searchIcon.textContent = "🔍";
  searchIcon.style.cursor = "pointer";
  iconsRight.appendChild(searchIcon);

  header.appendChild(iconsRight);
  container.appendChild(header);

  // 2. UTILITY ROW: SAVED
  const savedRow = createUtilityRow("🔖", "Saved", "", true, false);
  container.appendChild(savedRow);

  // 3. UTILITY ROW: INBOX
  const inboxRow = createUtilityRow("🔔", "Inbox", "V2.2.14 Version Update", false, true, "6h");
  container.appendChild(inboxRow);

  // Divider space
  const spacer = document.createElement("div");
  spacer.style.height = "10px";
  container.appendChild(spacer);

  // 4. RENDER CONVERSATION LIST
  const chats = getSavedChats();
  chats.forEach(c => {
    const card = document.createElement("div");
    card.style.display = "flex";
    card.style.alignItems = "center";
    card.style.gap = "14px";
    card.style.padding = "10px 0";
    card.style.cursor = "pointer";
    
    // Circular Avatar
    const avatar = document.createElement("div");
    avatar.style.width = "48px";
    avatar.style.height = "48px";
    avatar.style.borderRadius = "50%";
    avatar.style.background = "#1a1a2e";
    avatar.style.border = "1px solid #333";
    avatar.style.display = "flex";
    avatar.style.justifyContent = "center";
    avatar.style.alignItems = "center";
    avatar.style.fontSize = "22px";
    avatar.textContent = c.avatar || "👤";
    card.appendChild(avatar);

    // Text Content Column
    const textCol = document.createElement("div");
    textCol.style.flex = "1";
    textCol.style.overflow = "hidden";

    // Name + Timestamp
    const titleRow = document.createElement("div");
    titleRow.style.display = "flex";
    titleRow.style.justifyContent = "space-between";
    titleRow.style.alignItems = "center";

    const name = document.createElement("div");
    name.style.color = "#ffffff";
    name.style.fontWeight = "bold";
    name.style.fontSize = "16px";
    name.textContent = c.name;
    titleRow.appendChild(name);

    const time = document.createElement("div");
    time.style.color = "#666666";
    time.style.fontSize = "12px";
    time.textContent = c.time || "Recently";
    titleRow.appendChild(time);

    textCol.appendChild(titleRow);

    // Subtitle preview line
    const subtitle = document.createElement("div");
    subtitle.style.color = "#888888";
    subtitle.style.fontSize = "13px";
    subtitle.style.marginTop = "4px";
    subtitle.style.whiteSpace = "nowrap";
    subtitle.style.overflow = "hidden";
    subtitle.style.textOverflow = "ellipsis";
    subtitle.textContent = c.msg || "No messages yet";
    textCol.appendChild(subtitle);

    card.appendChild(textCol);

    // Click handler to launch active chat session
    card.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      openActiveChat(c.id);
      return false;
    };

    container.appendChild(card);
  });

  el.appendChild(container);
}

// Helper: Create Utility Rows (Saved / Inbox)
function createUtilityRow(iconSymbol, titleText, subText, hasChevron = false, hasBadge = false, timeBadge = "") {
  const row = document.createElement("div");
  row.style.display = "flex";
  row.style.alignItems = "center";
  row.style.gap = "14px";
  row.style.padding = "10px 0";
  row.style.cursor = "pointer";

  // Yellow Circle Icon
  const iconWrapper = document.createElement("div");
  iconWrapper.style.width = "48px";
  iconWrapper.style.height = "48px";
  iconWrapper.style.borderRadius = "50%";
  iconWrapper.style.background = "#3d3b00";
  iconWrapper.style.display = "flex";
  iconWrapper.style.justifyContent = "center";
  iconWrapper.style.alignItems = "center";
  iconWrapper.style.fontSize = "20px";
  iconWrapper.style.position = "relative";
  iconWrapper.textContent = iconSymbol;

  // Red Dot Badge for Inbox
  if (hasBadge) {
    const dot = document.createElement("div");
    dot.style.position = "absolute";
    dot.style.top = "2px";
    dot.style.right = "2px";
    dot.style.width = "10px";
    dot.style.height = "10px";
    dot.style.borderRadius = "50%";
    dot.style.background = "#ff3b30";
    iconWrapper.appendChild(dot);
  }

  row.appendChild(iconWrapper);

  // Text Column
  const textCol = document.createElement("div");
  textCol.style.flex = "1";

  const titleRow = document.createElement("div");
  titleRow.style.display = "flex";
  titleRow.style.justifyContent = "space-between";
  titleRow.style.alignItems = "center";

  const name = document.createElement("div");
  name.style.color = "#ffffff";
  name.style.fontWeight = "bold";
  name.style.fontSize = "16px";
  name.textContent = titleText;
  titleRow.appendChild(name);

  if (timeBadge) {
    const time = document.createElement("div");
    time.style.color = "#666666";
    time.style.fontSize = "12px";
    time.textContent = timeBadge;
    titleRow.appendChild(time);
  }

  textCol.appendChild(titleRow);

  if (subText) {
    const subtitle = document.createElement("div");
    subtitle.style.color = "#888888";
    subtitle.style.fontSize = "13px";
    subtitle.style.marginTop = "4px";
    subtitle.textContent = subText;
    textCol.appendChild(subtitle);
  }

  row.appendChild(textCol);

  if (hasChevron) {
    const chevron = document.createElement("div");
    chevron.style.color = "#666666";
    chevron.style.fontSize = "18px";
    chevron.textContent = "❯";
    row.appendChild(chevron);
  }

  return row;
}

// --- RENDER ACTIVE CHAT SESSION ---
function openActiveChat(chatId) {
  const chats = getSavedChats();
  let chat = chats.find(c => c.id === chatId) || chats[0];

  const el = document.getElementById("view-chats");
  if (!el) return;
  el.style.display = "block";
  el.style.background = "#000000";
  el.innerHTML = "";

  const container = document.createElement("div");
  container.style.padding = "16px";

  // Top Bar
  const topBar = document.createElement("div");
  topBar.style.display = "flex";
  topBar.style.alignItems = "center";
  topBar.style.justifyContent = "space-between";
  topBar.style.marginBottom = "16px";

  const backBtn = document.createElement("button");
  backBtn.textContent = "← Back";
  backBtn.style.background = "#222222";
  backBtn.style.color = "#ffffff";
  backBtn.style.border = "none";
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
  resetBtn.style.background = "#331111";
  resetBtn.style.color = "#ff6666";
  resetBtn.style.border = "none";
  resetBtn.style.padding = "8px 12px";
  resetBtn.style.borderRadius = "20px";
  resetBtn.style.cursor = "pointer";
  resetBtn.onclick = function() {
    if (confirm("Reset conversation?")) {
      chat.history = [{ sender: "ai", text: "Chat restarted!" }];
      saveChats(chats);
      openActiveChat(chatId);
    }
  };
  topBar.appendChild(resetBtn);

  container.appendChild(topBar);

  // Chat Box
  const box = document.createElement("div");
  box.id = "chat-box";
  box.style.height = "calc(100vh - 180px)";
  box.style.overflowY = "auto";
  box.style.padding = "10px 0";

  if (chat.history) {
    chat.history.forEach(m => {
      const msgEl = document.createElement("div");
      msgEl.style.padding = "10px 14px";
      msgEl.style.borderRadius = "16px";
      msgEl.style.marginBottom = "10px";
      msgEl.style.maxWidth = "80%";
      msgEl.style.wordBreak = "break-word";
      msgEl.style.fontSize = "14px";

      if (m.sender === "user") {
        msgEl.style.background = "#ffff00"; // Emochi yellow accent
        msgEl.style.color = "#000000";
        msgEl.style.marginLeft = "auto";
      } else {
        msgEl.style.background = "#1a1a1a";
        msgEl.style.color = "#ffffff";
      }
      msgEl.textContent = m.text;
      box.appendChild(msgEl);
    });
  }

  container.appendChild(box);

  // Input Box
  const inputRow = document.createElement("div");
  inputRow.style.display = "flex";
  inputRow.style.gap = "10px";
  inputRow.style.marginTop = "10px";

  const input = document.createElement("input");
  input.id = "chat-in";
  input.placeholder = "Type a message...";
  input.style.flex = "1";
  input.style.background = "#1a1a1a";
  input.style.border = "none";
  input.style.color = "#ffffff";
  input.style.padding = "12px 16px";
  input.style.borderRadius = "24px";
  input.style.outline = "none";

  const sendBtn = document.createElement("button");
  sendBtn.textContent = "Send";
  sendBtn.style.background = "#ffff00";
  sendBtn.style.color = "#000000";
  sendBtn.style.border = "none";
  sendBtn.style.padding = "12px 20px";
  sendBtn.style.borderRadius = "24px";
  sendBtn.style.fontWeight = "bold";
  sendBtn.style.cursor = "pointer";

  inputRow.appendChild(input);
  inputRow.appendChild(sendBtn);
  container.appendChild(inputRow);

  el.appendChild(container);
}

window.openActiveChat = openActiveChat;
window.renderChatList = renderChatList;
