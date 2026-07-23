import { useEffect, useState } from 'react';
import API from '../api';
import toast from 'react-hot-toast';

const ESTADOS = ['todos', 'pendiente', 'aceptada', 'cancelada', 'completada'];

export default function Reservaciones() {
  const [reservaciones, setReservaciones] = useState([]);
  const [filtro,        setFiltro]        = useState('todos');
  const [detalle,       setDetalle]       = useState(null);
  const [loading,       setLoading]       = useState(true);

  const cargar = () => {
    setLoading(true);
    const params = filtro !== 'todos' ? `?estado=${filtro}` : '';
    API.get(`/admin/reservaciones${params}`)
      .then(r => setReservaciones(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, [filtro]);

  const cambiarEstado = async (id, estado) => {
    try {
      await API.put(`/admin/reservaciones/${id}/estado`, { estado });
      toast.success(`Reservacion ${estado}`);
      cargar();
      if (detalle?.id === id) setDetalle(prev => ({ ...prev, estado }));
    } catch { toast.error('Error al actualizar estado'); }
  };

  const fmtFecha  = f => new Date(f).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
  const fmtMXN    = n => `$${Number(n).toFixed(2)}`;
  const badgeClass = e => ({ pendiente: 'b-pendiente', aceptada: 'b-aceptada', cancelada: 'b-cancelada', completada: 'b-completada' }[e] || '');

  return (
    <div>
      <div className="page-header">
        <h1>Reservaciones</h1>
        <p>Administra y confirma las solicitudes de renta</p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {ESTADOS.map(e => (
          <button key={e} onClick={() => setFiltro(e)}
            className="btn btn-sm"
            style={{
              background: filtro === e ? 'var(--dorado)' : 'var(--blanco)',
              color: filtro === e ? '#fff' : 'var(--negro)',
              border: '1px solid var(--gris-borde)',
              textTransform: 'capitalize'
            }}>
            {e === 'todos' ? 'Todas' : e}
          </button>
        ))}
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div className="empty-state"><p>Cargando...</p></div>
          ) : reservaciones.length === 0 ? (
            <div className="empty-state"><p>No hay reservaciones</p></div>
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
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservaciones.map(r => (
                  <tr key={r.id}>
                    <td style={{ color: 'var(--gris)', fontSize: '0.8rem' }}>#{r.id}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{r.cliente}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--gris)' }}>{r.telefono || r.email}</div>
                    </td>
                    <td>{fmtFecha(r.fecha_evento)}</td>
                    <td className="truncate" style={{ maxWidth: 160 }}>{r.lugar_entrega}</td>
                    <td style={{ fontWeight: 600, color: 'var(--dorado)' }}>{fmtMXN(r.total_estimado)}</td>
                    <td><span className={`badge ${badgeClass(r.estado)}`}>{r.estado}</span></td>
                    <td>
                      <div className="flex-row" style={{ flexWrap: 'wrap', gap: 4 }}>
                        <button className="btn btn-sm btn-azul" onClick={() => setDetalle(r)}>Ver</button>
                        {r.estado === 'pendiente' && (
                          <>
                            <button className="btn btn-sm btn-verde" onClick={() => cambiarEstado(r.id, 'aceptada')}>Aceptar</button>
                            <button className="btn btn-sm btn-rojo"  onClick={() => cambiarEstado(r.id, 'cancelada')}>Cancelar</button>
                          </>
                        )}
                        {r.estado === 'aceptada' && (
                          <button className="btn btn-sm" style={{ background: '#E3F2FD', color: '#1565C0', border: '1px solid #BBDEFB' }}
                            onClick={() => cambiarEstado(r.id, 'completada')}>Completar</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {detalle && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDetalle(null)}>
          <div className="modal">
            <div className="modal-header">
              <h3>Reservacion #{detalle.id}</h3>
              <button style={{ fontSize: '1.2rem', color: 'var(--gris)' }} onClick={() => setDetalle(null)}>x</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  ['Cliente',      detalle.cliente],
                  ['Email',        detalle.email],
                  ['Telefono',     detalle.telefono || '—'],
                  ['Fecha evento', fmtFecha(detalle.fecha_evento)],
                  ['Hora entrega', detalle.hora_entrega],
                  ['Devolucion',   detalle.hora_devolucion || '—'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--gris)', textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: '0.9rem' }}>{v}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--gris)', textTransform: 'uppercase', marginBottom: 2 }}>Lugar</div>
                <div>{detalle.lugar_entrega}</div>
              </div>
              {detalle.notas && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--gris)', textTransform: 'uppercase', marginBottom: 2 }}>Notas</div>
                  <div style={{ color: 'var(--gris)' }}>{detalle.notas}</div>
                </div>
              )}
              <div style={{ background: 'var(--bg)', borderRadius: 6, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>Total estimado</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--dorado)' }}>{fmtMXN(detalle.total_estimado)}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--gris)' }}>Estado actual:</span>
                <span className={`badge ${badgeClass(detalle.estado)}`}>{detalle.estado}</span>
              </div>
            </div>
            <div className="modal-footer">
              {detalle.estado === 'pendiente' && (
                <>
                  <button className="btn btn-verde" onClick={() => cambiarEstado(detalle.id, 'aceptada')}>Aceptar</button>
                  <button className="btn btn-rojo"  onClick={() => cambiarEstado(detalle.id, 'cancelada')}>Cancelar</button>
                </>
              )}
              {detalle.estado === 'aceptada' && (
                <button className="btn" style={{ background: '#E3F2FD', color: '#1565C0' }}
                  onClick={() => cambiarEstado(detalle.id, 'completada')}>Marcar completada</button>
              )}
              <button className="btn btn-outline" onClick={() => setDetalle(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
