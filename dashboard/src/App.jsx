import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar      from './components/Sidebar';
import Login        from './pages/Login';
import DashHome     from './pages/DashHome';
import Productos    from './pages/Productos';
import Reservaciones from './pages/Reservaciones';
import Clientes     from './pages/Clientes';
import Mensajes     from './pages/Mensajes';

function RequireAdmin({ children }) {
  const token   = localStorage.getItem('dash_token');
  const usuario = JSON.parse(localStorage.getItem('dash_usuario') || 'null');
  const location = useLocation();
  if (!token || usuario?.rol !== 'admin') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function DashLayout({ children }) {
  return (
    <div className="dash-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' } }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <RequireAdmin>
            <DashLayout><DashHome /></DashLayout>
          </RequireAdmin>
        } />
        <Route path="/productos" element={
          <RequireAdmin>
            <DashLayout><Productos /></DashLayout>
          </RequireAdmin>
        } />
        <Route path="/reservaciones" element={
          <RequireAdmin>
            <DashLayout><Reservaciones /></DashLayout>
          </RequireAdmin>
        } />
        <Route path="/clientes" element={
          <RequireAdmin>
            <DashLayout><Clientes /></DashLayout>
          </RequireAdmin>
        } />
        <Route path="/mensajes" element={
          <RequireAdmin>
            <DashLayout><Mensajes /></DashLayout>
          </RequireAdmin>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
