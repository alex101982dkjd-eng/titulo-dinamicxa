import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';

export default function MisReservaciones() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [reservaciones, setReservaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!usuario) { navigate('/login'); return; }
    API.get('/reservaciones/mias')
      .then(r => setReservaciones(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [usuario]);

  const estadoClass = e => ({ pendiente: 'res-pendiente', aceptada: 'res-aceptada', cancelada: 'res-cancelada', completada: 'res-completada' }[e] || '');
  const estadoLabel = e => ({ pendiente: 'Pendiente', aceptada: 'Aceptada ✓', cancelada: 'Cancelada', completada: 'Completada' }[e] || e);
  const fmtFecha = f => new Date(f).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
  const fmtMXN  = n => `$${Number(n).toFixed(2)}`;

  return (
    <div className="page-top">
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="text-center" style={{ marginBottom: 36 }}>
            <p className="section-label">Mi cuenta</p>
            <h1 className="section-title">Mis Reservaciones</h1>
            <div className="divider-gold" />
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--gris)', padding: '40px 0' }}>Cargando...</p>
          ) : reservaciones.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--gris)' }}>
              <p style={{ fontSize: '2rem', marginBottom: 12 }}>📋</p>
              <p>Aún no tienes reservaciones.</p>
              <button className="btn-dorado" style={{ marginTop: 20 }} onClick={() => navigate('/catalogo')}>
                Ver catálogo
              </button>
            </div>
          ) : (
            <div className="mis-res-grid">
              {reservaciones.map(r => (
                <div className="res-card" key={r.id}>
                  <div>
                    <span className={`res-estado ${estadoClass(r.estado)}`}>{estadoLabel(r.estado)}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>📅 {fmtFecha(r.fecha_evento)}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gris)' }}>📍 {r.lugar_entrega}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--dorado-oscuro)' }}>
                      {fmtMXN(r.total_estimado)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gris)' }}>estimado</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
