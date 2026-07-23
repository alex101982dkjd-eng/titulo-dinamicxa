import { useEffect, useState } from 'react';
import API from '../api';
import toast from 'react-hot-toast';

const EMPTY = { categoria_id: '', nombre: '', descripcion: '', precio_renta: '', stock_total: '', imagen_url: '', activo: 1 };

export default function Productos() {
  const [productos,  setProductos]  = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modal,      setModal]      = useState(false);
  const [form,       setForm]       = useState(EMPTY);
  const [editId,     setEditId]     = useState(null);
  const [imgFile,    setImgFile]    = useState(null);
  const [guardando,  setGuardando]  = useState(false);

  const cargar = () => {
    API.get('/admin/productos').then(r => setProductos(r.data)).catch(() => {});
  };

  useEffect(() => {
    cargar();
    API.get('/categorias').then(r => setCategorias(r.data)).catch(() => {});
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const abrirNuevo = () => { setForm(EMPTY); setEditId(null); setImgFile(null); setModal(true); };
  const abrirEditar = p => {
    setForm({ categoria_id: p.categoria_id, nombre: p.nombre, descripcion: p.descripcion || '',
      precio_renta: p.precio_renta, stock_total: p.stock_total, imagen_url: p.imagen_url || '', activo: p.activo });
    setEditId(p.id); setImgFile(null); setModal(true);
  };

  const guardar = async () => {
    if (!form.categoria_id || !form.nombre || !form.precio_renta) {
      toast.error('Categoria, nombre y precio son requeridos'); return;
    }
    setGuardando(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imgFile) fd.append('imagen', imgFile);

      if (editId) {
        await API.put(`/admin/productos/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Producto actualizado');
      } else {
        await API.post('/admin/productos', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Producto creado');
      }
      setModal(false); cargar();
    } catch (err) {
      toast.error(err.response?.data?.mensaje || 'Error al guardar');
    } finally { setGuardando(false); }
  };

  const eliminar = async (id) => {
    if (!confirm('Desactivar este producto?')) return;
    try { await API.delete(`/admin/productos/${id}`); toast.success('Producto desactivado'); cargar(); }
    catch { toast.error('Error al eliminar'); }
  };

  const fmtMXN = n => `$${Number(n).toFixed(2)}`;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Productos</h1>
          <p>Gestiona el catalogo de mobiliario</p>
        </div>
        <button className="btn btn-primary" onClick={abrirNuevo}>+ Nuevo producto</button>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          {productos.length === 0 ? (
            <div className="empty-state"><p>No hay productos aun</p></div>
          ) : (
            <table className="tabla">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoria</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex-row">
                        {p.imagen_url
                          ? <img src={p.imagen_url} alt={p.nombre} className="img-thumb" />
                          : <div className="img-placeholder">—</div>}
                        <div>
                          <div style={{ fontWeight: 500 }}>{p.nombre}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--gris)' }} className="truncate">{p.descripcion}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.categoria}</td>
                    <td style={{ fontWeight: 600, color: 'var(--dorado)' }}>{fmtMXN(p.precio_renta)}</td>
                    <td>{p.stock_total}</td>
                    <td>
                      <span className={`badge ${p.activo ? 'b-activo' : 'b-inactivo'}`}>
                        {p.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="flex-row">
                        <button className="btn btn-sm btn-azul" onClick={() => abrirEditar(p)}>Editar</button>
                        <button className="btn btn-sm btn-rojo" onClick={() => eliminar(p.id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editId ? 'Editar producto' : 'Nuevo producto'}</h3>
              <button style={{ fontSize: '1.2rem', color: 'var(--gris)' }} onClick={() => setModal(false)}>x</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Categoria *</label>
                  <select value={form.categoria_id} onChange={e => set('categoria_id', e.target.value)}>
                    <option value="">Seleccionar...</option>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select value={form.activo} onChange={e => set('activo', e.target.value)}>
                    <option value={1}>Activo</option>
                    <option value={0}>Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Nombre *</label>
                <input type="text" value={form.nombre} onChange={e => set('nombre', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Descripcion</label>
                <textarea value={form.descripcion} onChange={e => set('descripcion', e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Precio de renta *</label>
                  <input type="number" min="0" step="0.01" value={form.precio_renta} onChange={e => set('precio_renta', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Stock total</label>
                  <input type="number" min="0" value={form.stock_total} onChange={e => set('stock_total', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Imagen (URL)</label>
                <input type="text" placeholder="https://..." value={form.imagen_url} onChange={e => set('imagen_url', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Subir imagen</label>
                <input type="file" accept="image/*" onChange={e => setImgFile(e.target.files[0])} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={guardar} disabled={guardando}>
                {guardando ? 'Guardando...' : editId ? 'Actualizar' : 'Crear producto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
