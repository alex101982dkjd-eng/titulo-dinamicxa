import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const { items, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">Elegance<span>Events</span></Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link to="/catalogo" onClick={() => setMenuOpen(false)}>Catálogo</Link>
          <Link to="/reservar" onClick={() => setMenuOpen(false)}>Reservar</Link>
          <Link to="/calendario" onClick={() => setMenuOpen(false)}>Disponibilidad</Link>
          <Link to="/contacto" onClick={() => setMenuOpen(false)}>Contacto</Link>
        </div>

        <div className="navbar-actions">
          <button className="cart-btn" onClick={() => setOpen(true)} title="Carrito">
            🛒
            {items.length > 0 && <span className="cart-badge">{items.length}</span>}
          </button>
          {usuario ? (
            <>
              <Link to="/mis-reservaciones" className="btn-outline" style={{ padding: '7px 16px', fontSize: '0.8rem' }}>
                {usuario.nombre.split(' ')[0]}
              </Link>
              <button className="btn-outline" style={{ padding: '7px 16px', fontSize: '0.8rem' }} onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-dorado" style={{ padding: '8px 20px', fontSize: '0.8rem' }}>
              Iniciar sesión
            </Link>
          )}
          <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  );
}
