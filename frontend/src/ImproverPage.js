import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (location.state?.missingSkills) {
      setActiveTab('planner');
      setMissingSkills(location.state.missingSkills);
      const initialSkill = location.state.selectedSkill || location.state.missingSkills[0];
      if (initialSkill) {
        setSelectedSkill(initialSkill);
        getRoadmapForSkill(initialSkill);
      }
    }
  }, [location.state]);

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

  return (
    <div className="improver-container">
      <h1>AI-Powered Improver</h1>
      <div className="tabs">
        <button onClick={() => setActiveTab('builder')} className={activeTab === 'builder' ? 'active' : ''}>Bullet Point Builder</button>
        <button onClick={() => setActiveTab('planner')} className={activeTab === 'planner' ? 'active' : ''}>Skill Gap Planner</button>
      </div>

      {activeTab === 'builder' && (
        <div className="tab-content">
          <h2>Bullet Point Builder (Coming Soon)</h2>
          <p>This feature will allow you to improve your resume bullet points one by one.</p>
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
                  onClick={() => {
                    setSelectedSkill(skill);
                    getRoadmapForSkill(skill);
                  }}
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
            {isLoading && 'AI is generating your roadmap...'}
            {error && <p style={{color: '#fca5a5'}}>{error}</p>}
            {roadmap && <ReactMarkdown>{roadmap}</ReactMarkdown>}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImproverPage;