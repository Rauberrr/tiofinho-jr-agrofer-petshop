(() => {
  'use strict';

  const WHATS = '5554996893767';
  const waLink = (msg) => `https://wa.me/${WHATS}?text=${encodeURIComponent(msg)}`;

  /* ---------- Links de WhatsApp com mensagem pronta ---------- */
  document.querySelectorAll('[data-wa]').forEach((a) => {
    a.href = waLink(a.dataset.wa);
  });

  /* ---------- Header / menu ---------- */
  const header = document.querySelector('.header');
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const closeMenu = () => {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  };
  burger.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

  /* ---------- Reveal ao rolar ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Contadores ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const end = Number(el.dataset.count);
      const start = performance.now();
      const dur = 1400;
      const tick = (t) => {
        const p = Math.min(1, (t - start) / dur);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => countIO.observe(c));

  // anos desde 2007
  const yearsEl = document.querySelector('[data-count="19"]');
  if (yearsEl) yearsEl.dataset.count = String(new Date().getFullYear() - 2007);
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Palavra que gira no título ---------- */
  const words = [...document.querySelectorAll('.rotator__word')];
  let wi = 0;
  if (words.length > 1) {
    setInterval(() => {
      const cur = words[wi];
      cur.classList.remove('is-on');
      cur.classList.add('is-out');
      wi = (wi + 1) % words.length;
      const next = words[wi];
      next.classList.remove('is-out');
      next.classList.add('is-on');
      setTimeout(() => cur.classList.remove('is-out'), 650);
    }, 2200);
  }

  /* ---------- Aberto / fechado (horário de Brasília) ---------- */
  const HOURS = {
    0: [],
    1: [[480, 710], [810, 1095]],
    2: [[480, 710], [810, 1095]],
    3: [[480, 710], [810, 1095]],
    4: [[480, 710], [810, 1095]],
    5: [[480, 710], [810, 1095]],
    6: [[480, 710]],
  };
  const DAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

  function nowInGramado() {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    return { day, min: Number(get('hour')) * 60 + Number(get('minute')) };
  }

  function status() {
    const { day, min } = nowInGramado();
    const today = HOURS[day];
    const slot = today.find(([a, b]) => min >= a && min < b);
    if (slot) return { open: true, day, title: 'Aberto agora', sub: `Fecha às ${fmt(slot[1])}` };
    const later = today.find(([a]) => a > min);
    if (later) return { open: false, day, title: 'Fechado agora', sub: `Abre hoje às ${fmt(later[0])}` };
    for (let i = 1; i <= 7; i++) {
      const d = (day + i) % 7;
      if (HOURS[d].length) {
        const label = i === 1 ? 'amanhã' : DAYS[d];
        return { open: false, day, title: 'Fechado agora', sub: `Abre ${label} às ${fmt(HOURS[d][0][0])}` };
      }
    }
    return { open: false, day, title: 'Fechado', sub: '' };
  }

  function paintStatus() {
    const s = status();
    const card = document.getElementById('status-card');
    card.classList.toggle('is-open', s.open);
    card.classList.toggle('is-closed', !s.open);
    document.getElementById('status-title').textContent = s.title;
    document.getElementById('status-sub').textContent = s.sub;
    const badge = document.getElementById('status-badge');
    badge.textContent = s.open ? '● Aberto agora' : '● Fechado agora';
    badge.className = `badge ${s.open ? 'is-open' : 'is-closed'}`;
    document.querySelectorAll('#hours-table tr').forEach((tr) => {
      tr.classList.toggle('is-today', Number(tr.dataset.day) === s.day);
    });
  }
  paintStatus();
  setInterval(paintStatus, 60 * 1000);

  /* ---------- Fotos das avaliações: fallback ---------- */
  document.querySelectorAll('.review__photos img').forEach((img) => {
    img.addEventListener('error', () => {
      const full = img.parentElement.href;
      if (img.src !== full) { img.src = full; return; }
      img.parentElement.remove();
    }, { once: false });
  });

  /* ---------- Formulário -> WhatsApp ---------- */
  const form = document.getElementById('order-form');
  const preview = document.getElementById('preview-text');
  const errorEl = document.getElementById('form-error');
  const groups = form.querySelectorAll('.form__group');
  const entregaField = form.querySelector('[data-entrega]');
  const produto = form.elements.produto;

  const placeholders = {
    'Pet Shop': 'Ex.: Ração PremieR adulto 15 kg, areia para gato…',
    'Agropecuária': 'Ex.: Formicida para horta, adubo, ração para galinhas…',
    'Ferragem': 'Ex.: Churrasqueira de latão, mangueira 20 m…',
    'Remédios': 'Ex.: Simparic para cão de 10 a 20 kg, vermífugo…',
  };

  const val = (name) => (form.elements[name]?.value || '').trim();
  const tipo = () => form.querySelector('input[name="tipo"]:checked').value;

  function buildMessage() {
    const t = tipo();
    const nome = val('nome');
    const lines = [`Olá! Vim pelo site 😊`];
    if (nome) lines.push(`Meu nome é ${nome}.`);

    if (t === 'Banho e Tosa') {
      lines.push('', '🐶 *Agendamento de Banho e Tosa*');
      if (val('pet')) lines.push(`• Pet: ${val('pet')}`);
      lines.push(`• Porte: ${val('porte')}`);
      lines.push(`• Serviço: ${val('servico')}`);
      lines.push(`• Melhor turno: ${val('turno')}`);
      lines.push('', 'Qual o próximo horário disponível?');
    } else if (t === 'Outro assunto') {
      lines.push('', `💬 ${val('mensagem') || '…'}`);
    } else {
      const icons = { 'Pet Shop': '🐱', 'Agropecuária': '🌱', 'Ferragem': '🛠️', 'Remédios': '💊' };
      lines.push('', `${icons[t]} *${t}*`);
      lines.push(`• Procuro: ${val('produto') || '…'}`);
      const receber = form.querySelector('input[name="receber"]:checked').value;
      lines.push(`• Recebimento: ${receber}`);
      if (receber === 'Entrega' && val('endereco')) lines.push(`• Endereço: ${val('endereco')}`);
      lines.push('', 'Tem disponível? Qual o valor?');
    }
    return lines.join('\n');
  }

  function sync() {
    const t = tipo();
    groups.forEach((g) => {
      if (g.dataset.for === 'Outro assunto') g.hidden = t !== 'Outro assunto';
      else if (g.dataset.for === 'Banho e Tosa') g.hidden = t !== 'Banho e Tosa';
      else g.hidden = !['Pet Shop', 'Agropecuária', 'Ferragem', 'Remédios'].includes(t);
    });
    if (placeholders[t]) produto.placeholder = placeholders[t];
    const receber = form.querySelector('input[name="receber"]:checked').value;
    entregaField.hidden = receber !== 'Entrega';
    preview.textContent = buildMessage().replace(/\*/g, '');
  }

  form.addEventListener('input', sync);
  form.addEventListener('change', sync);
  sync();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
    const t = tipo();
    const missing = [];
    if (!val('nome')) missing.push(form.elements.nome);
    if (['Pet Shop', 'Agropecuária', 'Ferragem', 'Remédios'].includes(t) && !val('produto')) missing.push(form.elements.produto);
    if (t === 'Outro assunto' && !val('mensagem')) missing.push(form.elements.mensagem);
    if (missing.length) {
      missing.forEach((el) => el.classList.add('is-invalid'));
      errorEl.textContent = 'Preencha os campos marcados para enviarmos sua mensagem.';
      errorEl.hidden = false;
      missing[0].focus();
      return;
    }
    errorEl.hidden = true;
    window.open(waLink(buildMessage()), '_blank', 'noopener');
  });

  /* ---------- Dica do botão flutuante ---------- */
  const fab = document.querySelector('.wa-float');
  setTimeout(() => {
    fab.classList.add('show-tip');
    setTimeout(() => fab.classList.remove('show-tip'), 4500);
  }, 3500);
})();
