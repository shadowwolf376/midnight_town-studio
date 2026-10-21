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
