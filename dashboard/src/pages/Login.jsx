import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.email || !form.password) { toast.error('Completa todos los campos'); return; }
    setCargando(true);
    try {
      const { data } = await API.post('/auth/login', form);
      if (data.usuario.rol !== 'admin') {
        toast.error('Acceso solo para administradores');
        return;
      }
      localStorage.setItem('dash_token', data.token);
      localStorage.setItem('dash_usuario', JSON.stringify(data.usuario));
      toast.success('Bienvenido al panel');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.mensaje || 'Credenciales incorrectas');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-box">
        <div className="login-title">Elegance<span>Events</span></div>
        <p className="login-sub">Panel de administración</p>
        <div className="login-form">
          <div className="form-group">
            <label>Correo electrónico</label>
            <input type="email" placeholder="admin@alquiladora.com"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          <button className="btn btn-primary" style={{ justifyContent: 'center', marginTop: 8 }}
            onClick={handleSubmit} disabled={cargando}>
            {cargando ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}
