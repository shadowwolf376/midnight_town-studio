
function renderLoreList() {
    let l = JSON.parse(localStorage.getItem('m_lore') || '[]');
    let e = document.getElementById('lore-list');
    if (e) {
        e.innerHTML = l.map(x => '<div style="background:#150f2e;padding:10px;border-radius:6px;margin-bottom:8px;border:1px solid #2a1f52;"><b style="color:#fff;">' + x.title + '</b><p style="color:#aaa;margin:4px 0 0;font-size:12px;">' + x.content + '</p></div>').join('');
    }
}
window.saveLoreEntry = function() {
    let t = document.getElementById('lore-title').value;
    let c = document.getElementById('lore-content').value;
    if (!t || !c) return;
    let l = JSON.parse(localStorage.getItem('m_lore') || '[]');
    l.unshift({ title: t, content: c });
    localStorage.setItem('m_lore', JSON.stringify(l));
    document.getElementById('lore-title').value = '';
    document.getElementById('lore-content').value = '';
    renderLoreList();
};
