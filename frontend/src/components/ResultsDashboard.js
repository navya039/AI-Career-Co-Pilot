// frontend/src/components/ResultsDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import ReactMarkdown from 'react-markdown';
import './ResultsDashboard.css';

const ResultsDashboard = ({ results }) => {
  const { match_score, verified_skills, missing_skills, ai_suggestions } = results;

  const scoreChartOptions = {
    chart: {
      type: 'radialBar',
      height: 250,
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 0,
          size: '70%',
          background: 'transparent',
        },
        track: {
          background: '#374151',
          strokeWidth: '67%',
          margin: 0,
        },
        dataLabels: {
          show: true,
          name: {
            show: false,
          },
          value: {
            formatter: function (val) {
              return parseInt(val) + "%";
            },
            color: '#ffffff',
            fontSize: '28px',
            show: true,
            offsetY: 10,
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#3498db'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['Match Score'],
  };

  const scoreChartSeries = [match_score];

  return (
    <div className="dashboard-container">
      <h2>Analysis Dashboard</h2>
      <div className="dashboard-grid">
        <div className="grid-item score-card">
          <h3>Match Score</h3>
          <ReactApexChart options={scoreChartOptions} series={scoreChartSeries} type="radialBar" height={280} />
        </div>

        <div className="grid-item skills-card">
          <h3>Skill Analysis</h3>
          <h4>Matching Skills</h4>
          <div className="skills-list">
            {verified_skills.length > 0 ? 
              verified_skills.map((skill, index) => <span key={index} className="skill-tag verified">{skill}</span>) :
              <p>No matching skills found from our database.</p>
            }
          </div>
          <h4 className="missing-title">Missing Skills (Click to get a roadmap!)</h4>
          <div className="skills-list">
            {missing_skills.length > 0 ?
              missing_skills.map((skill, index) => (
                <Link to="/improver" state={{ missingSkills: missing_skills, selectedSkill: skill }} key={index} className="skill-tag missing">
                  {skill}
                </Link>
              )) :
              <p>No required skills seem to be missing. Great job!</p>
            }
          </div>
        </div>

        <div className="grid-item suggestions-card">
          <h3>AI Suggestions for Your Resume</h3>
          <div className="suggestions-box">
             <ReactMarkdown>{ai_suggestions}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;