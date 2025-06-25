// frontend/src/ImproverPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './ImproverPage.css';

function ImproverPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('planner');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [missingSkills, setMissingSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [roadmap, setRoadmap] = useState('');

  const [bulletPointInput, setBulletPointInput] = useState('');
  const [improvedBulletPoint, setImprovedBulletPoint] = useState('');
  const [isImproving, setIsImproving] = useState(false);

  const getRoadmapForSkill = async (skill) => {
    if (!skill) return;
    setIsLoading(true);
    setError(null);
    setRoadmap('');
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/v1/improve/roadmap", { bullet_point: skill });
      setRoadmap(response.data.improved_text);
    } catch (err) {
      setError("Failed to generate roadmap.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkillClick = useCallback((skill) => {
    setSelectedSkill(skill);
    getRoadmapForSkill(skill);
  }, []); // Empty dependency array means this function is created once

  useEffect(() => {
    if (location.state?.missingSkills) {
      setActiveTab('planner');
      setMissingSkills(location.state.missingSkills);
      const initialSkill = location.state.selectedSkill || location.state.missingSkills[0];
      if (initialSkill) {
        handleSkillClick(initialSkill);
      }
    }
  }, [location.state, handleSkillClick]);

  const handleImproveBulletPoint = async (e) => {
    e.preventDefault();
    if (!bulletPointInput) return;
    setIsImproving(true);
    setImprovedBulletPoint('');
    setError(null);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/v1/improve/bullet", {
        bullet_point: bulletPointInput
      });
      setImprovedBulletPoint(response.data.improved_text);
    } catch (err) {
      setImprovedBulletPoint("Error: Could not improve bullet point.");
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="improver-container">
      <h1>AI-Powered Improver</h1>
      <div className="tabs">
        <button onClick={() => setActiveTab('builder')} className={activeTab === 'builder' ? 'active' : ''}>Bullet Point Builder</button>
        <button onClick={() => setActiveTab('planner')} className={activeTab === 'planner' ? 'active' : ''}>Skill Gap Planner</button>
      </div>

      {activeTab === 'builder' && (
        <div className="tab-content">
          <h2>Bullet Point Builder</h2>
          <p>Enter a bullet point from your resume, and our AI will help you make it more impactful.</p>
          <form onSubmit={handleImproveBulletPoint}>
            <textarea
              className="bullet-textarea"
              rows="4"
              value={bulletPointInput}
              onChange={(e) => setBulletPointInput(e.target.value)}
              placeholder="e.g., Made a new website for the company."
            />
            <button type="submit" className="analyze-button" disabled={isImproving}>
              {isImproving ? 'Improving...' : 'Improve Bullet Point'}
            </button>
          </form>
          {isImproving && <p className="loading-text">AI is working its magic...</p>}
          {improvedBulletPoint && (
            <>
              <h3 style={{ marginTop: '30px' }}>AI Suggestion:</h3>
              <div className="result-box">{improvedBulletPoint}</div>
            </>
          )}
        </div>
      )}

      {activeTab === 'planner' && (
        <div className="tab-content">
          <h2>Skill Gap Career Planner</h2>
          <p>Click on a missing skill to generate a personalized learning roadmap.</p>
          <div className="skills-to-plan">
            {missingSkills.length > 0 ? (
              missingSkills.map(skill => (
                <button 
                  key={skill} 
                  className={`skill-btn ${selectedSkill === skill ? 'selected' : ''}`}
                  onClick={() => handleSkillClick(skill)}
                >
                  {skill}
                </button>
              ))
            ) : (
              <p className="placeholder-text">First, analyze a resume on the "Analyzer" page to see your missing skills here.</p>
            )}
          </div>
          
          <h3 style={{ marginTop: '30px' }}>Your Learning Roadmap for {selectedSkill}:</h3>
          <div className="result-box roadmap">
            {isLoading && <p className="loading-text">AI is generating your roadmap...</p>}
            {error && <p className="error-text">{error}</p>}
            {roadmap && <ReactMarkdown>{roadmap}</ReactMarkdown>}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImproverPage;