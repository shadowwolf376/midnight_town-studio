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
