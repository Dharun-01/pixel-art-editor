import React from 'react';
import { createRoot } from 'react-dom/client';
import HomePage from './homePage.jsx';
import '../../src/input.css';

createRoot(document.getElementById('home-root')).render(<HomePage />);
