const selectedModel = document.getElementById("model-select")?.value || "cognitivecomputations/dolphin-mistral-24b-venice-edition:free";
body: JSON.stringify({
  model: selectedModel,
  messages: messagesArray
})

