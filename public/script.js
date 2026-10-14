function switchView(viewName) {
    document.querySelectorAll('.app-view').forEach(v => v.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('nav-' + viewName)?.classList.add('active');
    const target = document.getElementById('view-' + viewName);
    if (target) target.style.display = 'block';
    else { alert(viewName + ' under development!'); switchView('home'); }
}
