import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/sass/theme.scss';
import 'dotenv/config';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container as HTMLElement);
root.render(<App />);