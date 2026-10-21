// --- MIDNIGHTTOWN UTILITY MODULE ---

// Simple Roleplay Formatter
function formatRP(text) {
    if (!text) return "";
    let safe = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    safe = safe.replace(/\/\*([^*]+)\*\//g, '<strong style="color:#fff;">$1</strong>');
    safe = safe.replace(/\*([^*]+)\*/g, '<span style="color:#4b5fd; font-style:italic;">$1</span>');
    return safe.replace(/\n/g, '<br>');
}

// Reusable Message Controls (Regenerate, Copy, etc.)
function addMessageControls(messageElement, onRegenerate) {
    const actionsDiv = document.createElement('div');
    actionsDiv.style.display = "flex";
    actionsDiv.style.gap = "8px";
    actionsDiv.style.marginTop = "8px";

    const retryBtn = document.createElement('button');
    retryBtn.textContent = "✨ Regenerate";
    retryBtn.style.background = "#151026";
    retryBtn.style.color = "#c4b5fd";
    retryBtn.style.border = "1px solid #2b204e";
    retryBtn.style.padding = "4px 10px";
    retryBtn.style.borderRadius = "8px";
    retryBtn.style.fontSize = "12px";
    retryBtn.style.cursor = "pointer";

    retryBtn.onclick = () => {
        if (typeof onRegenerate === "function") onRegenerate();
    };

    actionsDiv.appendChild(retryBtn);
    messageElement.appendChild(actionsDiv);
}
