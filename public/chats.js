
function renderChatList() {
    const el = document.getElementById('view-chats');
    if (!el) return;
    let chats = JSON.parse(localStorage.getItem('m_chats') || '[{"name":"The Lost Archivist","msg":"Step into candlelight..."},{"name":"Aira","msg":"Let us continue..."}]');
    let html = '<h2 style="color:#fff;margin-bottom:12px;">Your chats</h2>';
    chats.forEach(c => {
        html += '<div onclick="openActiveChat(\'' + c.name + '\')" style="background:#150f2e;padding:12px;border-radius:8px;margin-bottom:8px;border:1px solid #2a1f52;cursor:pointer;"><b style="color:#fff;">💬 ' + c.name + '</b><p style="color:#aaa;margin:4px 0 0;font-size:12px;">' + c.msg + '</p></div>';
    });
    el.innerHTML = html;
}
function openActiveChat(name) {
    switchView('chats');
    document.getElementById('view-chats').innerHTML = '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;"><button onclick="renderChatList()" style="background:#251a52;color:#fff;border:1px solid #2a1f52;padding:6px 12px;border-radius:6px;cursor:pointer;">← Back</button><h3 style="color:#fff;margin:0;">💬 ' + name + '</h3></div><div id="chat-box" style="height:320px;background:#150f2e;border:1px solid #2a1f52;border-radius:8px;padding:10px;overflow-y:auto;margin-bottom:10px;"></div><div style="display:flex;gap:8px;"><input id="chat-in" placeholder="Type a message..." style="flex:1;background:#150f2e;border:1px solid #2a1f52;color:#fff;padding:8px;border-radius:6px;outline:none;"><button onclick="sendMsg(\'' + name + '\')" style="background:#ff6600;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-weight:bold;cursor:pointer;">Send</button></div>';
}
function sendMsg(name) {
    const inEl = document.getElementById('chat-in');
    if (!inEl.value.trim()) return;
    const box = document.getElementById('chat-box');
    box.innerHTML += '<div style="background:#2e2354;color:#fff;padding:8px;border-radius:6px;margin-bottom:6px;text-align:right;">' + inEl.value + '</div>';
    inEl.value = '';
    setTimeout(() => {
        box.innerHTML += '<div style="background:#251a52;color:#fff;padding:8px;border-radius:6px;margin-bottom:6px;border:1px solid #2a1f52;">I received your message. Let us continue the story...</div>';
        box.scrollTop = box.scrollHeight;
    }, 600);
}
window.openChat = openActiveChat;
