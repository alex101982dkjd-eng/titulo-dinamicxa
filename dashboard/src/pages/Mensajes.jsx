import { useEffect, useState } from 'react';
import API from '../api';
import toast from 'react-hot-toast';

export default function Mensajes() {
  const [mensajes, setMensajes] = useState([]);
  const [detalle,  setDetalle]  = useState(null);
  const [loading,  setLoading]  = useState(true);

  const cargar = () => {
    API.get('/admin/mensajes').then(r => setMensajes(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const marcarLeido = async (id) => {
    try {
      await API.put(`/admin/mensajes/${id}`);
      cargar();
      if (detalle?.id === id) setDetalle(prev => ({ ...prev, leido: 1 }));
    } catch { toast.error('Error al marcar'); }
  };

  const fmtFecha = f => new Date(f).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const noLeidos = mensajes.filter(m => !m.leido).length;

  return (
    <div>
      <div className="page-header">
        <h1>Mensajes de contacto</h1>
        <p>{noLeidos > 0 ? `${noLeidos} mensaje(s) sin leer` : 'Todos los mensajes leidos'}</p>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div className="empty-state"><p>Cargando...</p></div>
          ) : mensajes.length === 0 ? (
            <div className="empty-state"><p>No hay mensajes aun</p></div>
          ) : (
            <table className="tabla">
              <thead>
                <tr>
                  <th></th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Telefono</th>
                  <th>Mensaje</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {mensajes.map(m => (
                  <tr key={m.id} style={{ background: m.leido ? 'transparent' : '#FFFBEB' }}>
                    <td>
                      {!m.leido && (
                        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--naranja)' }} />
                      )}
                    </td>
                    <td style={{ fontWeight: m.leido ? 400 : 600 }}>{m.nombre}</td>
                    <td style={{ color: 'var(--gris)' }}>{m.email}</td>
                    <td>{m.telefono || '—'}</td>
                    <td className="truncate" style={{ maxWidth: 180 }}>{m.mensaje}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gris)' }}>{fmtFecha(m.creado_en)}</td>
                    <td>
                      <div className="flex-row">
                        <button className="btn btn-sm btn-azul" onClick={() => setDetalle(m)}>Ver</button>
                        {!m.leido && (
                          <button className="btn btn-sm btn-verde" onClick={() => marcarLeido(m.id)}>Leido</button>
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
              <h3>Mensaje de {detalle.nombre}</h3>
              <button style={{ fontSize: '1.2rem', color: 'var(--gris)' }} onClick={() => setDetalle(null)}>x</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[['Nombre', detalle.nombre], ['Email', detalle.email], ['Telefono', detalle.telefono || '—'], ['Fecha', fmtFecha(detalle.creado_en)]].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--gris)', textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                    <div>{v}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--gris)', textTransform: 'uppercase', marginBottom: 8 }}>Mensaje</div>
                <div style={{ background: 'var(--bg)', padding: '14px 16px', borderRadius: 6, lineHeight: 1.7, fontSize: '0.9rem' }}>{detalle.mensaje}</div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <a href={`mailto:${detalle.email}`} className="btn btn-primary">Responder por email</a>
                {detalle.telefono && (
                  <a href={`https://wa.me/521${detalle.telefono.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                    className="btn" style={{ background: '#25D366', color: '#fff' }}>
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
            <div className="modal-footer">
              {!detalle.leido && (
                <button className="btn btn-verde" onClick={() => marcarLeido(detalle.id)}>Marcar como leido</button>
              )}
              <button className="btn btn-outline" onClick={() => setDetalle(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
