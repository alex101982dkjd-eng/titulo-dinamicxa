import { useEffect, useState } from 'react';
import API from '../api';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [buscar,   setBuscar]   = useState('');
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    API.get('/admin/clientes').then(r => setClientes(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const fmtFecha = f => new Date(f).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });

  const filtrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
    c.email.toLowerCase().includes(buscar.toLowerCase())
  );

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Clientes</h1>
          <p>{clientes.length} clientes registrados</p>
        </div>
        <input
          style={{ padding: '8px 14px', border: '1.5px solid var(--gris-borde)', borderRadius: 6, fontSize: '0.875rem', outline: 'none', minWidth: 220 }}
          placeholder="Buscar por nombre o email..."
          value={buscar} onChange={e => setBuscar(e.target.value)}
        />
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div className="empty-state"><p>Cargando...</p></div>
          ) : filtrados.length === 0 ? (
            <div className="empty-state"><p>No se encontraron clientes</p></div>
          ) : (
            <table className="tabla">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Telefono</th>
                  <th>Direccion</th>
                  <th>Registro</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(c => (
                  <tr key={c.id}>
                    <td style={{ color: 'var(--gris)', fontSize: '0.8rem' }}>{c.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: 'var(--dorado)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0
                        }}>
                          {c.nombre.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500 }}>{c.nombre}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--gris)' }}>{c.email}</td>
                    <td>{c.telefono || '—'}</td>
                    <td className="truncate">{c.direccion || '—'}</td>
                    <td style={{ color: 'var(--gris)', fontSize: '0.82rem' }}>{fmtFecha(c.creado_en)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
