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
