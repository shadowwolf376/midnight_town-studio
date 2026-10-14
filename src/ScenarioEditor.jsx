import React, { useState } from 'react';

function ScenarioEditor() {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="editor-container">
      {/* Top Tab Buttons */}
      <div className="tabs">
        <button onClick={() => setActiveTab('details')}>Details</button>
        <button onClick={() => setActiveTab('intro')}>Intro</button>
        <button onClick={() => setActiveTab('story')}>Story</button>
        <button onClick={() => setActiveTab('lore')}>Lore</button>
        <button onClick={() => setActiveTab('settings')}>Settings</button>
      </div>

      {/* Conditional Rendering Based on Active Tab */}
      <div className="tab-content">
        {activeTab === 'details' && (
          <div className="section">
            <h3>Main Details</h3>
            <input type="text" placeholder="Scenario Name (ex. A Forbidden Spell)" maxLength={35} />
            <textarea placeholder="Scenario Description..." maxLength={250}></textarea>
          </div>
        )}

        {activeTab === 'story' && (
          <div className="section">
            <h3>Backstory / World Details</h3>
            <textarea placeholder="Define your world context and backstory..."></textarea>
          </div>
        )}

        {/* Add 'intro', 'lore', and 'settings' sections here */}
      </div>

      <button className="publish-btn">Publish Scenario</button>
    </div>
  );
}

export default ScenarioEditor;

