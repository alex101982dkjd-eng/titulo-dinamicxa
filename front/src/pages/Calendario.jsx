import { useState, useEffect } from 'react';
import { API } from '../context/AuthContext';

export default function Calendario() {
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [mes, setMes]   = useState(new Date());

  useEffect(() => {
    API.get('/reservaciones-fechas').then(r => setFechasOcupadas(r.data)).catch(() => {});
  }, []);

  const ocupadas = new Set(fechasOcupadas.map(f => f.toString().split('T')[0]));

  const diasMes = () => {
    const year = mes.getFullYear(), month = mes.getMonth();
    const primer = new Date(year, month, 1);
    const ultimo  = new Date(year, month + 1, 0);
    const dias = [];
    // padding inicio
    for (let i = 0; i < primer.getDay(); i++) dias.push(null);
    for (let d = 1; d <= ultimo.getDate(); d++) dias.push(new Date(year, month, d));
    return dias;
  };

  const fmtKey = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const hoy    = fmtKey(new Date());

  const mesLabel = mes.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });

  return (
    <div className="page-top">
      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="text-center" style={{ marginBottom: 36 }}>
            <p className="section-label">Disponibilidad</p>
            <h1 className="section-title">Calendario de fechas</h1>
            <div className="divider-gold" />
            <p className="section-subtitle">Consulta las fechas disponibles antes de realizar tu reservación.</p>
          </div>

          {/* Leyenda */}
          <ul style={{ listStyle: 'none', display: 'flex', gap: 24, justifyContent: 'center', marginBottom: 28, flexWrap: 'wrap' }}>
            {[['var(--blanco)', '#E8E6E1', 'Disponible'], ['#FFEBEE', '#FFCDD2', 'Ocupada'], ['var(--dorado)', 'var(--dorado)', 'Hoy']].map(([bg, border, label]) => (
              <li key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                <div style={{ width: 20, height: 20, background: bg, border: `2px solid ${border}`, borderRadius: 4 }} />
                {label}
              </li>
            ))}
          </ul>

          <div className="calendar-wrap">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <button className="btn-outline" style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                onClick={() => setMes(m => new Date(m.getFullYear(), m.getMonth()-1, 1))}>
                ← Anterior
              </button>
              <h3 style={{ textTransform: 'capitalize' }}>{mesLabel}</h3>
              <button className="btn-outline" style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                onClick={() => setMes(m => new Date(m.getFullYear(), m.getMonth()+1, 1))}>
                Siguiente →
              </button>
            </div>

            {/* Días de semana */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 8 }}>
              {['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gris)', padding: '6px 0' }}>{d}</div>
              ))}
            </div>

            {/* Días */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
              {diasMes().map((dia, i) => {
                if (!dia) return <div key={`e-${i}`} />;
                const key      = fmtKey(dia);
                const esHoy    = key === hoy;
                const ocupada  = ocupadas.has(key);
                const pasado   = key < hoy;

                return (
                  <div key={key} style={{
                    textAlign: 'center',
                    padding: '10px 4px',
                    borderRadius: 6,
                    fontSize: '0.875rem',
                    fontWeight: esHoy ? 700 : 400,
                    background: esHoy ? 'var(--dorado)' : ocupada ? '#FFEBEE' : 'var(--blanco-humo)',
                    color: esHoy ? 'var(--blanco)' : ocupada ? '#C62828' : pasado ? 'var(--gris)' : 'var(--negro)',
                    border: esHoy ? 'none' : ocupada ? '1.5px solid #FFCDD2' : '1px solid var(--gris-claro)',
                    opacity: pasado && !esHoy ? 0.5 : 1,
                  }}>
                    {dia.getDate()}
                    {ocupada && !esHoy && <div style={{ fontSize: '0.6rem', marginTop: 2 }}>Ocupada</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
