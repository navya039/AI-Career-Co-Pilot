import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import './App.css';

function App() {
  // State for form inputs
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');

  // New state variables for handling results, loading, and errors
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Updated function to handle the API call
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Reset previous results and start loading
    setIsLoading(true);
    setResults(null);
    setError(null);

    // Create a FormData object to send the file and text
    const formData = new FormData();
    formData.append('resume_file', resumeFile);
    formData.append('job_description', jobDescription);

    try {
      // Make the POST request to the backend
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/analyze",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      // Store the results from the backend
      setResults(response.data);
    } catch (err) {
      // Store any errors
      setError("An error occurred. Please check the files and try again.");
      console.error("API Error:", err);
    } finally {
      // Stop loading regardless of success or error
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Smart Resume Ranker</h1>
        <p>Upload your resume and the job description to see your match score!</p>
      </header>
      <main>
        <form className="analysis-form" onSubmit={handleSubmit}>
          {/* Input fields are the same as before */}
          <div className="form-group">
            <label htmlFor="resume-upload">Upload Your Resume (.pdf, .docx)</label>
            <input
              type="file"
              id="resume-upload"
              accept=".pdf,.docx"
              onChange={(e) => setResumeFile(e.target.files[0])}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="job-description">Paste the Job Description</label>
            <textarea
              id="job-description"
              rows="10"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              required
            ></textarea>
          </div>
          <button type="submit" className="analyze-button" disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>

        {/* New section to display results, loading, or errors */}
        <div className="results-section">
          {isLoading && <p className="loading-text">Loading results, please wait...</p>}
          {error && <p className="error-text">{error}</p>}
          {results && (
            <div className="results-container">
              <h2>Analysis Results</h2>
              <pre>{JSON.stringify(results, null, 2)}</pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;