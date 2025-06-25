// frontend/src/SimulatorPage.js

import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import useAppStore from './store';

function SimulatorPage() {
  const { resumeText, jobText } = useAppStore();

  const [questions, setQuestions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSimulate = async () => {
    if (!resumeText || !jobText) {
      setError('Please run an analysis on the Analyzer page first to provide context for the interview.');
      return;
    }
    setIsLoading(true);
    setError('');
    setQuestions('');
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/v1/analyze/simulate", {
        resume_text: resumeText,
        job_description_text: jobText
      });
      setQuestions(response.data.questions);
    } catch (err) {
      setError('Could not generate interview questions. Please try again later.');
      console.error("Simulator API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="improver-container"> {/* Reusing styles from ImproverPage */}
      <h1>Interview Simulator</h1>
      <p>Click the button to generate practice interview questions based on your last analysis.</p>
      <div className="tab-content">
        <button onClick={handleSimulate} disabled={isLoading} className="analyze-button">
          {isLoading ? 'Generating Questions...' : 'Generate Interview Questions'}
        </button>
        
        <h3 style={{ marginTop: '30px' }}>Your Practice Questions:</h3>
        <div className="result-box roadmap">
          {isLoading && <p className="loading-text">AI is preparing your questions...</p>}
          {error && <p className="error-text">{error}</p>}
          {questions && <ReactMarkdown>{questions}</ReactMarkdown>}
        </div>
      </div>
    </div>
  );
}

// This line was missing, causing the main crash.
export default SimulatorPage;