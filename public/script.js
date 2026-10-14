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
