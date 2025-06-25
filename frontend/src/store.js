// frontend/src/store.js
import { create } from 'zustand';

const useAppStore = create((set, get) => ({ // <-- Add 'get' here
  // State variables
  analysisResults: null,
  resumeText: '',
  jobText: '',
  history: [], // <-- NEW: Array to hold session history

  // Actions to update the state
  setAnalysisResults: (results) => {
    set({ analysisResults: results });
    // --- NEW: Add the new result to the history ---
    const newHistoryEntry = {
      score: results.match_score,
      timestamp: new Date().toLocaleTimeString(),
      id: Date.now(),
    };
    set((state) => ({ history: [newHistoryEntry, ...state.history].slice(0, 5) })); // Keep last 5
  },
  setResumeText: (text) => set({ resumeText: text }),
  setJobText: (text) => set({ jobText: text }),
  
  // clearResults now only clears the main result, not history
  clearResults: () => set({ analysisResults: null }), 

  // --- NEW: Action to clear the history ---
  clearHistory: () => set({ history: [] }),
}));

export default useAppStore;