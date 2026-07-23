import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Reservar() {
  const { items, total, vaciar } = useCart();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fecha_evento:    '',
    hora_entrega:    '',
    hora_devolucion: '',
    lugar_entrega:   '',
    notas:           '',
  });
  const [enviando, setEnviando] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!usuario) { toast.error('Inicia sesión para reservar'); navigate('/login'); return; }
    if (!items.length) { toast.error('Tu carrito está vacío'); return; }
    if (!form.fecha_evento || !form.hora_entrega || !form.lugar_entrega) {
      toast.error('Completa los campos requeridos'); return;
    }

    setEnviando(true);
    try {
      const productos = items.map(i => ({ producto_id: i.producto_id, cantidad: i.cantidad }));
      const { data } = await API.post('/reservaciones', { ...form, productos });
      toast.success('¡Reservación enviada! Te contactaremos pronto.');
      await vaciar();
      navigate('/mis-reservaciones');
    } catch (err) {
      toast.error(err.response?.data?.mensaje || 'Error al enviar reservación');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="page-top">
      <section className="section">
        <div className="container reservar-wrap">
          <div className="text-center" style={{ marginBottom: 36 }}>
            <p className="section-label">Paso final</p>
            <h1 className="section-title">Solicitud de renta</h1>
            <div className="divider-gold" />
          </div>

          {/* Resumen del carrito */}
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--gris)' }}>
              <p style={{ fontSize: '2rem', marginBottom: 12 }}>🛒</p>
              <p>No hay productos en tu carrito.</p>
              <button className="btn-dorado" style={{ marginTop: 20 }} onClick={() => navigate('/catalogo')}>
                Ver catálogo
              </button>
            </div>
          ) : (
            <>
              <div style={{ background: 'var(--blanco-humo)', borderRadius: 8, padding: '20px 24px', marginBottom: 28 }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Productos a rentar</h2>
                <table className="reservar-table">
                  <thead>
                    <tr>
                      <th scope="col">Producto</th>
                      <th scope="col">Cantidad</th>
                      <th scope="col">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(i => (
                      <tr key={i.producto_id}>
                        <td>{i.nombre}</td>
                        <td>x{i.cantidad}</td>
                        <td>${(i.precio_renta * i.cantidad).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2}>Total estimado</td>
                      <td style={{ fontSize: '1.05rem' }}>${total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="reservar-form">
                <h2 style={{ fontSize: '1.1rem', marginBottom: 4 }}>Datos del evento</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label>Fecha del evento *</label>
                    <input type="date" value={form.fecha_evento} onChange={e => set('fecha_evento', e.target.value)}
                      min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="form-group">
                    <label>Hora de entrega *</label>
                    <input type="time" value={form.hora_entrega} onChange={e => set('hora_entrega', e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Hora de devolución</label>
                  <input type="time" value={form.hora_devolucion} onChange={e => set('hora_devolucion', e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Lugar de entrega *</label>
                  <input type="text" placeholder="Dirección completa del evento"
                    value={form.lugar_entrega} onChange={e => set('lugar_entrega', e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Notas adicionales</label>
                  <textarea placeholder="Indicaciones especiales, tipo de evento, etc."
                    value={form.notas} onChange={e => set('notas', e.target.value)} />
                </div>

                <button className="btn-dorado" onClick={handleSubmit} disabled={enviando}
                  style={{ justifyContent: 'center', marginTop: 8 }}>
                  {enviando ? 'Enviando...' : '✓ Confirmar solicitud de renta'}
                </button>
                <p style={{ fontSize: '0.8rem', color: 'var(--gris)', textAlign: 'center' }}>
                  Te contactaremos para confirmar disponibilidad y coordinar el pago.
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
