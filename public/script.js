function switchView(viewName) {
    document.querySelectorAll('.app-view').forEach(v => v.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('nav-' + viewName)?.classList.add('active');
    const target = document.getElementById('view-' + viewName);
    if (target) target.style.display = 'block';
    else { alert(viewName + ' under development!'); switchView('home'); }
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    const target = document.getElementById('tab-' + tabName);
    const activeBtn = document.getElementById('tab-btn-' + tabName);

    if (target) target.style.display = 'block';
    if (activeBtn) activeBtn.classList.add('active');
}

// Toggle bookmark status for a scenario
function toggleBookmark(event, title) {
    event.stopPropagation(); // Prevent opening the chat when clicking the heart
    const btn = event.currentTarget;
    btn.textContent = btn.textContent === '❤️' ? '🤍' : '❤️';
    alert(`Updated bookmarks for: ${title}`);
}

// Chat Sessions Management
let currentChats = JSON.parse(localStorage.getItem('midnight_chats') || '[]');

function saveCurrentChat(scenarioName, messageList) {
    const existingIndex = currentChats.findIndex(c => c.scenario === scenarioName);
    if (existingIndex >= 0) {
        currentChats[existingIndex].messages = messageList;
    } else {
        currentChats.push({ scenario: scenarioName, messages: messageList });
    }
    localStorage.setItem('midnight_chats', JSON.stringify(currentChats));
}

function loadChatSession(scenarioName) {
    const found = currentChats.find(c => c.scenario === scenarioName);
    const chatBox = document.getElementById('chat-box');
    if (!chatBox) return;

    chatBox.innerHTML = `
        <div style="background: #251a52; color: #ffaa00; padding: 10px; border-radius: 8px; margin-bottom: 10px; font-size: 13px;">
            ✨ Chat session loaded for <strong>${scenarioName}</strong>.
        </div>
    `;

    if (found && found.messages) {
        found.messages.forEach(msg => {
            const msgEl = document.createElement('div');
            msgEl.style.cssText = msg.isUser 
                ? 'background: #2e2354; color: #ffffff; padding: 10px; border-radius: 8px; margin-bottom: 10px; font-size: 13px; text-align: right;'
                : 'background: #251a52; color: #ffffff; padding: 10px; border-radius: 8px; margin-bottom: 10px; font-size: 13px; text-align: left;';
            msgEl.innerText = msg.text;
            chatBox.appendChild(msgEl);
        });
    }
}

// Automatically load saved chat session when opening a chat
const oldOpenChat = openChat;
openChat = function(scenarioName) {
    document.getElementById('chat-title').innerText = '💬 ' + scenarioName;
    switchView('chats');
    loadChatSession(scenarioName);
};

// Render Chat History List inside Chats View
function renderChatList() {
    const chatBox = document.getElementById('chat-box');
    if (!chatBox) return;
    
    let chats = JSON.parse(localStorage.getItem('midnight_chats') || '[]');
    if (chats.length === 0) {
        chatBox.innerHTML = `
            <div style="background: #251a52; color: #ffaa00; padding: 10px; border-radius: 8px; font-size: 13px;">
                ✨ No active chats yet. Select a scenario from Home to start!
            </div>
        `;
        return;
    }

    let html = '<h4 style="color: #ff6600; margin-bottom: 10px; font-size: 14px;">Your Saved Conversations</h4>';
    chats.forEach(c => {
        html += `
            <div onclick="openChat('${c.scenario}')" style="background: #251a52; color: #fff; padding: 12px; border-radius: 8px; margin-bottom: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border: 1px solid #2a1f52;">
                <span>💬 ${c.scenario}</span>
                <span style="font-size: 11px; color: #ffaa00;">Resume →</span>
            </div>
        `;
    });
    chatBox.innerHTML = html;
}

// Render Bookmarks inside Profile View
function renderProfileBookmarks() {
    const profileCard = document.querySelector('#view-profile .editor-card');
    if (!profileCard) return;

    let bookmarks = JSON.parse(localStorage.getItem('midnight_bookmarks') || '[]');
    let html = `
        <h3>@You</h3>
        <p style="color: #a39bb8; font-size: 13px; margin-bottom: 15px;">Manage your published scenarios and account settings.</p>
        <h4 style="color: #ff6600; font-size: 14px; margin-bottom: 8px;">❤️ Bookmarked Scenarios</h4>
    `;

    if (bookmarks.length === 0) {
        html += `<p style="color: #8c82a8; font-size: 12px;">No bookmarks yet. Tap the heart icon on any scenario card!</p>`;
    } else {
        bookmarks.forEach(b => {
            html += `<div style="background: #251a52; padding: 8px 12px; border-radius: 6px; margin-bottom: 6px; font-size: 13px; color: #fff;">📌 ${b}</div>`;
        });
    }
    profileCard.innerHTML = html;
}

// Hook into view switching to update lists automatically
const masterSwitchView = switchView;
switchView = function(viewName) {
    masterSwitchView(viewName);
    if (viewName === 'chats') {
        document.getElementById('chat-title').innerText = '💬 My Chats';
        renderChatList();
    }
    if (viewName === 'profile') {
        renderProfileBookmarks();
    }
};

function renderProfileBookmarks() {
    const profileCard = document.getElementById('profile-card');
    if (!profileCard) return;

    let bookmarks = JSON.parse(localStorage.getItem('midnight_bookmarks') || '[]');
    let html = `
        <h3>@You</h3>
        <p style="color: #a39bb8; font-size: 13px; margin-bottom: 15px;">Manage your published scenarios and account settings.</p>
        <h4 style="color: #ff6600; font-size: 14px; margin-bottom: 8px;">❤️ Bookmarked Scenarios</h4>
    `;

    if (bookmarks.length === 0) {
        html += `<p style="color: #8c82a8; font-size: 12px;">No bookmarks yet. Tap the heart icon on any scenario card!</p>`;
    } else {
        bookmarks.forEach(b => {
            html += `<div style="background: #251a52; padding: 8px 12px; border-radius: 6px; margin-bottom: 6px; font-size: 13px; color: #fff;">📌 ${b}</div>`;
        });
    }
    profileCard.innerHTML = html;
}

function toggleTag(btn) {
    const isActive = btn.style.borderColor === 'rgb(255, 102, 0)' || btn.style.borderColor === '#ff6600';
    if (isActive) {
        btn.style.background = '#150f2e';
        btn.style.color = '#a39bb8';
        btn.style.borderColor = '#2a1f52';
    } else {
        btn.style.background = '#251a52';
        btn.style.color = '#ffaa00';
        btn.style.borderColor = '#ff6600';
    }
}
