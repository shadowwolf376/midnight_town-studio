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
