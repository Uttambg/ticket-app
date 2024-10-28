<<<<<<< HEAD
import React from 'react';
=======
  import React from 'react';
>>>>>>> 5c34b08e48836538704dbbe913527dce5fee3dc5
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
<<<<<<< HEAD
import { AuthProvider } from './components/authContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
        <App />
      </AuthProvider>
  </React.StrictMode>
);

=======

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
>>>>>>> 5c34b08e48836538704dbbe913527dce5fee3dc5
reportWebVitals();
