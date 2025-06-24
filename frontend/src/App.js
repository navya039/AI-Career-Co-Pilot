import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AnalyzerPage from './AnalyzerPage';
import ImproverPage from './ImproverPage';
import SimulatorPage from './SimulatorPage';
import AccountPage from './AccountPage';
import './App.css';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="app-container">
        <Sidebar isOpen={isSidebarOpen} />
        
        <div className={`page-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <Header toggleSidebar={toggleSidebar} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<AnalyzerPage />} />
              <Route path="/improver" element={<ImproverPage />} />
              <Route path="/simulator" element={<SimulatorPage />} />
              <Route path="/account" element={<AccountPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;