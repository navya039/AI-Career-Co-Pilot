import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* This div now acts only as a spacer to push the links down */}
      <div className="sidebar-logo">
        {/* The name has been removed from here */}
      </div>
      <ul className="sidebar-links">
        <li><NavLink to="/" end>Analyzer</NavLink></li>
        <li><NavLink to="/improver">Improver</NavLink></li>
        <li><NavLink to="/simulator">Simulator</NavLink></li>
        <li><NavLink to="/account">My Account</NavLink></li>
      </ul>
    </aside>
  );
}

export default Sidebar;