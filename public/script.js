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

