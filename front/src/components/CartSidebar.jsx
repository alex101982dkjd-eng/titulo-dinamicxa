import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartSidebar() {
  const { items, total, open, setOpen, actualizar, eliminar, vaciar } = useCart();
  const navigate = useNavigate();
  if (!open) return null;

  const formatMXN = n => `$${Number(n).toFixed(2)}`;

  return (
    <>
      <div className="cart-overlay" onClick={() => setOpen(false)} />
      <aside className="cart-sidebar">
        <div className="cart-header">
          <h3>Tu Carrito</h3>
          <button className="cart-close" onClick={() => setOpen(false)}>✕</button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <p>Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map(item => (
                <div className="cart-item" key={item.producto_id}>
                  {item.imagen_url
                    ? <img src={item.imagen_url} alt={item.nombre} />
                    : <div style={{ width: 60, height: 60, background: '#f0f0f0', borderRadius: 4, flexShrink: 0 }} />
                  }
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.nombre}</div>
                    <div className="cart-item-price">{formatMXN(item.precio_renta)} / unidad</div>
                    <div className="cart-item-controls">
                      <button className="qty-btn" onClick={() => actualizar(item.producto_id, item.cantidad - 1)}>−</button>
                      <span className="qty-num">{item.cantidad}</span>
                      <button className="qty-btn" onClick={() => actualizar(item.producto_id, item.cantidad + 1)}>+</button>
                      <button className="cart-del" onClick={() => eliminar(item.producto_id)}>🗑</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total estimado:</span>
                <span>{formatMXN(total)}</span>
              </div>
              <button className="btn-dorado" style={{ width: '100%', justifyContent: 'center', marginBottom: 10 }}
                onClick={() => { setOpen(false); navigate('/reservar'); }}>
                Reservar ahora
              </button>
              <button className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => { vaciar(); }}>
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
