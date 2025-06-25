// frontend/src/AnalyzerPage.js

import React, { useState } from 'react';
import axios from 'axios';
import useAppStore from './store'; 
import './AnalyzerPage.css'; 
import ResultsDashboard from './components/ResultsDashboard';

function AnalyzerPage() {
  // Get the state and actions from the global Zustand store
  const { analysisResults, setAnalysisResults, setResumeText, setJobText, clearResults } = useAppStore();
  
  // Local state for the form inputs
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
    // Clear previous results when a new file is selected
    if (analysisResults) {
      clearResults();
    }
  };

  const handleTextChange = (e) => {
    setJobDescription(e.target.value);
    // Clear previous results when the job description is changed
    if (analysisResults) {
      clearResults();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Read file content for state and prepare form data for API
      const resumeFileContent = await resumeFile.text();
      setResumeText(resumeFileContent);
      setJobText(jobDescription);
      
      const formData = new FormData();
      formData.append('resume_file', resumeFile);
      formData.append('job_description', jobDescription);

      const response = await axios.post("http://127.0.0.1:8000/api/v1/analyze/", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Set the new results in our global store
      setAnalysisResults(response.data); 

    } catch (err) {
      setError("An error occurred. Please ensure your backend is running and try again.");
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="analyzer-container">
      <h1>ATS Score Analyzer</h1>
      <p>Upload your resume and the job description to see how well you match!</p>
      
      <form className="analysis-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="resume-upload">Upload Your Resume (.pdf, .docx)</label>
          <input type="file" id="resume-upload" accept=".pdf,.docx" onChange={handleFileChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="job-description">Paste the Job Description</label>
          <textarea id="job-description" rows="10" value={jobDescription} onChange={handleTextChange} placeholder="Paste the full job description here..." required ></textarea>
        </div>
        <button type="submit" className="analyze-button" disabled={!resumeFile || !jobDescription || isLoading}>{isLoading ? 'Analyzing...' : 'Analyze'}</button>
      </form>

      <div className="results-section">
        {isLoading && <p className="loading-text">Analyzing your documents, please wait...</p>}
        {error && <p className="error-text">{error}</p>}
        {analysisResults && <ResultsDashboard results={analysisResults} />}
      </div>
    </div>
  );
}

export default AnalyzerPage;