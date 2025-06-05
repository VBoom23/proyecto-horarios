import React from 'react';
import './admin.css';
import { Link, useNavigate } from 'react-router-dom';

function AdminPanel() {
  const navigate = useNavigate();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>🧠 Admin</h2>
        <nav>
          <ul>
            <li><Link to="/admin-panel">📋 Panel principal</Link></li>
            <li><Link to="/admin-panel/docentes">🧑‍🏫 Docentes</Link></li>
            <li><Link to="#">📚 Materias</Link></li>
            <li><Link to="#">🕑 Horarios</Link></li>
            <li><Link to="#">⚙️ Configuración</Link></li>
            <li><Link to="/">🔒 Cerrar sesión</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="admin-main">
        <h1>Bienvenido, administrador</h1>
        <p>Administra y gestiona el sistema de horarios académicos de forma eficiente.</p>

        <div className="admin-cards">
          <div className="card" onClick={() => navigate('/admin-panel/docentes')} style={{ cursor: 'pointer' }}>
            <h3>👨‍🏫 Docentes</h3>
            <p>Gestiona profesores registrados en el sistema.</p>
          </div>
          <div className="card" onClick={() => navigate('/admin-panel/materias')} style={{ cursor: 'pointer' }}>
            <h3>📘 Materias</h3>
            <p>Agrega, edita o elimina asignaturas.</p>
          </div>
          <div className="card" onClick={() => navigate('/admin-panel/horarios')} style={{ cursor: 'pointer' }}>
            <h3>🗓️ Horarios</h3>
            <p>Visualiza y administra la asignación de horarios.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminPanel;
