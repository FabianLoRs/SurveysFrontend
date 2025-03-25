import React from 'react';
import ReactDOM from "react-dom";
import axios from "axios";
import './index.scss';
import App from './App';

axios.defaults.headers.common["Accept-Language"] = 'es';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
