import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar         from './components/Navbar';
import CartSidebar    from './components/CartSidebar';
import Footer         from './components/Footer';
import Home           from './pages/Home';
import Catalogo       from './pages/Catalogo';
import Reservar       from './pages/Reservar';
import { Login, Registro } from './pages/Auth';
import MisReservaciones from './pages/MisReservaciones';
import Contacto       from './pages/Contacto';
import Calendario     from './pages/Calendario';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Inter, sans-serif', fontSize: '0.9rem' } }} />
        <Navbar />
        <CartSidebar />
        <main>
          <Routes>
            <Route path="/"                   element={<Home />} />
            <Route path="/catalogo"           element={<Catalogo />} />
            <Route path="/reservar"           element={<Reservar />} />
            <Route path="/calendario"         element={<Calendario />} />
            <Route path="/contacto"           element={<Contacto />} />
            <Route path="/login"              element={<Login />} />
            <Route path="/registro"           element={<Registro />} />
            <Route path="/mis-reservaciones"  element={<MisReservaciones />} />
          </Routes>
        </main>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}
