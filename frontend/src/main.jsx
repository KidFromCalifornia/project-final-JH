import React from 'react';
import MuiTheme from './components/layout/MuiTheme.jsx';
import App from './App.jsx';
import './styles/fontLoader.js';
import ReactDOM from 'react-dom/client';

if (process.env.NODE_ENV !== 'production') {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000);
    console.log('Accessibility testing enabled with axe-core');
  });
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
