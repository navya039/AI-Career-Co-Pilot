// frontend/src/AccountPage.js
import React from 'react';
import useAppStore from './store';
import './AccountPage.css';

function AccountPage() {
  // Get history and the clearHistory function from our global store
  const { history, clearHistory } = useAppStore();

  const handleClearHistory = () => {
    clearHistory();
    alert('Your session history has been cleared.');
  };

  return (
    <div className="account-container">
      <h1>Settings & History</h1>
      <p>Manage your application settings and review your session history.</p>

      <div className="settings-card">
        <h3>Application Settings</h3>
        <p>Control the behavior of the AI analysis.</p>
        <div className="form-group">
          <label htmlFor="ai-model">AI Model</label>
          <select id="ai-model" className="settings-select">
            <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fastest)</option>
            <option value="gemini-pro" disabled>Gemini Pro (More Powerful - Coming Soon)</option>
          </select>
        </div>
         <div className="form-group">
          <label htmlFor="ai-detail">AI Suggestion Detail Level</label>
          <select id="ai-detail" className="settings-select">
            <option value="concise">Concise</option>
            <option value="detailed" disabled>Detailed (Coming Soon)</option>
          </select>
        </div>
      </div>

      <div className="settings-card">
        <h3>Session History</h3>
        <p>Here are the results from your current session. This list will clear when you refresh the page.</p>
        <ul className="history-list">
          {history.length > 0 ? (
            history.map(item => (
              <li key={item.id} className="history-item">
                <span>Analysis at {item.timestamp}</span>
                <span className="history-score">{item.score}%</span>
              </li>
            ))
          ) : (
            <li className="history-item-empty">No analyses performed in this session yet.</li>
          )}
        </ul>
        <button className="clear-button" onClick={handleClearHistory} disabled={history.length === 0}>
          Clear Session History
        </button>
      </div>
    </div>
  );
}

export default AccountPage;