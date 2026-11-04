/* HireStella · Ads landing page. No dependencies. */

const CONFIG = window.HS_CONFIG; // settings live in assets/js/config.js

(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) document.body.classList.add('motion');

  function push(event, data = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...data });
  }

  /* Runs `fn(now)` every frame while `el` is on screen and the tab is visible. */
  function whileVisible(el, fn) {
    let raf = 0;
    let onScreen = false;
    const loop = (now) => { fn(now); raf = requestAnimationFrame(loop); };
    const sync = () => {
      const run = onScreen && !document.hidden;
      if (run && !raf) raf = requestAnimationFrame(loop);
      if (!run && raf) { cancelAnimationFrame(raf); raf = 0; }
    };
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }).observe(el);
    document.addEventListener('visibilitychange', sync);
  }

  /* ── settings-driven links ─────────────────────────────────────────── */
  const waText = encodeURIComponent("Hi HireStella, I'd like to learn more about Stella for my business.");
  if (CONFIG.WHATSAPP_NUMBER) {
    document.querySelectorAll('.wa-link').forEach((a) => {
      a.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${waText}`;
      a.target = '_blank';
      a.rel = 'noopener';
      a.addEventListener('click', () => push('whatsapp_click'));
    });
  } else {
    root.classList.add('no-wa');
  }
  if (CONFIG.PRIVACY_URL) {
    document.querySelectorAll('.privacy-link').forEach((a) => {
      a.href = CONFIG.PRIVACY_URL;
      a.target = '_blank';
      a.rel = 'noopener';
    });
  } else {
    root.classList.add('no-privacy');
  }

  /* ── theme ─────────────────────────────────────────────────────────── */
  const themeBtn = document.getElementById('themeBtn');
  const labelTheme = () => themeBtn.setAttribute('aria-label', root.dataset.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  labelTheme();
  themeBtn.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('hs-lp-theme', root.dataset.theme); } catch { /* still switches */ }
    labelTheme();
  });

  /* ── header: shrink on scroll, mark the section in view ────────────── */
  const hdr = document.querySelector('.hdr');
  const onScroll = () => hdr.classList.toggle('is-stuck', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  const navLinks = [...document.querySelectorAll('.hdr-nav a')];
  const navObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === `#${e.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach((a) => { const s = document.querySelector(a.getAttribute('href')); if (s) navObs.observe(s); });

  /* ── mobile CTA bar: shown once the form has scrolled away, hidden again
     at the closing card, which has its own button. Past the form, the
     header button steps aside so there is only ever one on screen. ── */
  const formWrap = document.getElementById('demo');
  const mbar = document.getElementById('mbar');
  let formAbove = false;
  let closerIn = false;
  const ctasIn = new Set();
  const syncBar = () => {
    const on = formAbove && !closerIn && !ctasIn.size;
    mbar.classList.toggle('show', on);
    root.classList.toggle('past-form', formAbove);
  };
  new IntersectionObserver(([entry]) => {
    formAbove = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    syncBar();
  }, { threshold: 0.15 }).observe(formWrap);
  new IntersectionObserver(([entry]) => { closerIn = entry.isIntersecting; syncBar(); })
    .observe(document.querySelector('.closer'));
  /* The section buttons count too: the bar steps aside while one is on screen. */
  const ctaObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? ctasIn.add(e.target) : ctasIn.delete(e.target)));
    syncBar();
  });
  document.querySelectorAll('.cta-slot').forEach((el) => ctaObs.observe(el));

  /* "Choose your time" opens the booking dialog: free times live from the
     HireStella calendar (/api/booking/slots), shown in Dubai time, then the
     details. /api/booking books it with a Google Meet link, emails the
     confirmation and adds the row to the bookings sheet (source ads_get).
     `form`, `check` and `tracking` are the lead form's, further down; they are ready
     long before anyone can submit. */
  const bookingButton = document.querySelector('.booking-link');
  const bookingDialog = document.getElementById('bookingDialog');
  const bookingCalendar = document.getElementById('bookingCalendar');
  const bookingStatus = document.getElementById('bookingStatus');
  const bookingRetry = bookingDialog.querySelector('.booking-retry');
  const bkDays = document.getElementById('bkDays');
  const bkTimes = document.getElementById('bkTimes');
  const bkMonth = document.getElementById('bkMonth');
  const bkPrev = document.getElementById('bkPrev');
  const bkNext = document.getElementById('bkNext');
  const bkDayH = document.getElementById('bkDayH');
  const bkForm = document.getElementById('bookingForm');
  const bkWhen = document.getElementById('bkWhen');
  const bkError = document.getElementById('bkError');
  const bkSubmit = document.getElementById('bkSubmit');
  const bkLabel = bkSubmit.innerHTML;
  const DUBAI = 'Asia/Dubai';
  const inDubai = (iso, opts) => new Date(iso).toLocaleString('en-GB', { timeZone: DUBAI, ...opts });
  const longWhen = (iso) => `${inDubai(iso, { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })} (UAE time)`;
  let bookingTrigger;
  let previousOverflow;
  let slotsLoaded = false;
  let chosen = '';
  let bookedOnce = false;

  function slotsFailed(message, retry = true) {
    bookingCalendar.hidden = true;
    bookingStatus.hidden = false;
    bookingStatus.textContent = message;
    bookingRetry.hidden = !retry;
  }
  function option(className, selected, html, onPick) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = className;
    b.setAttribute('role', 'option');
    b.setAttribute('aria-selected', String(selected));
    b.innerHTML = html;
    b.addEventListener('click', onPick);
    return b;
  }
  function pickTime(start) {
    chosen = start;
    bkTimes.querySelectorAll('.bk-time').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.start === start)));
    bkWhen.textContent = longWhen(start);
    bkForm.hidden = false;
    /* Whatever the visitor already typed into the callback form carries over. */
    ['name', 'business', 'email', 'phone'].forEach((n) => {
      if (!bkForm.elements[n].value) bkForm.elements[n].value = form.elements[n].value;
    });
    bkForm.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
  }
  /* A month calendar of the free Dubai days, Monday first; days without a free
     time show but cannot be picked. Keys are "YYYY-MM-DD", Dubai days. */
  const keyDate = (key) => new Date(`${key}T00:00:00Z`);
  const addMonths = (m, by) => { const d = keyDate(`${m}-01`); d.setUTCMonth(d.getUTCMonth() + by); return d.toISOString().slice(0, 7); };
  const keyLabel = (key, opts) => keyDate(key).toLocaleDateString('en-GB', { timeZone: 'UTC', ...opts });
  let days = new Map();
  let month = '';
  let day = '';
  function drawMonth() {
    const keys = [...days.keys()];
    bkMonth.textContent = keyLabel(`${month}-01`, { month: 'long', year: 'numeric' });
    /* Browsable from this month to at least the next, however far the free days reach. */
    const now = new Date().toLocaleDateString('en-CA', { timeZone: DUBAI }).slice(0, 7);
    bkPrev.disabled = month <= now;
    bkNext.disabled = month >= [keys[keys.length - 1].slice(0, 7), addMonths(now, 1)].sort().pop();
    const start = keyDate(`${month}-01`);
    const lead = (start.getUTCDay() + 6) % 7;
    const count = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)).getUTCDate();
    const today = new Date().toLocaleDateString('en-CA', { timeZone: DUBAI });
    const cells = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((w) => {
      const s = document.createElement('span');
      s.className = 'bk-wd';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = w;
      return s;
    });
    for (let i = 0; i < lead; i++) cells.push(document.createElement('span'));
    for (let d = 1; d <= count; d++) {
      const key = `${month}-${String(d).padStart(2, '0')}`;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `bk-cday${key === today ? ' is-today' : ''}`;
      b.textContent = d;
      b.disabled = !days.has(key);
      b.setAttribute('aria-pressed', String(key === day));
      b.setAttribute('aria-label', keyLabel(key, { weekday: 'long', day: 'numeric', month: 'long' }) + (days.has(key) ? '' : ', no free times'));
      b.addEventListener('click', () => showDay(key));
      cells.push(b);
    }
    bkDays.replaceChildren(...cells);
  }
  function showDay(key) {
    day = key;
    month = key.slice(0, 7);
    drawMonth();
    bkDayH.textContent = keyLabel(key, { weekday: 'long', day: 'numeric', month: 'long' });
    bkTimes.replaceChildren(...days.get(key).map((s) => {
      const b = option('bk-time', s === chosen, inDubai(s, { hour: '2-digit', minute: '2-digit' }), () => pickTime(s));
      b.dataset.start = s;
      return b;
    }));
  }
  /* The times follow the month: its first free day. */
  function stepMonth(by) {
    const next = addMonths(month, by);
    const first = [...days.keys()].find((k) => k.startsWith(next));
    if (first) return showDay(first);
    month = next;
    drawMonth();
    bkDayH.textContent = `No times are open in ${keyLabel(`${next}-01`, { month: 'long' })} yet. Times open 30 days ahead.`;
    bkTimes.replaceChildren();
  }
  bkPrev.addEventListener('click', () => stepMonth(-1));
  bkNext.addEventListener('click', () => stepMonth(1));
  async function loadSlots() {
    if (slotsLoaded) return;
    bookingStatus.hidden = false;
    bookingStatus.textContent = 'Loading available dates and times…';
    bookingRetry.hidden = true;
    let data = null;
    try {
      const r = await fetch('/api/booking/slots', { cache: 'no-store' });
      data = r.ok ? await r.json() : null;
    } catch { data = null; }
    if (!data) return slotsFailed('The calendar could not load. Please try again.');
    const slots = data.configured ? data.slots : [];
    if (!slots.length) return slotsFailed('No times are open online right now. Close this and leave your details on the page: we will arrange your demo.', false);
    days = new Map();
    slots.forEach((s) => {
      const key = new Date(s).toLocaleDateString('en-CA', { timeZone: DUBAI });
      days.set(key, [...(days.get(key) || []), s]);
    });
    showDay(days.has(day) ? day : [...days.keys()][0]);
    slotsLoaded = true;
    bookingStatus.hidden = true;
    bookingCalendar.hidden = false;
  }
  function showBooked(start) {
    let done = bookingDialog.querySelector('.booking-done');
    if (!done) {
      done = document.createElement('div');
      done.className = 'booking-done';
      done.setAttribute('role', 'status');
      done.innerHTML = '<span class="booking-done-tick" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5.5 5.5L20 7"/></svg></span><h3>Your demo is booked<span class="dot">.</span></h3><p class="booking-done-when"></p><p>Your Google Meet link and calendar invite are on their way to your inbox. Need a different time? Use the link in that email.</p>';
      bookingCalendar.after(done);
    }
    done.querySelector('.booking-done-when').textContent = longWhen(start);
    bookingCalendar.hidden = true;
    bookingStatus.hidden = true;
  }
  bkForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    bkError.hidden = true;
    const fields = ['name', 'business', 'email', 'phone'].map((n) => bkForm.elements[n]);
    const bad = fields.filter((el) => !check(el));
    if (bad.length) { bad[0].focus(); return; }
    const v = Object.fromEntries(fields.map((el) => [el.name, el.value.trim()]));
    bkSubmit.disabled = true;
    bkSubmit.textContent = 'Booking…';
    try {
      const r = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...tracking,
          start: chosen, name: v.name, company: v.business, email: v.email, phone: v.phone,
          source: 'ads_get', page: location.href.split('?')[0],
          website: bkForm.elements.website.value, // honeypot, checked by the server
        }),
      });
      const data = await r.json().catch(() => null);
      if (!r.ok) {
        /* Taken meanwhile: fresh times, the details stay. */
        if (r.status === 409) { slotsLoaded = false; chosen = ''; bkForm.hidden = true; await loadSlots(); }
        throw new Error(data?.error || 'Your demo could not be booked. Please try again, or request a callback on the page.');
      }
      showBooked(data.start || chosen);
      /* A booked demo is a lead, like a callback request: the conversion fires
         here, once, with no personal details. */
      if (!bookedOnce) {
        bookedOnce = true;
        push('generate_lead', { lead_source: 'ads_landing', lead_type: 'demo_booking' });
        if (window.fbq) window.fbq('track', 'Lead', { content_category: 'demo_booking' });
      }
    } catch (err) {
      bkError.textContent = err.message;
      bkError.hidden = false;
    } finally {
      bkSubmit.disabled = false;
      bkSubmit.innerHTML = bkLabel;
    }
  });
  bookingButton.addEventListener('click', () => {
    bookingTrigger = document.activeElement;
    previousOverflow = document.body.style.overflow;
    bookingDialog.showModal();
    document.body.style.overflow = 'hidden';
    push('booking_link_clicked', { cta_location: bookingButton.dataset.cta, booking_provider: 'hirestella' });
    loadSlots();
  });
  bookingDialog.querySelector('.booking-close').addEventListener('click', () => bookingDialog.close());
  bookingDialog.addEventListener('click', (event) => {
    if (event.target !== bookingDialog) return;
    const rect = bookingDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) bookingDialog.close();
  });
  bookingDialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    bookingTrigger?.focus({ preventScroll: true });
  });
  bookingRetry.addEventListener('click', () => { slotsLoaded = false; loadSlots(); });
  document.querySelectorAll('a[href="#demo"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      push('cta_click', { cta_location: a.dataset.cta || 'unknown' });
      formWrap.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      setTimeout(() => bookingButton.focus({ preventScroll: true }), reduce ? 0 : 650);
    });
  });

  /* ── reveal on scroll + count-ups ──────────────────────────────────── */
  function countUp(el) {
    if (reduce) return;
    const target = Number(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1400);
      el.textContent = prefix + Math.round(target * (1 - Math.pow(1 - t, 3))).toLocaleString('en-US') + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    el.textContent = prefix + '0' + suffix;
    requestAnimationFrame(tick);
  }
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      entry.target.querySelectorAll('[data-count]').forEach(countUp);
      revealer.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-reveal]').forEach((el) => revealer.observe(el));

  const svgNS = 'http://www.w3.org/2000/svg';
  const TRI = 'M26 26 L76 50 L26 74 Z'; // the Signal Triangle, brand element geometry

  /* ── hero: a live status line cycles through the channels ─────────── */
  const statusText = document.getElementById('statusText');
  const statusIco = document.getElementById('statusIco');
  const STATUS = [
    ['wa', 'Replying on WhatsApp'],
    ['phone', 'Picking up a call'],
    ['social', 'Replying on social'],
    ['web', 'Answering on your website'],
  ];
  if (!reduce) {
    let si = 0;
    setInterval(() => {
      if (document.hidden) return;
      si = (si + 1) % STATUS.length;
      statusText.parentElement.classList.add('swap');
      setTimeout(() => {
        statusIco.setAttribute('href', '#i-' + STATUS[si][0]);
        statusText.textContent = STATUS[si][1];
        statusText.parentElement.classList.remove('swap');
      }, 260);
    }, 2600);
  }

  /* ── the orbit: Stella hands each job to a specialist ──────────────── */
  const specs = [...document.querySelectorAll('.spec')];
  const nodesBox = document.querySelector('.orbit-nodes');
  const spokesBox = document.querySelector('.spokes');
  const R = 150;
  const nodes = [];
  const spokes = [];
  specs.forEach((spec, i) => {
    const angle = (i / specs.length) * Math.PI * 2 - Math.PI / 2;
    const x = 200 + R * Math.cos(angle);
    const y = 200 + R * Math.sin(angle);
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', 200); line.setAttribute('y1', 200);
    line.setAttribute('x2', x); line.setAttribute('y2', y);
    line.setAttribute('class', 'spoke');
    spokesBox.appendChild(line);
    spokes.push({ line, x, y, deg: (angle * 180) / Math.PI });

    const node = document.createElement('div');
    node.className = 'orbit-node';
    node.style.left = `${(x / 400) * 100}%`;
    node.style.top = `${(y / 400) * 100}%`;
    node.innerHTML = `<svg viewBox="0 0 24 24"><use href="#i-${spec.dataset.icon}"/></svg>`;
    nodesBox.appendChild(node);
    nodes.push(node);
  });
  // The job travels out as a Signal Triangle: a direction, not a dot.
  const packet = document.createElementNS(svgNS, 'path');
  packet.setAttribute('d', 'M-6 -7 L8 0 L-6 7 Z');
  packet.setAttribute('class', 'packet');
  packet.style.opacity = 0;
  spokesBox.appendChild(packet);

  let active = -1;
  let timer = null;
  let hovering = false;
  function setActive(i) {
    active = i;
    specs.forEach((s, j) => s.classList.toggle('on', j === i));
    nodes.forEach((n, j) => n.classList.toggle('on', j === i));
    spokes.forEach((s, j) => s.line.classList.toggle('on', j === i));
    if (reduce || !spokes[i]) return;
    const { x, y, deg } = spokes[i];
    packet.animate(
      [
        { transform: `translate(200px, 200px) rotate(${deg}deg)`, opacity: 0 },
        { opacity: 1, offset: 0.2 },
        { opacity: 1, offset: 0.8 },
        { transform: `translate(${x}px, ${y}px) rotate(${deg}deg)`, opacity: 0 },
      ],
      { duration: 900, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)' },
    );
  }
  const step = () => { if (!hovering) setActive((active + 1) % specs.length); };
  specs.forEach((spec, i) => {
    spec.addEventListener('mouseenter', () => { hovering = true; setActive(i); });
    spec.addEventListener('mouseleave', () => { hovering = false; });
  });
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !timer) { step(); timer = setInterval(step, 2200); }
    if (!entry.isIntersecting) { clearInterval(timer); timer = null; }
  }, { threshold: 0.3 }).observe(document.querySelector('.team'));

  /* ── the story: the chat plays on a loop while the timeline advances ─ */
  const msgs = [...document.querySelectorAll('#chat .msg')];
  const typing = document.querySelector('#chat .typing');
  const chat = document.getElementById('chat');
  const tls = [...document.querySelectorAll('#timeline .tl')];
  const timeline = document.getElementById('timeline');
  let timers = [];
  let storyOn = false;
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  /* The line runs dot centre to dot centre, so it lands exactly where each step lights. */
  let dotY = [];
  let stage = -1;
  function measure() {
    const top = timeline.getBoundingClientRect().top;
    dotY = tls.map((tl) => { const r = tl.querySelector('.tl-dot').getBoundingClientRect(); return r.top + r.height / 2 - top; });
    timeline.style.setProperty('--y0', `${dotY[0]}px`);
    timeline.style.setProperty('--span', `${dotY[dotY.length - 1] - dotY[0]}px`);
    timeline.style.setProperty('--fill', `${stage < 0 ? 0 : dotY[stage] - dotY[0]}px`);
  }
  measure();
  new ResizeObserver(measure).observe(timeline);
  /* Steps behind are done, one step is current, steps ahead wait. */
  function setStage(n) {
    stage = n;
    timeline.style.setProperty('--fill', `${n < 0 ? 0 : dotY[n] - dotY[0]}px`);
    tls.forEach((tl, i) => {
      tl.classList.toggle('done', i < n);
      tl.classList.toggle('on', i === n);
      tl.classList.toggle('next', i > n);
    });
  }
  function play() {
    timers.forEach(clearTimeout); timers = [];
    chat.classList.remove('clearing');
    msgs.forEach((m) => m.classList.remove('show'));
    typing.classList.remove('show');
    setStage(-1);
    let t = 150;
    msgs.forEach((m, i) => {
      if (m.classList.contains('out')) {
        later(() => { chat.appendChild(typing); typing.classList.add('show'); }, t);
        t += 800;
      }
      later(() => {
        typing.classList.remove('show');
        m.classList.add('show');
        chat.appendChild(typing);
        if (i === 1) setStage(0);
        if (i === 3) setStage(1);
      }, t);
      t += m.classList.contains('in') ? 650 : 500;
    });
    for (let s = 2; s < tls.length; s++) { t += 1000; later(() => setStage(s), t); }
    // Hold the finished conversation, clear it, and start again: it never stops.
    later(() => { chat.classList.add('clearing'); setStage(-1); }, t + 2600);
    later(() => { if (storyOn) play(); }, t + 3200);
  }
  if (reduce) {
    msgs.forEach((m) => m.classList.add('show'));
    setStage(tls.length - 1);
  } else {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !storyOn) { storyOn = true; play(); }
      if (!entry.isIntersecting && storyOn) { storyOn = false; timers.forEach(clearTimeout); timers = []; }
    }, { threshold: 0.25 }).observe(document.querySelector('.story'));
  }

  /* ── live activity feed: a new line rolls in every couple of seconds ─ */
  const feed = document.getElementById('feed');
  feed.firstElementChild.classList.add('new');
  if (!reduce) {
    let feedTimer = null;
    const roll = () => {
      const first = feed.firstElementChild;
      const h = first.getBoundingClientRect().height + 6;
      feed.style.transition = 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)';
      feed.style.transform = `translateY(-${h}px)`;
      first.style.opacity = 0;
      setTimeout(() => {
        feed.style.transition = 'none';
        feed.style.transform = 'none';
        first.style.opacity = '';
        first.classList.remove('new');
        feed.appendChild(first);
        feed.firstElementChild.classList.add('new');
      }, 720);
    };
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !feedTimer) feedTimer = setInterval(roll, 2300);
      if (!entry.isIntersecting) { clearInterval(feedTimer); feedTimer = null; }
    }).observe(feed);
  }

  /* ── getting started: progress fills 1 → 2 → 3, then starts over ──── */
  const steps = document.querySelector('.steps');
  const stepEls = [...steps.querySelectorAll('.step')];
  const setStep = (n) => {
    stepEls.forEach((el, i) => { el.classList.toggle('on', i === n); el.classList.toggle('done', i < n); });
    steps.style.setProperty('--fill', n / (stepEls.length - 1));
  };
  if (reduce) setStep(stepEls.length - 1);
  else {
    let n = -1;
    let stepTimer = null;
    const next = () => { n = (n + 1) % stepEls.length; setStep(n); };
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !stepTimer) { next(); stepTimer = setInterval(next, 1900); }
      if (!entry.isIntersecting) { clearInterval(stepTimer); stepTimer = null; }
    }, { threshold: 0.3 }).observe(steps);
  }

  /* ── the form ──────────────────────────────────────────────────────── */
  const params = new URLSearchParams(location.search);
  const tracking = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid'].forEach((k) => {
    if (params.get(k)) tracking[k] = params.get(k).slice(0, 200);
  });

  const form = document.getElementById('leadForm');
  const formCard = form.closest('.form-card');
  const errorBox = document.getElementById('formError');
  const btn = document.getElementById('submitBtn');
  const btnLabel = btn.innerHTML;
  const digits = (v) => v.replace(/\D/g, '').length;
  const validators = {
    name: (v) => v.trim().length > 1,
    business: (v) => v.trim().length > 1,
    email: (v) => /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]{2,}$/.test(v.trim()),
    phone: (v) => /^\+?[\d\s()-]+$/.test(v.trim()) && digits(v) >= 8 && digits(v) <= 15,
  };
  function check(el) {
    const ok = validators[el.name](el.value);
    el.closest('.field').classList.toggle('invalid', !ok);
    el.setAttribute('aria-invalid', String(!ok));
    return ok;
  }
  Object.keys(validators).forEach((n) => {
    const el = form.elements[n];
    el.addEventListener('blur', () => { if (el.value) check(el); });
    el.addEventListener('input', () => { if (el.closest('.field').classList.contains('invalid')) check(el); });
    el.addEventListener('change', () => { if (el.tagName === 'SELECT') check(el); });
  });
  let started = false;
  form.addEventListener('focusin', () => { if (!started) { started = true; push('form_start'); } });

  function fail(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    btn.disabled = false;
    btn.innerHTML = btnLabel;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.hidden = true;
    const fields = Object.keys(validators).map((n) => form.elements[n]);
    const bad = fields.filter((el) => !check(el));
    if (bad.length) { bad[0].focus(); return; }

    const lead = Object.fromEntries(fields.map((el) => [el.name, el.value.trim()]));
    Object.assign(lead, tracking, {
      website: form.elements.website.value, // honeypot, checked by the server
      page: location.href.split('?')[0],
    });
    btn.disabled = true;
    btn.textContent = 'Sending…';

    let sent = false;
    if (CONFIG.FORM_ENDPOINT) {
      try {
        const r = await fetch(CONFIG.FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lead),
        });
        sent = r.ok;
      } catch { sent = false; }
    }
    if (!sent && CONFIG.WHATSAPP_NUMBER) {
      // The email function is unavailable: hand the lead over by WhatsApp so it is never lost.
      // Same tab, because phones block a new window opened after a network wait. No
      // conversion fires: the lead only arrives if the visitor sends the message.
      const msg = `HireStella demo request\nName: ${lead.name}\nBusiness: ${lead.business}\nEmail: ${lead.email}\nPhone: ${lead.phone}`;
      btn.disabled = false;
      btn.innerHTML = btnLabel;
      location.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      return;
    }
    if (!sent) {
      fail('Your request could not be sent. Please try again, or email us at sales@hirestella.ai.');
      return;
    }

    // The conversion fires on the thank-you page, so it counts delivered leads only.
    // Only a marker travels there, never a name, email or number.
    try { sessionStorage.setItem('hs-lead', JSON.stringify({ type: 'demo' })); } catch { /* optional */ }
    if (CONFIG.THANK_YOU_URL) {
      location.href = CONFIG.THANK_YOU_URL;
      return;
    }
    formCard.classList.add('sent');
    formCard.querySelector('.form-done h2').focus({ preventScroll: true });
  });
})();
