// src/pages/Materias.jsx

import React, { useState, useEffect } from 'react';
import './materias.css';
import { motion } from 'framer-motion';

const API_BASE = 'http://localhost:5000/api';  // URL absoluta

export default function Materias() {
  const [materias, setMaterias] = useState([]);
  const [form, setForm]         = useState({ carrera: '', materia: '', grupo: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId]       = useState(null);
  const [showForm, setShowForm]   = useState(false);

  useEffect(() => {
    async function load() {
      try {
        console.log('🚀 GET', `${API_BASE}/materias`);
        const res = await fetch(`${API_BASE}/materias`);
        console.log('🔹 Status:', res.status);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        console.log('📦 materias recibidas:', data);
        setMaterias(data);
      } catch (err) {
        console.error('❌ Error cargando materias:', err);
        alert('No se pudieron cargar las materias. Revisa la consola.');
      }
    }
    load();
  }, []);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const url    = isEditing ? `${API_BASE}/materias/${editId}` : `${API_BASE}/materias`;
    const method = isEditing ? 'PUT' : 'POST';
    try {
      console.log(`➡️ ${method} ${url}`, form);
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      console.log('↩️ Guardar status:', res.status);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      // recarga
      const listRes = await fetch(`${API_BASE}/materias`);
      const listData = await listRes.json();
      setMaterias(listData);
      setForm({ carrera: '', materia: '', grupo: '' });
      setIsEditing(false);
      setEditId(null);
      setShowForm(false);
    } catch (err) {
      console.error('❌ Error guardando materia:', err);
      alert('Error al guardar la materia');
    }
  };

  const handleEdit = m => {
    setForm({ carrera: m.carrera, materia: m.materia, grupo: m.grupo });
    setIsEditing(true);
    setEditId(m.id);
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar esta materia?')) return;
    try {
      console.log('🗑️ DELETE', `${API_BASE}/materias/${id}`);
      const res = await fetch(`${API_BASE}/materias/${id}`, { method: 'DELETE' });
      console.log('↩️ Delete status:', res.status);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const listRes = await fetch(`${API_BASE}/materias`);
      const listData = await listRes.json();
      setMaterias(listData);
    } catch (err) {
      console.error('❌ Error eliminando materia:', err);
      alert('Error al eliminar la materia');
    }
  };

  return (
    <motion.div
      className="materias-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="materias-header">
        <h2>📚 Materias</h2>
        <button onClick={() => setShowForm(prev => !prev)}>
          {showForm ? 'Cancelar' : '➕ Agregar Materia'}
        </button>
      </div>

      {showForm && (
        <motion.form
          className="materias-form"
          onSubmit={handleSubmit}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <input
            name="carrera"
            placeholder="Carrera"
            value={form.carrera}
            onChange={handleChange}
            required
          />
          <input
            name="materia"
            placeholder="Nombre de la materia"
            value={form.materia}
            onChange={handleChange}
            required
          />
          <input
            name="grupo"
            placeholder="Grupo (ej. 3-B)"
            value={form.grupo}
            onChange={handleChange}
            required
          />
          <button type="submit">{isEditing ? 'Actualizar' : 'Guardar'}</button>
        </motion.form>
      )}

      <motion.table
        className="materias-table"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <thead>
          <tr>
            <th>Carrera</th>
            <th>Materia</th>
            <th>Grupo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {materias.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>
                No hay materias disponibles
              </td>
            </tr>
          ) : (
            materias.map(m => (
              <tr key={m.id}>
                <td>{m.carrera}</td>
                <td>{m.materia}</td>
                <td>{m.grupo}</td>
                <td>
                  <button onClick={() => handleEdit(m)}>✏️</button>
                  <button onClick={() => handleDelete(m.id)}>🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </motion.table>
    </motion.div>
  );
}
