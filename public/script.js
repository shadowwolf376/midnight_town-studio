const selectedModel = document.getElementById("model-select")?.value || "cognitivecomputations/dolphin-mistral-24b-venice-edition:free";
body: JSON.stringify({
  model: selectedModel,
  messages: messagesArray
})


function switchTab(tabName) {
  // Hide all tab content sections
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => content.style.display = 'none');

  // Show the selected tab content
  const activeTab = document.getElementById('tab-' + tabName);
  if (activeTab) {
    activeTab.style.display = 'block';
  }
}



function switchTab(tabName) {
  // Hide all contents
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(el => {
    el.style.display = 'none';
  });

  // Show selected content
  const target = document.getElementById('tab-type-' + tabName) || document.getElementById('tab-' + tabName);
  if (target) {
    target.style.display = 'block';
  }
}


function switchTab(tabName) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(el => {
        el.style.display = 'none';
    });

    const target = document.getElementById('tab-' + tabName);
    if (target) {
        target.style.display = 'block';
    }
}



// Switch between bottom navbar views (Home, Create, etc.)
function switchView(viewName) {
    const views = document.querySelectorAll('.app-view');
    views.forEach(v => v.style.display = 'none');

    const target = document.getElementById('view-' + viewName);
    if (target) {
        target.style.display = 'block';
    } else {
        // Fallback for views not built yet
        alert(viewName + " view coming soon!");
        document.getElementById('view-home').style.display = 'block';
    }
}

// Switch between scenario editor tabs (Details, Intro, Story, etc.)
function switchTab(tabName) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(el => {
        el.style.display = 'none';
    });

    const target = document.getElementById('tab-' + tabName);
    if (target) {
        target.style.display = 'block';
    }
}

