import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PopupApp from './PopupApp';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Check if we are in popup mode
const urlParams = new URLSearchParams(window.location.search);
const isPopup = urlParams.get('mode') === 'popup';

root.render(
  <React.StrictMode>
    {isPopup ? <PopupApp /> : <App />}
  </React.StrictMode>
);