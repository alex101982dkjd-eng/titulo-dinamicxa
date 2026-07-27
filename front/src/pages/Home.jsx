import { Link } from 'react-router-dom';

const PAQUETES = [
  {
    nombre: 'Paquete Básico',
    badge: null,
    items: ['50 sillas plegables', '5 mesas rectangulares', 'Manteles blancos', 'Entrega y recolección'],
    desde: 1800,
  },
  {
    nombre: 'Paquete Elegance',
    badge: '⭐ Popular',
    items: ['100 sillas Tiffany', '10 mesas redondas', 'Manteles satinados', 'Carpa 6×6m', 'Entrega y recolección'],
    desde: 4500,
  },
  {
    nombre: 'Paquete Premium',
    badge: '👑 Bodas',
    items: ['150 sillas Chiavari', '15 mesas redondas', 'Manteles bordados', 'Carpa 10×10m', '2 arcos florales', 'Candelabros'],
    desde: 9800,
  },
];

export default function Home() {
  const wsp = 'https://wa.me/5536456171?text=Hola,%20me%20gustaría%20cotizar%20mobiliario%20para%20evento';
  const mail = 'mailto:contacto@eleganceevents.com';

  return (
    <div className="page-top">
      {/* ── HERO ── */}
      <section className="hero">
        <img
          className="hero-img"
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80"
          alt="Boda elegante"
        />
        <div className="hero-bg" />
        <div className="container">
          <div className="hero-content">
            <p className="hero-eyebrow">✦ Alquiladora de Mobiliario</p>
            <h1 className="hero-title">
              Haz de tu evento <em>un momento inolvidable</em>
            </h1>
            <p className="hero-subtitle">
              Sillas, mesas, carpas, manteles y accesorios de alta calidad para bodas,
              fiestas y reuniones empresariales en toda la región.
            </p>
            <div className="hero-ctas">
              <Link to="/catalogo" className="btn-dorado">Ver catálogo</Link>
              <a href={wsp} target="_blank" rel="noreferrer" className="btn-wsp">💬 WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section className="section" style={{ background: 'var(--blanco-humo)' }}>
        <div className="container text-center">
          <p className="section-label">¿Por qué elegirnos?</p>
          <h2 className="section-title">Todo para tu evento perfecto</h2>
          <div className="divider-gold" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 28, marginTop: 48 }}>
            {[
              { icon: '🪑', titulo: 'Sillas & Mesas',  texto: 'Gran variedad de estilos para cualquier tipo de evento.' },
              { icon: '⛺', titulo: 'Carpas',          texto: 'Protege a tus invitados con nuestras carpas resistentes.' },
              { icon: '🍽',  titulo: 'Manteles',        texto: 'Manteles satinados, bordados y de diferentes colores.' },
              { icon: '✨',  titulo: 'Accesorios',      texto: 'Arcos florales, candelabros y decoración especial.' },
            ].map(s => (
              <div key={s.titulo} className="card" style={{ padding: '28px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: 12 }}>{s.icon}</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>{s.titulo}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--gris)' }}>{s.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA (lista ordenada) ── */}
      <section className="section" style={{ background: 'var(--blanco-humo)' }}>
        <div className="container text-center">
          <p className="section-label">Es muy sencillo</p>
          <h2 className="section-title">Renta en 3 pasos</h2>
          <div className="divider-gold" />
          <ol className="pasos-lista">
            <li>
              <h3>Elige tu mobiliario</h3>
              <p>Explora el catálogo y agrega sillas, mesas, carpas y accesorios a tu carrito.</p>
            </li>
            <li>
              <h3>Reserva tu fecha</h3>
              <p>Indica la fecha y el lugar de tu evento; confirmamos disponibilidad enseguida.</p>
            </li>
            <li>
              <h3>Disfruta tu evento</h3>
              <p>Entregamos, instalamos y recolectamos todo para que solo te preocupes de celebrar.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* ── VIDEO PROMOCIONAL ── */}
      <section className="section">
        <div className="container text-center">
          <p className="section-label">Conócenos</p>
          <h2 className="section-title">Mira cómo transformamos cada evento</h2>
          <div className="divider-gold" />
          <div className="video-wrap">
            <video controls preload="metadata" poster="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80">
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              Tu navegador no soporta la reproducción de video.
            </video>
          </div>
        </div>
      </section>

      {/* ── PAQUETES ── */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 48 }}>
            <p className="section-label">Paquetes destacados</p>
            <h2 className="section-title">Todo incluido para tu evento</h2>
            <div className="divider-gold" />
            <p className="section-subtitle">Elige el paquete que mejor se adapte a tus necesidades o contáctanos para una cotización personalizada.</p>
          </div>
          <div className="paquetes-grid">
            {PAQUETES.map(p => (
              <div className="paquete-card" key={p.nombre}>
                <div className="paquete-header">
                  <h3>{p.nombre}</h3>
                  {p.badge && <span className="paquete-badge">{p.badge}</span>}
                </div>
                <div className="paquete-body">
                  <ul className="paquete-items">
                    {p.items.map(i => <li key={i}>{i}</li>)}
                  </ul>
                  <div className="paquete-precio">
                    <div className="paquete-desde">Desde</div>
                    <div className="paquete-monto">${p.desde.toLocaleString()}</div>
                    <Link to="/reservar" className="btn-dorado" style={{ marginTop: 16, display: 'inline-flex', justifyContent: 'center', width: '100%' }}>
                      Reservar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA CONTACTO ── */}
      <section className="section" style={{ background: 'var(--negro)', color: 'var(--blanco)' }}>
        <div className="container text-center">
          <h2 style={{ color: 'var(--blanco)', marginBottom: 12 }}>¿Tienes un evento próximo?</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
            Contáctanos y obtén una cotización personalizada sin compromiso en menos de 24 horas.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={wsp} target="_blank" rel="noreferrer" className="btn-wsp">💬 Cotizar por WhatsApp</a>
            <a href={mail} className="btn-outline">✉ Enviar correo</a>
          </div>
        </div>
      </section>
    </div>
  );
}
