import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
// ВАЖНО: без этой строчки React-Bootstrap не будет работать и отображать контент!
import 'bootstrap/dist/css/bootstrap.min.css'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);