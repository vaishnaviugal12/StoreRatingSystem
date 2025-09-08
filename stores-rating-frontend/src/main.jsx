import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ import BrowserRouter
import './index.css';
import App from './App.jsx';
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    <Toaster position="top-right" />
  </BrowserRouter>
);

