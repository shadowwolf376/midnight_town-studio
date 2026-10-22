// Navigation Tab Switcher
document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".bottom-nav button, nav a, .nav-item");
  
  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      const text = item.textContent.trim().toLowerCase();
      
      // Hide all main view sections
      const views = document.querySelectorAll("[id^='view-']");
      views.forEach(v => v.style.display = "none");

      if (text.includes("chats")) {
        const chatsView = document.getElementById("view-chats");
        if (chatsView) {
          chatsView.style.display = "block";
          if (typeof renderChatList === "function") {
            renderChatList();
          }
        }
      } else if (text.includes("home")) {
        const homeView = document.getElementById("view-home");
        if (homeView) homeView.style.display = "block";
      } else if (text.includes("search")) {
        const searchView = document.getElementById("view-search");
        if (searchView) searchView.style.display = "block";
      } else if (text.includes("create")) {
        const createView = document.getElementById("view-create");
        if (createView) createView.style.display = "block";
      } else if (text.includes("profile")) {
        const profileView = document.getElementById("view-profile");
        if (profileView) profileView.style.display = "block";
      }
    });
  });
});

// --- Professional Empty State Helper ---
function renderEmptyState(containerId, message) {
    const container = document.getElementById(containerId);
    if (container && container.innerHTML.trim() === '') {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #a0a0c0; font-family: inherit;">
                <p style="font-size: 15px; margin-bottom: 8px;">📂 Nothing here yet</p>
                <p style="font-size: 13px; opacity: 0.7;">${message}</p>
            </div>
        `;
    }
}

// --- Professional Empty State Helper ---
function renderEmptyState(containerId, message) {
    const container = document.getElementById(containerId);
    if (container && container.innerHTML.trim() === '') {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #a0a0c0; font-family: inherit;">
                <p style="font-size: 15px; margin-bottom: 8px;">📂 Nothing here yet</p>
                <p style="font-size: 13px; opacity: 0.7;">${message}</p>
            </div>
        `;
    }
}

// --- Skeleton Loader Helper ---
function renderSkeletonLoader(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div style="padding: 20px; opacity: 0.6;">
                <div style="height: 16px; background: rgba(255, 255, 255, 0.15); border-radius: 4px; margin-bottom: 12px; width: 80%;"></div>
                <div style="height: 16px; background: rgba(255, 255, 255, 0.15); border-radius: 4px; width: 50%;"></div>
            </div>
        `;
    }
}

// --- Typing Indicator Helper ---
function showTypingIndicator(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        hideTypingIndicator(); // Prevent duplicates
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.style.cssText = 'padding: 10px 15px; margin: 10px 0; background: rgba(255, 255, 255, 0.05); border-radius: 12px; width: fit-content; color: #b19cd9; font-style: italic; font-size: 14px; animation: pulse 1.5s infinite;';
        typingDiv.innerHTML = '✨ Character is typing...';
        container.appendChild(typingDiv);
        container.scrollTop = container.scrollHeight;
    }
}

function hideTypingIndicator() {
    const typingDiv = document.getElementById('typing-indicator');
    if (typingDiv) {
        typingDiv.remove();
    }
}

// --- Auto-trigger Typing Indicator on Send ---
document.addEventListener("DOMContentLoaded", () => {
    const sendBtn = document.querySelector("button:has-text('Send'), button"); // Targets your send button
    const chatContainer = document.querySelector(".chat-messages, [style*='background']") || document.body;

    // If you have a specific function handling your send click, you can also manually call:
    // showTypingIndicator('your-chat-container-id');
});

// --- Safe Auto-trigger Typing Indicator ---
document.addEventListener("DOMContentLoaded", () => {
    // Find the send button safely by checking button text
    const buttons = Array.from(document.querySelectorAll("button"));
    const sendBtn = buttons.find(b => b.textContent.includes("Send"));

    if (sendBtn) {
        sendBtn.addEventListener("click", () => {
            // Find the chat area or default to body to show the typing dots
            const chatBox = document.querySelector(".chat-container") || document.body;
            showTypingIndicator(chatBox.id || "chat-box");
        });
    }
});

// --- Message Action Controls Helper ---

function addMessageControls(messageElement, onRegenerate) {
    if (!messageElement || messageElement.querySelector('.message-actions')) return;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'message-actions';
    actionsDiv.style.cssText = 'display: flex; gap: 12px; margin-top: 8px; font-size: 12px; opacity: 0.8;';

    // Copy Button
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋 Copy';
    copyBtn.style.cssText = 'background: none; border: none; color: #b19cd9; cursor: pointer; padding: 0; font-family: inherit;';
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(messageElement.innerText);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy', 2000);
    };

    // Regenerate Button
    const regenBtn = document.createElement('button');
    regenBtn.textContent = '🔄 Regenerate';
    regenBtn.style.cssText = 'background: none; border: none; color: #b19cd9; cursor: pointer; padding: 0; font-family: inherit;';
    regenBtn.onclick = () => {
        if (typeof onRegenerate === 'function') onRegenerate();
    };

    actionsDiv.appendChild(copyBtn);
    actionsDiv.appendChild(regenBtn);
    messageElement.appendChild(actionsDiv);
}
window.addMessageControls = addMessageControls;

    });

    actionsDiv.appendChild(retryBtn);
    messageElement.appendChild(actionsDiv);
}

// Auto-sync chat rendering when returning to active sessions
document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-view], button, a");
    if (target && (target.innerText.includes("Archivist") || target.innerText.includes("Chats"))) {
        setTimeout(() => {
            if (typeof openActiveChat === "function") {
                openActiveChat("lost-archivist");
            }
        }, 50);
    }
});


function startScenarioChat(scenarioName, avatarIcon) {
    let chats = [];
    try {
        chats = JSON.parse(localStorage.getItem("mt_chats")) || [];
    } catch(e) {}

    const newId = "chat-" + Date.now();
    const newChat = {
        id: newId,
        name: scenarioName || "New Roleplay Session",
        avatar: avatarIcon || "💬",
        updatedAt: "Just now",
        history: [{ sender: "ai", text: "*Welcome to " + (scenarioName || "the session") + ".*" }]
    };

    chats.unshift(newChat);
    localStorage.setItem("mt_chats", JSON.stringify(chats));
    localStorage.setItem("mt_active_chat", newId);

    if (typeof openActiveChat === "function") openActiveChat(newId);
    if (typeof switchView === "function") switchView("chat-room");
}
