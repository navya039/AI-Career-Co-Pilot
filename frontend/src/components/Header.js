import React from 'react';
import './Header.css';

function Header({ toggleSidebar }) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="hamburger-btn" onClick={toggleSidebar}>
          ☰
        </button>
        <h1 className="header-title">AI Career Co-Pilot</h1>
      </div>
      <div className="header-right">
        {/* Future elements like profile icons can go here */}
      </div>
    </header>
  );
}

export default Header;