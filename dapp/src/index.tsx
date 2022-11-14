import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/sass/theme.scss';
import 'react-loading-skeleton/dist/skeleton.css'

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container as HTMLElement);
root.render(<App />);

if (!process.env.REACT_APP_GTAG) {
    console.warn('Missing REACT_APP_GTAG environment variable. Google Analytics will not be loaded.');
}