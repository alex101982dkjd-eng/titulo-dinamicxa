import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password) { toast.error('Completa todos los campos'); return; }
    setCargando(true);
    try {
      const usr = await login(form.email, form.password);
      toast.success(`Bienvenido, ${usr.nombre}!`);
      navigate(usr.rol === 'admin' ? '/' : '/');
    } catch (err) {
      toast.error(err.response?.data?.mensaje || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">Elegance<span>Events</span></div>
        <h1 className="auth-sub">Inicia sesión en tu cuenta</h1>
        <div className="auth-form">
          <div className="form-group">
            <label>Correo electrónico</label>
            <input type="email" placeholder="tu@correo.com"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          <button className="btn-dorado" style={{ justifyContent: 'center', marginTop: 8 }}
            onClick={handleSubmit} disabled={cargando}>
            {cargando ? 'Cargando...' : 'Iniciar sesión'}
          </button>
        </div>
        <p className="auth-switch">¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
      </div>
    </div>
  );
}

export function Registro() {
  const { registro } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', telefono: '', direccion: '' });
  const [cargando, setCargando] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.nombre || !form.email || !form.password) { toast.error('Completa los campos requeridos'); return; }
    if (form.password.length < 6) { toast.error('La contraseña debe tener al menos 6 caracteres'); return; }
    setCargando(true);
    try {
      await registro(form);
      toast.success('Cuenta creada. ¡Ahora inicia sesión!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.mensaje || 'Error al registrarse');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">Elegance<span>Events</span></div>
        <h1 className="auth-sub">Crea tu cuenta gratis</h1>
        <div className="auth-form">
          <div className="form-group">
            <label>Nombre completo *</label>
            <input type="text" placeholder="Tu nombre" value={form.nombre} onChange={e => set('nombre', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Correo electrónico *</label>
            <input type="email" placeholder="tu@correo.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Contraseña *</label>
            <input type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={e => set('password', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input type="tel" placeholder="771 000 0000" value={form.telefono} onChange={e => set('telefono', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Dirección</label>
            <textarea placeholder="Tu dirección (opcional)" value={form.direccion} onChange={e => set('direccion', e.target.value)} style={{ minHeight: 70 }} />
          </div>
          <button className="btn-dorado" style={{ justifyContent: 'center', marginTop: 8 }}
            onClick={handleSubmit} disabled={cargando}>
            {cargando ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </div>
        <p className="auth-switch">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
      </div>
    </div>
  );
}
