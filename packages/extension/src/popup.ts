import { useState, useEffect } from 'react';

// Custom hook to manage popup state and sync with background.js

export function usePopupState(initialState) {
  const [state, setState] = useState(initialState);

  // Fetch initial state from background.js when popup opens
  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'getPopupState' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error fetching initial state:', chrome.runtime.lastError);
      } else if (response && response.state) {
        console.log('Received initial state from background:', response.state);
        setState(response.state);
      }
    });
  }, []);

  // Function to update state and sync with background.js
  const updateState = (newState) => {
    setState(newState);
    chrome.runtime.sendMessage({ action: 'storePopupState', state: newState }, (response) => {
      response;
      if (chrome.runtime.lastError) {
        console.error('Error sending state:', chrome.runtime.lastError);
      } else {
        console.log('State sent to background:', newState);
      }
    });
  };

  // Send final state when popup is closing
  useEffect(() => {
    const handleBeforeUnload = () => {
      chrome.runtime.sendMessage({ action: 'storePopupState', state }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error sending final state:', chrome.runtime.lastError);
        }
      });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state]);

  return [state, updateState];
}
