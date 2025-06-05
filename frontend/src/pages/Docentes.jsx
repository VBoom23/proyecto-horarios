// src/pages/Docentes.jsx
import React, { useEffect, useState } from 'react';
import './docentes.css';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Docentes() {
  const [docentes, setDocentes] = useState([]);
  const [opcionesMaterias, setOpcionesMaterias] = useState([]);
  const [nuevoDocente, setNuevoDocente] = useState({
    nombre: '',
    usuario: '',
    contrasena: '',
    materiaId: ''
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    console.log('🚀 useEffect: iniciando fetch');
    // Usamos URL absoluta para descartar problemas de proxy
    fetch('http://localhost:5000/api/materias')
      .then(res => {
        console.log('🔹 GET /api/materias →', res.status, res.url);
        return res.json();
      })
      .then(data => {
        console.log('📦 materias recibidas:', data);
        setOpcionesMaterias(data);
      })
      .catch(err => console.error('❌ Error materias:', err));

    fetch('http://localhost:5000/api/docentes')
      .then(res => {
        console.log('🔹 GET /api/docentes →', res.status, res.url);
        return res.json();
      })
      .then(data => {
        console.log('📦 docentes recibidos:', data);
        setDocentes(data.sort((a,b)=>a.nombre.localeCompare(b.nombre)));
      })
      .catch(err => console.error('❌ Error docentes:', err));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setNuevoDocente(prev => ({ ...prev, [name]: value }));
  };

  const guardarDocente = e => {
    e.preventDefault();
    const url = editando
      ? `http://localhost:5000/api/docentes/${editando}`
      : 'http://localhost:5000/api/docentes';
    const method = editando ? 'PUT' : 'POST';

    console.log(`➡️ ${method} ${url}`, nuevoDocente);
    fetch(url, {
      method,
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(nuevoDocente)
    })
      .then(res => {
        console.log('↩️ Response guardar →', res.status);
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(() => {
        // recarga docentes
        return fetch('http://localhost:5000/api/docentes');
      })
      .then(res => res.json())
      .then(data => {
        console.log('🔄 docentes actualizados:', data);
        setDocentes(data.sort((a,b)=>a.nombre.localeCompare(b.nombre)));
        setNuevoDocente({nombre:'',usuario:'',contrasena:'',materiaId:''});
        setEditando(null);
        setMostrarFormulario(false);
      })
      .catch(err => console.error('❌ Error guardarDocente:', err));
  };

  const eliminarDocente = usuario => {
    if (!window.confirm('¿Eliminar este docente?')) return;
    fetch(`http://localhost:5000/api/docentes/${usuario}`, {method:'DELETE'})
      .then(res => {
        console.log('🗑️ DELETE /api/docentes/'+usuario, res.status);
        return fetch('http://localhost:5000/api/docentes');
      })
      .then(res => res.json())
      .then(data => {
        console.log('🔄 después de delete:', data);
        setDocentes(data);
      })
      .catch(err => console.error('❌ Error eliminar:', err));
  };

  const editarDocente = d => {
    setNuevoDocente({
      nombre: d.nombre,
      usuario: d.usuario,
      contrasena: d.contrasena,
      materiaId: d.materiaId
    });
    setEditando(d.usuario);
    setMostrarFormulario(true);
  };

  return (
    <motion.div
      className="docentes-container"
      initial={{ opacity:0, x:100 }}
      animate={{ opacity:1, x:0 }}
      transition={{ duration:0.5 }}
    >
      <div className="top-bar">
        <h2>👨‍🏫 Lista de Docentes</h2>
        <Link to="/admin-panel" className="btn-regresar">⬅️ Regresar</Link>
      </div>

      <motion.table
        className="tabla-docentes"
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        transition={{ delay:0.2 }}
      >
        <thead>
          <tr>
            <th>Nombre</th><th>Usuario</th><th>Contraseña</th><th>Materia</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {docentes.map(d => (
            <motion.tr key={d.usuario} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}>
              <td>{d.nombre}</td>
              <td>{d.usuario}</td>
              <td>{d.contrasena}</td>
              <td>{d.materia}</td>
              <td className="acciones">
                <button onClick={()=>editarDocente(d)}>✏️</button>
                <button onClick={()=>eliminarDocente(d.usuario)}>🗑️</button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>

      <motion.h3
        onClick={()=>setMostrarFormulario(!mostrarFormulario)}
        style={{ cursor:'pointer', marginTop:'1rem' }}
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        transition={{ delay:0.3 }}
      >
        {mostrarFormulario ? '🔽 Ocultar formulario' : '➕ Agregar Nuevo Docente'}
      </motion.h3>

      {mostrarFormulario && (
        <motion.form
          className="form-docente"
          onSubmit={guardarDocente}
          initial={{ scale:0.95, opacity:0 }}
          animate={{ scale:1, opacity:1 }}
          transition={{ delay:0.4 }}
        >
          <input name="nombre" placeholder="Nombre"      value={nuevoDocente.nombre}  onChange={handleChange} required />
          <input name="usuario" placeholder="Usuario"    value={nuevoDocente.usuario} onChange={handleChange} required disabled={!!editando} />
          <input name="contrasena" type="password" placeholder="Contraseña" value={nuevoDocente.contrasena} onChange={handleChange} required />
          <select name="materiaId" value={nuevoDocente.materiaId} onChange={handleChange} required>
            <option value="" disabled>Selecciona materia</option>
            {opcionesMaterias.map(m => (
              <option key={m.id} value={m.id}>
                {m.carrera} – {m.materia} ({m.grupo})
              </option>
            ))}
          </select>
          <button type="submit">{editando ? 'Actualizar' : 'Guardar'}</button>
        </motion.form>
      )}
    </motion.div>
  );
}
