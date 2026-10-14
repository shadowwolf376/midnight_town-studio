// Switch between bottom navigation views
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

// Switch between scenario editor tabs
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

// Attach publish handler when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const publishBtn = document.querySelector('.publish-btn');
    
    if (publishBtn) {
        publishBtn.addEventListener('click', () => {
            const nameInput = document.querySelector('#tab-details input[type="text"]');
            const descInput = document.querySelector('#tab-details textarea');

            const title = nameInput ? nameInput.value.trim() : '';
            const desc = descInput ? descInput.value.trim() : '';

            if (!title) {
                alert('Please enter a scenario name!');
                return;
            }

            // Create new scenario card HTML element
            const grid = document.querySelector('.scenario-grid');
            if (grid) {
                const newCard = document.createElement('div');
                newCard.className = 'scenario-card';
                newCard.innerHTML = `
                    <h3>${title}</h3>
                    <p class="author">By You</p>
                    <p>${desc || 'No description provided.'}</p>
                `;

                // Add to top of grid
                grid.prepend(newCard);
            }

            // Clear inputs
            if (nameInput) nameInput.value = '';
            if (descInput) descInput.value = '';

            alert('Scenario published successfully!');

            // Return to Home view
            switchView('home');
        });
    }
});
