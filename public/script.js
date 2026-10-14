function switchView(viewName) {
    const views = document.querySelectorAll('.app-view');
    views.forEach(v => v.style.display = 'none');

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(n => n.classList.remove('active'));

    const activeNav = document.getElementById('nav-' + viewName);
    if (activeNav) activeNav.classList.add('active');

    const target = document.getElementById('view-' + viewName);
    if (target) {
        target.style.display = 'block';
    } else {
        alert(viewName + ' page is under development!');
        document.getElementById('view-home').style.display = 'block';
        document.getElementById('nav-home').classList.add('active');
    }
}

function switchTab(tabName) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(el => el.style.display = 'none');

    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));

    const target = document.getElementById('tab-' + tabName);
    const activeBtn = document.getElementById('tab-btn-' + tabName);

    if (target) target.style.display = 'block';
    if (activeBtn) activeBtn.classList.add('active');
}
