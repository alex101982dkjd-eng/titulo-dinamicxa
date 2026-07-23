import { useState, useEffect } from 'react';
import { API } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Catalogo() {
  const [productos, setProductos]     = useState([]);
  const [categorias, setCategorias]   = useState([]);
  const [catActiva, setCatActiva]     = useState(null);
  const [buscar, setBuscar]           = useState('');
  const [loading, setLoading]         = useState(true);
  const { agregar } = useCart();

  useEffect(() => {
    API.get('/categorias').then(r => setCategorias(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (catActiva) params.categoria_id = catActiva;
    if (buscar)    params.buscar = buscar;
    API.get('/productos', { params })
      .then(r => setProductos(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [catActiva, buscar]);

  const formatMXN = n => `$${Number(n).toFixed(2)}`;

  return (
    <div className="page-top">
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 40 }}>
            <p className="section-label">Catálogo</p>
            <h1 className="section-title">Nuestro mobiliario</h1>
            <div className="divider-gold" />
          </div>

          {/* Filtros */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 36 }}>
            <div className="filtros" style={{ margin: 0 }}>
              <button className={`filtro-btn ${!catActiva ? 'activo' : ''}`} onClick={() => setCatActiva(null)}>
                Todos
              </button>
              {categorias.map(c => (
                <button
                  key={c.id}
                  className={`filtro-btn ${catActiva === c.id ? 'activo' : ''}`}
                  onClick={() => setCatActiva(c.id)}
                >
                  {c.nombre}
                </button>
              ))}
            </div>
            <input
              className="buscar-input"
              placeholder="🔍 Buscar producto..."
              value={buscar}
              onChange={e => setBuscar(e.target.value)}
            />
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--gris)', padding: '48px 0' }}>Cargando productos...</p>
          ) : productos.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--gris)', padding: '48px 0' }}>No se encontraron productos.</p>
          ) : (
            <div className="productos-grid">
              {productos.map(p => (
                <div className="producto-card" key={p.id}>
                  {p.imagen_url
                    ? <img className="producto-img" src={p.imagen_url} alt={p.nombre} />
                    : <div className="producto-img-placeholder">📦</div>
                  }
                  <div className="producto-body">
                    <div className="producto-cat">{p.categoria}</div>
                    <div className="producto-nombre">{p.nombre}</div>
                    <div className="producto-desc">{p.descripcion}</div>
                    <div className="producto-footer">
                      <div className="producto-precio">
                        {formatMXN(p.precio_renta)}<small> / renta</small>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                        <span className={`badge ${p.stock_total > 0 ? 'badge-disponible' : 'badge-agotado'}`}>
                          {p.stock_total > 0 ? `${p.stock_total} disp.` : 'Agotado'}
                        </span>
                        <button className="btn-agregar" onClick={() => agregar(p.id, 1)} disabled={p.stock_total === 0}>
                          + Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
