import { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

export default function DashHome() {
  const [stats, setStats] = useState(null);
  const [reservaciones, setReservaciones] = useState([]);

  useEffect(() => {
    API.get('/admin/stats').then(r => setStats(r.data)).catch(() => {});
    API.get('/admin/reservaciones?estado=pendiente').then(r => setReservaciones(r.data.slice(0, 5))).catch(() => {});
  }, []);

  const fmtFecha = f => new Date(f).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  const fmtMXN   = n => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

  const STATS = stats ? [
    { label: 'Productos activos',   value: stats.productos,    color: '#3B82F6' },
    { label: 'Clientes',            value: stats.clientes,     color: '#10B981' },
    { label: 'Reservaciones',       value: stats.reservaciones,color: '#8B5CF6' },
    { label: 'Pendientes',          value: stats.pendientes,   color: '#F59E0B' },
    { label: 'Ingresos estimados',  value: fmtMXN(stats.ingresos), color: '#C9A84C', wide: true },
  ] : [];

  return (
    <div>
      <div className="page-header">
        <h1>Panel de control</h1>
        <p>Resumen general de la alquiladora</p>
      </div>

      <div className="stats-grid">
        {STATS.map(s => (
          <div className="stat-card" key={s.label} style={s.wide ? { gridColumn: 'span 2' } : {}}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value ?? '—'}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Reservaciones pendientes</h2>
          <Link to="/reservaciones" className="btn btn-sm btn-outline">Ver todas</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          {reservaciones.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-text">—</div>
              <p>No hay reservaciones pendientes</p>
            </div>
          ) : (
            <table className="tabla">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Fecha evento</th>
                  <th>Lugar</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservaciones.map(r => (
                  <tr key={r.id}>
                    <td style={{ color: 'var(--gris)', fontSize: '0.8rem' }}>#{r.id}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{r.cliente}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--gris)' }}>{r.email}</div>
                    </td>
                    <td>{fmtFecha(r.fecha_evento)}</td>
                    <td className="truncate">{r.lugar_entrega}</td>
                    <td style={{ fontWeight: 600, color: 'var(--dorado)' }}>{fmtMXN(r.total_estimado)}</td>
                    <td><span className="badge b-pendiente">Pendiente</span></td>
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
