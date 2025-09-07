import React from 'react';
import MuiTheme from './components/layout/MuiTheme.jsx';
import App from './App.jsx';
import './styles/fontLoader.js';
import ReactDOM from 'react-dom/client';

if (process.env.NODE_ENV !== 'production') {
  // Accessibility testing code removed
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <MuiTheme>
      <App />
    </MuiTheme>
  </React.StrictMode>
);
