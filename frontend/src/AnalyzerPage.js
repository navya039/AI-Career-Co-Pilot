import React, { useState } from 'react';
import axios from 'axios';
import './AnalyzerPage.css'; 
import ResultsDashboard from './components/ResultsDashboard';

function AnalyzerPage() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setResults(null);
    setError(null);

    const formData = new FormData();
    formData.append('resume_file', resumeFile);
    formData.append('job_description', jobDescription);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/analyze",
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setResults(response.data);
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
          <input type="file" id="resume-upload" accept=".pdf,.docx" onChange={(e) => setResumeFile(e.target.files[0])} required />
        </div>
        <div className="form-group">
          <label htmlFor="job-description">Paste the Job Description</label>
          <textarea id="job-description" rows="10" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the full job description here..." required ></textarea>
        </div>
        <button type="submit" className="analyze-button" disabled={!resumeFile || !jobDescription || isLoading}>{isLoading ? 'Analyzing...' : 'Analyze'}</button>
      </form>

      <div className="results-section">
        {isLoading && <p className="loading-text">Analyzing your documents, please wait...</p>}
        {error && <p className="error-text">{error}</p>}
        {results && <ResultsDashboard results={results} />}
      </div>
    </div>
  );
}

export default AnalyzerPage;