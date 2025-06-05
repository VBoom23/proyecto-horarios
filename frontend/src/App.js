import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login      from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import Docentes   from './pages/Docentes';
import Materias   from './pages/Materias';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"                     element={<Login />} />
        <Route path="/admin-panel"          element={<AdminPanel />} />
        <Route path="/admin-panel/docentes" element={<Docentes />} />
        <Route path="/admin-panel/materias" element={<Materias />} />
      </Routes>
    </Router>
  );
}

export default App;
