import React from 'react';
import Chart from 'react-apexcharts';
import { Link } from 'react-router-dom'; // <-- Import Link
import './ResultsDashboard.css';

function ResultsDashboard({ results }) {
  const { match_score, verified_skills, missing_skills, ai_suggestions } = results;

  // Chart options remain the same...
  const scoreChartOptions = { /* ...omitted for brevity... */ };
  const scoreChartSeries = [match_score];

  return (
    <div className="dashboard-container">
      <h2>Analysis Dashboard</h2>
      <div className="dashboard-grid">
        <div className="grid-item score-card">
          <h3>Match Score</h3>
          <Chart options={scoreChartOptions} series={scoreChartSeries} type="radialBar" height={250} />
        </div>
        <div className="grid-item skills-card">
          <h3>Skill Analysis</h3>
          <h4>Matching Skills</h4>
          <div className="skills-list">
            {verified_skills.map((skill, index) => (
              <span key={index} className="skill-tag verified">{skill}</span>
            ))}
          </div>
          <h4 className="missing-title">Missing Skills</h4>
          <div className="skills-list">
            {missing_skills.map((skill, index) => (
              // --- THIS IS THE CHANGE ---
              // Each tag is now a link to the Improver page, passing the skills list in the state
              <Link
                to="/improver"
                state={{ missingSkills: missing_skills, selectedSkill: skill }}
                key={index}
                className="skill-tag missing"
              >
                {skill}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid-item suggestions-card">
          <h3>AI Suggestions</h3>
          <ul>
            {ai_suggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ResultsDashboard;