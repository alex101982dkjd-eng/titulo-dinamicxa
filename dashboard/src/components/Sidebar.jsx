import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LINKS = [
  { to: '/',             icon: 'IC', label: 'Inicio' },
  { to: '/productos',    icon: 'PR', label: 'Productos' },
  { to: '/reservaciones',icon: 'RS', label: 'Reservaciones' },
  { to: '/clientes',     icon: 'CL', label: 'Clientes' },
  { to: '/mensajes',     icon: 'MS', label: 'Mensajes' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const usuario  = JSON.parse(localStorage.getItem('dash_usuario') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('dash_token');
    localStorage.removeItem('dash_usuario');
    toast.success('Sesión cerrada');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Elegance<span>Events</span></div>
      <nav className="sidebar-nav">
        {LINKS.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-foot">
        <div className="sidebar-user">Admin: {usuario.nombre || 'Admin'}</div>
        <button className="btn-logout" onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </aside>
  );
}
