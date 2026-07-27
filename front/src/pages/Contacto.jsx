import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Contacto() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  });

  const [enviando, setEnviando] = useState(false);

  const set = (campo, valor) => {
    setForm(formAnterior => ({
      ...formAnterior,
      [campo]: valor,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (
      !form.nombre.trim() ||
      !form.email.trim() ||
      !form.mensaje.trim()
    ) {
      toast.error('Completa los campos requeridos');
      return;
    }

    setEnviando(true);

    const controlador = new AbortController();

    const tiempoLimite = setTimeout(() => {
      controlador.abort();
    }, 15000);

    try {
      const datos = new FormData();

      datos.append('nombre', form.nombre);
      datos.append('email', form.email);
      datos.append('telefono', form.telefono);
      datos.append('mensaje', form.mensaje);
      datos.append(
        '_subject',
        'Nuevo mensaje desde Elegance Events'
      );

      const respuesta = await fetch(
        'https://formspree.io/f/mzdnopyo',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: datos,
          signal: controlador.signal,
        }
      );

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        const mensajeError =
          resultado?.errors?.[0]?.message ||
          resultado?.error ||
          'Formspree rechazó el formulario';

        throw new Error(mensajeError);
      }

      toast.success(
        'Mensaje enviado. Te responderemos pronto.'
      );

      setForm({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: '',
      });
    } catch (error) {
      console.error('Error al enviar el formulario:', error);

      if (error.name === 'AbortError') {
        toast.error(
          'El envío tardó demasiado. Revisa tu conexión.'
        );
      } else {
        toast.error(
          error.message ||
            'No se pudo enviar el mensaje. Inténtalo nuevamente.'
        );
      }
    } finally {
      clearTimeout(tiempoLimite);
      setEnviando(false);
    }
  };

  const wsp =
    'https://wa.me/525536456171?text=Hola,%20me%20gustaría%20cotizar%20mobiliario';

  const mediosContacto = [
    {
      icon: '💬',
      titulo: 'WhatsApp',
      desc: 'Cotizaciones rápidas y atención inmediata',
      link: wsp,
      label: 'Abrir WhatsApp',
    },
    {
      icon: '✉',
      titulo: 'Correo',
      desc: 'eleganceevents.contacto@gmail.com',
      link: 'mailto:eleganceevents.contacto@gmail.com',
      label: 'Enviar correo',
    },
    {
      icon: '📍',
      titulo: 'Ubicación',
      desc: 'Jilotepec, Estado de México',
      link: '#',
      label: null,
    },
    {
      icon: '🕐',
      titulo: 'Horarios',
      desc: 'Lunes a Sábado: 9:00 AM – 7:00 PM',
      link: '#',
      label: null,
    },
  ];

  return (
    <div className="page-top">
      <section className="section">
        <div className="container">
          <div
            className="text-center"
            style={{ marginBottom: 48 }}
          >
            <p className="section-label">Estamos aquí</p>
            <h1 className="section-title">Contáctanos</h1>
            <div className="divider-gold" />
          </div>

          <div className="contacto-grid">
            <div className="contacto-info">
              <h2
                style={{
                  marginBottom: 8,
                  fontSize: '1.3rem',
                }}
              >
                ¿Tienes alguna duda?
              </h2>

              <p
                style={{
                  color: 'var(--gris)',
                  marginBottom: 28,
                  fontSize: '0.95rem',
                }}
              >
                Comunícate con nosotros por cualquiera de
                estos medios. Respondemos en menos de 2 horas
                en horario de atención.
              </p>

              <ul className="contacto-info-list">
                {mediosContacto.map(contacto => (
                  <li
                    className="contacto-item"
                    key={contacto.titulo}
                  >
                    <div className="contacto-icon">
                      {contacto.icon}
                    </div>

                    <div>
                      <h4>{contacto.titulo}</h4>
                      <p>{contacto.desc}</p>

                      {contacto.label && (
                        <a
                          href={contacto.link}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: 'var(--dorado)',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            marginTop: 4,
                            display: 'inline-block',
                          }}
                        >
                          {contacto.label} →
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <a
                href={wsp}
                target="_blank"
                rel="noreferrer"
                className="btn-wsp"
                style={{
                  alignSelf: 'flex-start',
                  marginTop: 8,
                }}
              >
                💬 Cotizar por WhatsApp
              </a>

              <div>
                <h4
                  style={{
                    fontSize: '0.78rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--dorado-oscuro)',
                    marginBottom: 12,
                  }}
                >
                  Síguenos en redes
                </h4>

                <ul
                  style={{
                    listStyle: 'none',
                    display: 'flex',
                    gap: 12,
                  }}
                >
                  <li>
                    <a
                      href="https://facebook.com/eleganceevents"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: 'var(--dorado)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                      }}
                    >
                      Facebook
                    </a>
                  </li>

                  <li>
                    <a
                      href="https://instagram.com/eleganceevents"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: 'var(--dorado)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                      }}
                    >
                      Instagram
                    </a>
                  </li>

                  <li>
                    <a
                      href="https://tiktok.com/@eleganceevents"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: 'var(--dorado)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                      }}
                    >
                      TikTok
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <form
              className="contacto-form"
              onSubmit={handleSubmit}
            >
              <h2
                style={{
                  marginBottom: 4,
                  fontSize: '1.3rem',
                }}
              >
                Envíanos un mensaje
              </h2>

              <div className="form-group">
                <label htmlFor="nombre">
                  Nombre *
                </label>

                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={form.nombre}
                  onChange={e =>
                    set('nombre', e.target.value)
                  }
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Correo *
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={e =>
                    set('email', e.target.value)
                  }
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono">
                  Teléfono
                </label>

                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={form.telefono}
                  onChange={e =>
                    set('telefono', e.target.value)
                  }
                  autoComplete="tel"
                />
              </div>

              <div className="form-group">
                <label htmlFor="mensaje">
                  Mensaje *
                </label>

                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={form.mensaje}
                  onChange={e =>
                    set('mensaje', e.target.value)
                  }
                  placeholder="Cuéntanos sobre tu evento..."
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-dorado"
                style={{ justifyContent: 'center' }}
                disabled={enviando}
              >
                {enviando
                  ? 'Enviando...'
                  : '✉ Enviar mensaje'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}