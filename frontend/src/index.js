import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Tailwind and custom styles
import App from './app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
