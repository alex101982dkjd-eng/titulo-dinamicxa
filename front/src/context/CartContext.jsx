import { createContext, useContext, useState, useEffect } from 'react';
import { API, useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const { usuario, loading } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [open, setOpen]   = useState(false);

  const cargarCarrito = async () => {
    if (!usuario) { setItems([]); setTotal(0); return; }
    try {
      const { data } = await API.get('/carrito');
      setItems(data.items); setTotal(data.total);
    } catch {
      // 401/403 sin sesion: limpiar silenciosamente
      setItems([]); setTotal(0);
    }
  };

  // Esperar a que AuthContext termine de leer localStorage antes de hacer peticiones
  useEffect(() => {
    if (loading) return;
    cargarCarrito();
  }, [usuario, loading]);

  const agregar = async (producto_id, cantidad = 1) => {
    if (!usuario) { toast.error('Inicia sesion para agregar al carrito'); return; }
    try {
      await API.post('/carrito', { producto_id, cantidad });
      await cargarCarrito();
      toast.success('Agregado al carrito');
    } catch { toast.error('Error al agregar'); }
  };

  const actualizar = async (producto_id, cantidad) => {
    if (cantidad < 1) { await eliminar(producto_id); return; }
    try { await API.post('/carrito', { producto_id, cantidad }); await cargarCarrito(); }
    catch { toast.error('Error al actualizar'); }
  };

  const eliminar = async (producto_id) => {
    try { await API.delete(`/carrito/${producto_id}`); await cargarCarrito(); }
    catch { toast.error('Error al eliminar'); }
  };

  const vaciar = async () => {
    try { await API.delete('/carrito'); await cargarCarrito(); }
    catch {}
  };

  return (
    <CartCtx.Provider value={{ items, total, open, setOpen, agregar, actualizar, eliminar, vaciar, cargarCarrito }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);
