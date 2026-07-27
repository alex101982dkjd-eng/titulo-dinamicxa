import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">Elegance<span>Events</span></div>
            <p className="footer-desc">
              Alquiladora de sillas, mesas, carpas y mobiliario para eventos en Jilotepec, Estado de México.
              Hacemos que cada evento sea especial.
            </p>
          </div>
          <div className="footer-col">
            <h4>Navegación</h4>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/catalogo">Catálogo</Link></li>
              <li><Link to="/reservar">Reservar</Link></li>
              <li><Link to="/calendario">Disponibilidad</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contacto</h4>
            <ul>
              <li><a href="https://wa.me/5536456171" target="_blank" rel="noreferrer">💬 WhatsApp</a></li>
              <li><a href="mailto:contacto@eleganceevents.com">✉ Correo</a></li>
              <li><a href="#">📍 Jilotepec, Estado de México</a></li>
              <li><a href="#">🕐 Lun–Sáb: 9AM–7PM</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Síguenos</h4>
            <div className="footer-social">
              <a href="https://facebook.com/eleganceevents" target="_blank" rel="noreferrer" aria-label="Facebook">📘</a>
              <a href="https://instagram.com/eleganceevents" target="_blank" rel="noreferrer" aria-label="Instagram">📷</a>
              <a href="https://tiktok.com/@eleganceevents" target="_blank" rel="noreferrer" aria-label="TikTok">🎵</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} EleganceEvents · Todos los derechos reservados
        </div>
      </div>
    </footer>
  );
}
