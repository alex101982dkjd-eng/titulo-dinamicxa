import { useState } from 'react';
import { API } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', mensaje: '' });
  const [enviando, setEnviando] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.nombre || !form.email || !form.mensaje) { toast.error('Completa los campos requeridos'); return; }
    setEnviando(true);
    try {
      await API.post('/contacto', form);
      toast.success('Mensaje enviado. Te responderemos pronto.');
      setForm({ nombre: '', email: '', telefono: '', mensaje: '' });
    } catch { toast.error('Error al enviar mensaje'); }
    finally { setEnviando(false); }
  };

  const wsp = 'https://wa.me/5536456171?text=Hola,%20me%20gustaría%20cotizar%20mobiliario';

  return (
    <div className="page-top">
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 48 }}>
            <p className="section-label">Estamos aquí</p>
            <h1 className="section-title">Contáctanos</h1>
            <div className="divider-gold" />
          </div>

          <div className="contacto-grid">
            <div className="contacto-info">
              <h2 style={{ marginBottom: 8, fontSize: '1.3rem' }}>¿Tienes alguna duda?</h2>
              <p style={{ color: 'var(--gris)', marginBottom: 28, fontSize: '0.95rem' }}>
                Comunícate con nosotros por cualquiera de estos medios. Respondemos en menos de 2 horas en horario de atención.
              </p>

              <ul className="contacto-info-list">
                {[
                  { icon: '💬', titulo: 'WhatsApp', desc: 'Cotizaciones rápidas y atención inmediata', link: wsp, label: 'Abrir WhatsApp' },
                  { icon: '✉', titulo: 'Correo', desc: 'eleganceevents.contacto@gmail.com', link: 'mailto:eleganceevents.contacto@gmail.com', label: 'Enviar correo' },
                  { icon: '📍', titulo: 'Ubicación', desc: 'Jilotepec, Estado de México', link: '#', label: null },
                  { icon: '🕐', titulo: 'Horarios', desc: 'Lunes a Sábado: 9:00 AM – 7:00 PM', link: '#', label: null },
                ].map(c => (
                  <li className="contacto-item" key={c.titulo}>
                    <div className="contacto-icon">{c.icon}</div>
                    <div>
                      <h4>{c.titulo}</h4>
                      <p>{c.desc}</p>
                      {c.label && (
                        <a href={c.link} target="_blank" rel="noreferrer"
                          style={{ color: 'var(--dorado)', fontSize: '0.85rem', fontWeight: 600, marginTop: 4, display: 'inline-block' }}>
                          {c.label} →
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <a href={wsp} target="_blank" rel="noreferrer" className="btn-wsp" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                💬 Cotizar por WhatsApp
              </a>

              <div>
                <h4 style={{ fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--dorado-oscuro)', marginBottom: 12 }}>Síguenos en redes</h4>
                <ul style={{ listStyle: 'none', display: 'flex', gap: 12 }}>
                  <li><a href="https://facebook.com/eleganceevents" target="_blank" rel="noreferrer" style={{ color: 'var(--dorado)', fontWeight: 600, fontSize: '0.9rem' }}>Facebook</a></li>
                  <li><a href="https://instagram.com/eleganceevents" target="_blank" rel="noreferrer" style={{ color: 'var(--dorado)', fontWeight: 600, fontSize: '0.9rem' }}>Instagram</a></li>
                  <li><a href="https://tiktok.com/@eleganceevents" target="_blank" rel="noreferrer" style={{ color: 'var(--dorado)', fontWeight: 600, fontSize: '0.9rem' }}>TikTok</a></li>
                </ul>
              </div>
            </div>

            <div className="contacto-form">
              <h2 style={{ marginBottom: 4, fontSize: '1.3rem' }}>Envíanos un mensaje</h2>
              <div className="form-group">
                <label>Nombre *</label>
                <input type="text" value={form.nombre} onChange={e => set('nombre', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Correo *</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input type="tel" value={form.telefono} onChange={e => set('telefono', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Mensaje *</label>
                <textarea value={form.mensaje} onChange={e => set('mensaje', e.target.value)} placeholder="Cuéntanos sobre tu evento..." />
              </div>
              <button className="btn-dorado" style={{ justifyContent: 'center' }} onClick={handleSubmit} disabled={enviando}>
                {enviando ? 'Enviando...' : '✉ Enviar mensaje'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
