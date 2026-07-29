document.addEventListener('DOMContentLoaded', async () => {
  // ========== DATOS POR DEFECTO (FALLBACK) ==========
  const defaultTextos = {
    hero: {
      tag: "Transformación digital",
      title: "Gestión inteligente para <span class=\"highlight\">tu negocio</span>",
      subtitle: "¿Necesitas agendamiento, facturación, tareas u otras herramientas?<br />Hazte la vida más fácil con nosotros.",
      cta_primary: { text: "Agenda una consultoría" },
      cta_secondary: { text: "Conoce más" }
    },
    propuesta: {
      tag: "Propuesta de valor",
      title: "Menos tiempo en tareas, más tiempo en crecer",
      text: "¿Cansado de perder horas que podrías usar en otras tareas importantes? actools automatiza la gestión de tu negocio para que puedas dedicarte a lo que realmente importa: atender a tus clientes y hacer crecer tu empresa."
    },
    servicios: {
      tag: "Servicios",
      title: "Automatiza todo lo que necesitas.",
      desc: "Soluciones diseñadas para simplificar cada área de tu operación diaria."
    },
    servicios_list: [
      { icon: "fas fa-calendar-check", title: "Agendamiento inteligente", desc: "Gestiona turnos, citas y disponibilidad en tiempo real. Recordatorios automáticos para tus clientes." },
      { icon: "fas fa-comment-dots", title: "Gestor de respuestas automáticas para vendedores", desc: "Automatiza la comunicación con tus clientes potenciales, responde preguntas frecuentes y califica leads sin esfuerzo." },
      { icon: "fas fa-tasks", title: "Gestión de tareas", desc: "Asigna, prioriza y da seguimiento a las actividades de tu equipo. Todo en un tablero visual." },
      { icon: "fas fa-chart-line", title: "Reportes y análisis", desc: "Visualiza el rendimiento de tu negocio con métricas claras: ingresos, ocupación y productividad." },
      { icon: "fas fa-users", title: "Gestión de clientes", desc: "Centraliza la información de tus clientes, historial de compras y preferencias para ofrecer un mejor servicio." },
      { icon: "fas fa-boxes", title: "Sistema de inventarios", desc: "Controla tus existencias, recibe alertas de stock bajo y gestiona entradas y salidas de productos de forma sencilla." }
    ],
    audiencia: {
      tag: "Audiencia",
      title: "Diseñado para emprendedores como tú",
      desc: "actools se adapta a cualquier negocio que quiera optimizar su gestión diaria."
    },
    audiencia_list: [
      "✂️ Barberías", "🥖 Panaderías", "💻 Freelancers", "🏪 Comercios",
      "☕ Cafeterías", "🧾 Consultorías", "📦 E-commerce", "🏋️ Gimnasios",
      "🎨 Diseñadores", "🧮 Contadores", "📌 Otros"
    ],
    about: {
      tag: "Sobre nosotros",
      title: "Un equipo apasionado por simplificar",
      text1: "Somos un grupo de emprendedores y tecnólogos que creemos que la tecnología debe ser un aliado, no una complicación. Con años de experiencia en desarrollo de software y asesoría a pequeños negocios, creamos actools para que tú puedas dejar atrás el caos administrativo y enfocarte en lo que mejor sabes hacer.",
      text2: "Nuestra misión: <strong>hacerle la vida más fácil a quien lo necesita</strong>, con herramientas intuitivas, soporte cercano y un enfoque humano."
    },
    contacto: {
      tag: "Contacto",
      title: "¿Listo para transformar tu negocio?",
      desc: "Cuéntanos tu proyecto, te ayudaremos a encontrar la mejor solución."
    },
    footer: {
      brand_desc: "Haciendo la gestión de tu negocio más simple y eficiente.",
      copyright: "© 2026 actols. Todos los derechos reservados. | Hecho con ❤️ para emprendedores."
    }
  };

  const defaultEnlaces = {
    menu: [
      { text: "Servicios", href: "#servicios" },
      { text: "Para quién", href: "#para-quien" },
      { text: "Contacto", href: "#contacto" },
      { text: "Formulario", href: "#" }
    ],
    hero: {
      cta_primary: { href: "#contacto" },
      cta_secondary: { href: "#servicios" }
    },
    footer_nav: [
      { text: "Servicios", href: "#servicios" },
      { text: "Para quién", href: "#para-quien" },
      { text: "Contacto", href: "#contacto" }
    ],
    social: [
      { href: "#", icon: "fab fa-facebook-f", label: "Facebook" },
      { href: "#", icon: "fab fa-instagram", label: "Instagram" },
      { href: "#", icon: "fab fa-linkedin-in", label: "LinkedIn" },
      { href: "#", icon: "fab fa-x-twitter", label: "Twitter" }
    ]
  };

  let textos = defaultTextos;
  let enlaces = defaultEnlaces;

  // Cargar JSON
  try {
    const [resTextos, resEnlaces] = await Promise.all([
      fetch('textos.json').catch(() => null),
      fetch('enlaces.json').catch(() => null)
    ]);
    if (resTextos && resTextos.ok) {
      const data = await resTextos.json();
      textos = mergeDeep(defaultTextos, data);
    }
    if (resEnlaces && resEnlaces.ok) {
      const data = await resEnlaces.json();
      enlaces = mergeDeep(defaultEnlaces, data);
    }
  } catch (e) {
    console.warn('Error al cargar JSON, usando valores por defecto.', e);
  }

  // Función merge
  function mergeDeep(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = mergeDeep(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  // Poblar textos
  function populateTexts(data) {
    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.dataset.key;
      const value = key.split('.').reduce((obj, k) => obj?.[k], data);
      if (value !== undefined && value !== null && (typeof value === 'string' || typeof value === 'number')) {
        el.innerHTML = value;
      }
    });
    document.querySelectorAll('[data-text]').forEach(el => {
      if (!el.hasAttribute('data-key')) {
        const key = el.dataset.text;
        const value = key.split('.').reduce((obj, k) => obj?.[k], data);
        if (value !== undefined && value !== null && (typeof value === 'string' || typeof value === 'number')) {
          el.innerHTML = value;
        }
      }
    });
  }
  populateTexts(textos);

  // Poblar enlaces (href)
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    if (key.endsWith('.href')) {
      const value = key.split('.').reduce((obj, k) => obj?.[k], enlaces);
      if (value && typeof value === 'string') {
        el.setAttribute('href', value);
      }
    }
  });

  // Navegación
  function populateNav(selector, items) {
    const container = document.querySelector(selector);
    if (!container) return;
    container.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.href || '#';
      a.textContent = item.text;
      li.appendChild(a);
      container.appendChild(li);
    });
  }
  populateNav('.nav-links', enlaces.menu);
  populateNav('#footerNav', enlaces.footer_nav);

  // Redes sociales
  const socialContainer = document.getElementById('socialIcons');
  if (socialContainer && enlaces.social) {
    socialContainer.innerHTML = '';
    enlaces.social.forEach(social => {
      const a = document.createElement('a');
      a.href = social.href;
      a.setAttribute('aria-label', social.label);
      a.innerHTML = `<i class="${social.icon}"></i>`;
      socialContainer.appendChild(a);
    });
  }

  // Servicios
  const serviciosGrid = document.getElementById('serviciosGrid');
  if (serviciosGrid && textos.servicios_list) {
    serviciosGrid.innerHTML = '';
    textos.servicios_list.forEach(serv => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <span class="icon"><i class="${serv.icon}"></i></span>
        <h3>${serv.title}</h3>
        <p>${serv.desc}</p>
      `;
      serviciosGrid.appendChild(card);
    });
  }

  // Audiencia
  const audienceList = document.getElementById('audienceList');
  if (audienceList && textos.audiencia_list) {
    audienceList.innerHTML = '';
    textos.audiencia_list.forEach(item => {
      const span = document.createElement('span');
      span.className = 'audience-tag';
      span.textContent = item;
      audienceList.appendChild(span);
    });
  }

  // About image
  const aboutImage = document.getElementById('aboutImage');
  if (aboutImage) {
    aboutImage.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0B4F5C" width="64" height="64">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
        <p style="color:var(--text-secondary);font-size:0.95rem;margin:0;">
          Hecho con ❤️ para emprendedores.
        </p>
      </div>
    `;
  }

  // Menú hamburguesa
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // ========== FORMULARIO: ENVÍO CON FETCH (CORREGIDO) ==========
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Enviando... <i class="fas fa-spinner fa-spin"></i>';
      submitBtn.disabled = true;

      const formData = new FormData(form);

      try {
        // Endpoint AJAX de FormSubmit (con /ajax/ antes del correo)
        const response = await fetch('https://formsubmit.co/ajax/info@actols.com', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        // Leer la respuesta como texto primero (por si no es JSON)
        const responseText = await response.text();
        console.log('Respuesta del servidor:', responseText);

        let result;
        try {
          // Intentar parsear como JSON
          result = JSON.parse(responseText);
        } catch (parseError) {
          // Si no es JSON, mostrar el texto
          throw new Error('El servidor devolvió una respuesta no válida: ' + responseText.substring(0, 100));
        }

        if (response.ok) {
          alert('¡Gracias por contactarnos! En breve nos comunicaremos contigo. 😊');
          form.reset();
        } else {
          // Si la respuesta no es ok pero sí es JSON, mostrar el mensaje de error
          alert('Error ' + response.status + ': ' + (result.message || result.error || 'Error desconocido'));
        }
      } catch (error) {
        alert('Error de conexión: ' + error.message + '. Revisa la consola para más detalles.');
        console.error('Fetch error:', error);
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});
