import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Ensure process is defined for any dependencies that need it
if (typeof window.process === 'undefined') {
  window.process = {
    env: {
      NODE_ENV: 'development'
    }
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
