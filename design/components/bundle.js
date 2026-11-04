/* @ds-bundle: {"format":4,"namespace":"Graphpaper","components":[{"name":"CtaTab"},{"name":"NavLink"},{"name":"ArrowButton"},{"name":"Toggle"},{"name":"NavBar"},{"name":"SplitHeadline"},{"name":"SectionIntro"},{"name":"GraphPaper"},{"name":"NodeCard"},{"name":"NodeCanvas"},{"name":"ToolChips"},{"name":"HeaderCard"},{"name":"MediaCard"},{"name":"CardRail"},{"name":"ScrollSpyList"},{"name":"FooterSlab"},{"name":"ScrollMorph"},{"name":"Reveal"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;
  var Fragment = React.Fragment;
  var useState = React.useState, useEffect = React.useEffect, useRef = React.useRef, useLayoutEffect = React.useLayoutEffect;

  /* ---------- helpers ---------- */
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function seg(p, a, b) { return clamp((p - a) / (b - a), 0, 1); }
  function px(n) { return Math.round(n * 100) / 100 + 'px'; }
  function curve(a, b) { var dx = Math.max(40, Math.abs(b[0] - a[0]) / 2); return 'M' + a[0] + ' ' + a[1] + ' C' + (a[0] + dx) + ' ' + a[1] + ', ' + (b[0] - dx) + ' ' + b[1] + ', ' + b[0] + ' ' + b[1]; }
  function wire(a, b, key) { return h('g', { key: key }, h('path', { d: curve(a, b) }), h('circle', { cx: a[0], cy: a[1], r: 4.5 }), h('circle', { cx: b[0], cy: b[1], r: 4.5 })); }

  function useReducedMotion() {
    var mq = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var s = useState(mq ? mq.matches : false);
    useEffect(function () {
      if (!mq) return undefined;
      var on = function (e) { s[1](e.matches); };
      if (mq.addEventListener) mq.addEventListener('change', on); else mq.addListener(on);
      return function () { if (mq.removeEventListener) mq.removeEventListener('change', on); else mq.removeListener(on); };
    }, []);
    return s[0];
  }

  function useWidth(ref) {
    var s = useState(0);
    useLayoutEffect(function () {
      var el = ref.current; if (!el) return undefined;
      s[1](el.clientWidth);
      if (!window.ResizeObserver) return undefined;
      var ro = new ResizeObserver(function () { s[1](el.clientWidth); });
      ro.observe(el);
      return function () { ro.disconnect(); };
    }, []);
    return s[0];
  }

  /* 0..1 across start..end px of scroll in a scroll container ref, or the window when ref is null. */
  function useScrollProgress(ref, opts) {
    opts = opts || {};
    var start = opts.start || 0, end = opts.end == null ? 150 : opts.end;
    var s = useState(0);
    useEffect(function () {
      var el = ref && ref.current; var target = el || window; var raf = 0;
      function read() { raf = 0; var y = el ? el.scrollTop : window.scrollY; s[1](clamp((y - start) / ((end - start) || 1), 0, 1)); }
      function on() { if (!raf) raf = requestAnimationFrame(read); }
      read();
      target.addEventListener('scroll', on, { passive: true });
      window.addEventListener('resize', on);
      return function () { target.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf); };
    }, [ref, start, end]);
    return s[0];
  }

  /* ---------- Actions ---------- */
  var TAB_TYPE = { s: 'label', l: 'display-l', xl: 'display-xl' };
  function CtaTab(props) {
    var size = props.size || 's';
    var a = { className: cx('gp-tab', 'gp-tab--' + size, 'gp-tab--' + (props.corner || 'bl'), TAB_TYPE[size], props.className), style: props.style, 'aria-label': props['aria-label'] };
    if (props.href) { a.href = props.href; return h('a', a, props.children); }
    a.type = 'button'; a.onClick = props.onClick;
    return h('button', a, props.children);
  }

  function NavLink(props) {
    return h('a', { className: cx('gp-navlink', 'label', props.className), href: props.href || '#', 'aria-current': props.current ? 'page' : undefined, onClick: props.onClick }, props.children);
  }

  function ArrowButton(props) {
    var prev = props.direction === 'prev';
    return h('button', { type: 'button', className: cx('gp-arrow', 'intro', props.className), onClick: props.onClick, 'aria-label': props.label || (prev ? 'Previous' : 'Next') }, h('span', { 'aria-hidden': true }, prev ? '←' : '→'));
  }

  function Toggle(props) {
    var reduced = useReducedMotion();
    var driven = props.progress != null;
    var p = driven ? clamp(props.progress, 0, 1) : (props.checked ? 1 : 0);
    var on = p >= 0.5;
    return h('button', {
      type: 'button', role: 'switch', 'aria-checked': on, 'aria-label': props.label || 'Switch view',
      className: cx('gp-toggle', !driven && !reduced && 'gp-toggle--animate', props.className), style: { '--p': p },
      onClick: props.onChange ? function () { props.onChange(!on); } : undefined
    }, h('span', { className: 'gp-toggle__knob', 'aria-hidden': true }));
  }

  /* ---------- Navigation ---------- */
  function NavBar(props) {
    var p = clamp(props.progress || 0, 0, 1);
    var ctaRef = useRef(null);
    var cw = useState(0);
    useLayoutEffect(function () { var w = ctaRef.current ? ctaRef.current.offsetWidth : 0; if (w !== cw[0]) cw[1](w); });
    var brand = typeof props.brand === 'string' ? h('a', { className: 'gp-nav__brand label', href: props.brandHref || '#' }, props.brand) : (props.brand || null);
    var links = h('ul', { className: 'gp-nav__links' }, (props.links || []).map(function (l, i) {
      return h('li', { key: i }, h(NavLink, { href: l.href, current: l.current }, l.label));
    }));
    var cta = props.cta ? h('div', { ref: ctaRef, className: cx('gp-nav__cta', p > 0.5 && 'is-compact'), style: { '--p': easeOutCubic(p) } },
      h(CtaTab, { size: 'l', corner: 'bl', href: props.cta.href, onClick: props.cta.onClick }, props.cta.label)) : null;
    var position = props.position || 'static';
    if (position === 'static') return h('nav', { className: cx('gp-nav', props.className), 'aria-label': props.label || 'Main' }, brand, links, cta);
    var layer = 'gp-nav__layer gp-nav__layer--' + position;
    return h(Fragment, null,
      h('nav', { className: cx(layer, props.blend && 'gp-nav__layer--blend', props.className), 'aria-label': props.label || 'Main' },
        h('div', { className: 'gp-nav', style: { paddingRight: cw[0] } }, brand, links)),
      cta ? h('div', { className: cx(layer, 'gp-nav__layer--cta') }, cta) : null);
  }

  /* ---------- Type ---------- */
  function SplitHeadline(props) {
    var em = props.emphasis || 'both';
    var j = props.joiner === '+' ? h('span', { className: 'gp-plus', role: 'img', 'aria-label': 'plus' }, '+') : props.joiner;
    var Tag = props.as || 'h2';
    var size = props.size === 'l' ? 'display-l gp-fluid-l' : 'display-xl gp-fluid-xl';
    return h(Tag, { className: cx('gp-split', size, props.className), style: props.style },
      h('span', { className: cx('gp-split__half', em === 'right' && 'is-rest') }, props.left),
      j || null,
      h('span', { className: cx('gp-split__half', em === 'left' && 'is-rest') }, props.right));
  }

  function SectionIntro(props) {
    var Tag = props.as || 'h2';
    var title = h(Tag, { key: 'h', className: 'display-xl gp-fluid-xl' }, props.title);
    var text = props.children ? h('p', { key: 't', className: 'gp-intro__text intro' }, props.children) : null;
    return h('header', { className: cx('gp-intro', props.align === 'center' && 'gp-intro--center', props.className) },
      props.introPosition === 'above' ? [text, title] : [title, text]);
  }

  /* ---------- Canvas ---------- */
  function GraphPaper(props) {
    var Tag = props.as || 'div';
    return h(Tag, { className: cx('gp-paper', props.framed && 'gp-paper--framed', props.className), style: props.style }, props.children);
  }

  var HEAD = 21.2; /* label line height plus space-xs */
  function portY(n) { return n.y + ((n.type || n.model) ? HEAD : 0) + Math.min(24, (n.h || 100) / 2); }

  function NodeCard(props) {
    var text = props.kind === 'text';
    var fixed = { height: props.height, flex: props.height != null ? 'none' : undefined };
    var body = text
      ? h('div', { className: 'gp-node__body gp-node__body--text small', style: fixed }, props.children)
      : h('div', { className: 'gp-node__body', style: fixed }, props.src ? h('img', { src: props.src, alt: props.alt || '' }) : h('div', { className: 'gp-placeholder small' }, props.alt || 'Media'));
    return h('div', Object.assign({ className: cx('gp-node', !props.nodeProps && 'is-static', props.dragging && 'is-dragging', props.className), style: Object.assign({ width: props.width }, props.style) }, props.nodeProps || {}),
      (props.type || props.model) ? h('div', { className: 'gp-node__head' },
        props.type ? h('span', { className: 'label' }, props.type) : null,
        props.model ? h('span', { className: 'label-wide muted' }, props.model) : null) : null,
      body);
  }

  function NodeCanvas(props) {
    var wrap = useRef(null);
    var width = useWidth(wrap);
    var narrow = width > 0 && width < 768;
    var source = narrow && props.nodesMobile ? props.nodesMobile : (props.nodes || []);
    var s = useState(source.map(function (n) { return Object.assign({}, n); }));
    var nodes = s[0], setNodes = s[1];
    var lastSource = useRef(source);
    useEffect(function () {
      if (lastSource.current !== source) { lastSource.current = source; setNodes(source.map(function (n) { return Object.assign({}, n); })); }
    }, [narrow]);
    var drag = useRef(null);
    var ds = useState(null), dragging = ds[0], setDragging = ds[1];
    var height = props.height || 480;
    var canDrag = props.draggable !== false && !narrow;

    function move(id, x, y) {
      setNodes(function (list) {
        return list.map(function (n) {
          if (n.id !== id) return n;
          var nh = (n.h || 100) + ((n.type || n.model) ? HEAD : 0);
          return Object.assign({}, n, { x: clamp(x, 0, Math.max(0, width - n.w)), y: clamp(y, 0, height - nh) });
        });
      });
    }
    function down(e, n) {
      if (!canDrag || e.button > 0) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      drag.current = { id: n.id, sx: e.clientX, sy: e.clientY, ox: n.x, oy: n.y };
      setDragging(n.id);
    }
    function moveP(e) { var d = drag.current; if (d) move(d.id, d.ox + e.clientX - d.sx, d.oy + e.clientY - d.sy); }
    function up() { drag.current = null; setDragging(null); }
    function key(e, n) {
      var step = e.shiftKey ? 32 : 8, dx = 0, dy = 0;
      if (e.key === 'ArrowLeft') dx = -step; else if (e.key === 'ArrowRight') dx = step; else if (e.key === 'ArrowUp') dy = -step; else if (e.key === 'ArrowDown') dy = step; else return;
      e.preventDefault(); move(n.id, n.x + dx, n.y + dy);
    }

    var byId = {}; nodes.forEach(function (n) { byId[n.id] = n; });
    var links = (narrow && props.linksMobile ? props.linksMobile : props.links || []).map(function (l, i) {
      var a = byId[l[0]], b = byId[l[1]];
      return a && b ? wire([a.x + a.w, portY(a)], [b.x, portY(b)], i) : null;
    });

    return h('div', { ref: wrap, className: cx('gp-canvas', 'gp-paper', props.className), style: { height: height }, role: 'group', 'aria-label': props.label || 'Workflow canvas' },
      h('svg', { className: 'gp-wires', 'aria-hidden': true }, links),
      width ? nodes.map(function (n) {
        var name = [n.type, n.model].filter(Boolean).join(' ') || 'Node';
        return h(NodeCard, {
          key: n.id, type: n.type, model: n.model, kind: n.kind, src: n.src, alt: n.alt, width: n.w, height: n.h,
          dragging: dragging === n.id, style: { left: n.x, top: n.y, zIndex: dragging === n.id ? 2 : 1 },
          nodeProps: canDrag ? {
            tabIndex: 0, 'data-drag': 'on', 'aria-roledescription': 'movable node', 'aria-label': name + '. Arrow keys move it.',
            onPointerDown: function (e) { down(e, n); }, onPointerMove: moveP, onPointerUp: up, onPointerCancel: up,
            onKeyDown: function (e) { key(e, n); }
          } : { 'aria-label': name }
        }, n.text);
      }) : null,
      props.hint && canDrag ? h('span', { className: 'gp-canvas__hint label muted', 'aria-hidden': true }, props.hint) : null);
  }

  /* ---------- Content ---------- */
  function ToolChips(props) {
    var items = props.items || [];
    var root = useRef(null);
    var s = useState(null), active = s[0], setActive = s[1];
    useEffect(function () {
      if (!window.IntersectionObserver || !root.current) return undefined;
      var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (!en.isIntersecting) setActive(null); }); }, { threshold: 0.1 });
      io.observe(root.current);
      return function () { io.disconnect(); };
    }, []);
    var scatter = props.layout === 'scatter';
    var center = props.center;
    function layer(on, src, alt, key) {
      return h('div', { key: key, className: cx('gp-chips__media', on && 'is-on'), 'aria-hidden': !on },
        src ? h('img', { src: src, alt: alt || '' }) : h('div', { className: 'gp-placeholder small' }, alt));
    }
    var media = center ? h('div', { className: 'gp-chips__center', style: { width: center.width || 240, height: center.height || 240 } },
      layer(active == null, center.src, center.alt || 'Source image', 'base'),
      items.map(function (it, i) { return layer(active === i, it.src, it.alt || it.label, i); })) : null;
    var chips = items.map(function (it, i) {
      var pos = scatter && props.positions && props.positions[i];
      return h('button', {
        key: i, type: 'button', 'aria-pressed': active === i,
        className: cx('gp-chip', 'intro', active === i && 'is-active', active != null && active !== i && 'is-dim'),
        style: pos ? { left: pos.x + '%', top: pos.y + '%' } : undefined,
        onMouseEnter: function () { setActive(i); }, onMouseLeave: function () { setActive(null); },
        onFocus: function () { setActive(i); }, onBlur: function () { setActive(null); }
      }, it.label);
    });
    return h('div', { ref: root, className: cx('gp-chips', scatter ? 'gp-chips--scatter' : 'gp-chips--row', props.className), style: scatter ? { height: props.height || 360 } : undefined }, media, chips);
  }

  function HeaderCard(props) {
    var media = props.tone === 'media';
    var body = media ? (props.src ? h('img', { src: props.src, alt: props.alt || '' }) : h('div', { className: 'gp-placeholder small' }, props.alt || 'Output')) : props.children;
    return h('section', { className: cx('gp-hcard', media && 'gp-hcard--media', props.className), style: props.style, 'aria-label': props.label },
      h('div', { className: 'gp-hcard__band label', 'aria-hidden': true }, props.label),
      h('div', { className: cx('gp-hcard__body', !media && 'small') }, body),
      props.action ? h('div', { className: 'gp-hcard__action', style: props.actionStyle }, h(CtaTab, { size: 's', corner: 'tr', href: props.action.href, onClick: props.action.onClick }, props.action.label)) : null);
  }

  function Panel(props) {
    return h('div', { className: cx('gp-panel', props.className), style: props.style }, props.children);
  }

  function MediaCard(props) {
    var tags = props.tags || [];
    var chain = [];
    tags.forEach(function (t, i) {
      if (i) chain.push(h('span', { key: 'l' + i, className: 'gp-tagline' }));
      chain.push(h('span', { key: 't' + i, className: 'gp-tag label' }, t));
    });
    var action = props.actionLabel || 'Try';
    return h('article', { className: cx('gp-card', props.active && 'is-active', props.className), style: props.style },
      h('h3', { className: 'title' }, props.title),
      h('div', { className: 'gp-card__frame' },
        h('div', { className: 'gp-card__img' }, props.src ? h('img', { src: props.src, alt: props.alt || '' }) : h('div', { className: 'gp-placeholder small' }, props.alt || 'Preview image')),
        tags.length ? h('div', { className: 'gp-card__tags', 'aria-hidden': true }, chain) : null,
        h('div', { className: 'gp-card__cta' }, h(CtaTab, { size: 's', corner: 'tr', href: props.href, onClick: props.onAction, 'aria-label': action + ' ' + props.title }, action))));
  }

  function CardRail(props) {
    var items = props.items || [];
    var reduced = useReducedMotion();
    var wrap = useRef(null);
    var width = useWidth(wrap);
    var s = useState(props.start || 0), i = s[0], setI = s[1];
    var cw = props.cardWidth || 420, gap = props.gap || 28.8;
    var lead = width ? width / 2 - cw / 2 : 0;
    function go(d) { setI(function (v) { return (v + d + items.length) % items.length; }); }
    return h('div', { className: cx('gp-rail', !reduced && 'gp-rail--animate', props.className), role: 'region', 'aria-roledescription': 'carousel', 'aria-label': props.label || 'Cards', ref: wrap },
      h('div', { className: 'gp-rail__track', style: { transform: 'translateX(' + px(lead - i * (cw + gap)) + ')' } },
        items.map(function (it, k) { return h(MediaCard, Object.assign({ key: k }, it, { active: k === i, style: { width: cw } })); })),
      h('div', { className: 'gp-rail__controls', style: { paddingLeft: px(lead) } },
        h(ArrowButton, { direction: 'prev', onClick: function () { go(-1); }, label: 'Previous card' }),
        h(ArrowButton, { direction: 'next', onClick: function () { go(1); }, label: 'Next card' }),
        h('span', { className: 'label muted', 'aria-live': 'polite' }, (i + 1) + ' / ' + items.length)));
  }

  /* ---------- Sections ---------- */
  function ScrollSpyList(props) {
    var items = props.items || [];
    var reduced = useReducedMotion();
    var scroller = useRef(null);
    var refs = useRef([]);
    var s = useState(0), active = s[0], setActive = s[1];
    var offset = props.offset == null ? 0.2 : props.offset;
    var onChange = useRef(props.onActiveChange); onChange.current = props.onActiveChange;
    useEffect(function () {
      var el = scroller.current; var target = el || window; var raf = 0; var last = -1;
      function read() {
        raf = 0;
        var top = el ? el.getBoundingClientRect().top : 0;
        var line = top + (el ? el.clientHeight : window.innerHeight) * (window.innerWidth < 768 ? 0.4 : offset);
        var idx = 0;
        refs.current.forEach(function (node, k) { if (node && node.getBoundingClientRect().top <= line) idx = k; });
        if (idx !== last) { last = idx; setActive(idx); if (onChange.current) onChange.current(idx); }
      }
      function on() { if (!raf) raf = requestAnimationFrame(read); }
      read();
      target.addEventListener('scroll', on, { passive: true });
      return function () { target.removeEventListener('scroll', on); if (raf) cancelAnimationFrame(raf); };
    }, [offset]);
    function jump(k) {
      var node = refs.current[k], el = scroller.current; if (!node) return;
      if (el) el.scrollTo({ top: node.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop - el.clientHeight * offset + 2, behavior: reduced ? 'auto' : 'smooth' });
      else node.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
    }
    var body = h('div', { className: 'gp-spy' },
      h('div', { className: 'gp-spy__aside' }, props.aside),
      h('ol', { className: 'gp-spy__list display-xl gp-fluid-xl', style: props.height ? { paddingTop: px(props.height * offset) } : undefined }, items.map(function (it, k) {
        return h('li', { key: k, ref: function (n) { refs.current[k] = n; } },
          h('button', { type: 'button', className: 'gp-spy__item', 'aria-current': k === active ? 'true' : undefined, onClick: function () { jump(k); } }, it));
      })));
    return props.height
      ? h('div', { ref: scroller, className: props.className, style: { height: props.height, overflowY: 'auto', overscrollBehavior: 'contain' } }, body)
      : h('div', { className: props.className }, body);
  }

  function FooterSlab(props) {
    var root = useRef(null), slab = useRef(null), cta = useRef(null);
    var s = useState(null), wireState = s[0], setWire = s[1];
    useLayoutEffect(function () {
      function measure() {
        if (!root.current || !slab.current || !cta.current) return;
        var r = root.current.getBoundingClientRect(), a = slab.current.getBoundingClientRect(), b = cta.current.getBoundingClientRect();
        var x1 = a.right - r.left, y1 = (a.top - r.top) + a.height * 0.45, x2 = b.left - r.left + 40, y2 = b.top - r.top + 2;
        setWire({ w: r.width, h: r.height, d: 'M' + x1 + ' ' + y1 + ' C' + (x1 + 90) + ' ' + (y1 + 60) + ', ' + (x2 + 80) + ' ' + (y2 - 140) + ', ' + x2 + ' ' + y2, x1: x1, y1: y1 });
      }
      measure();
      window.addEventListener('resize', measure);
      var ro = window.ResizeObserver ? new ResizeObserver(measure) : null;
      if (ro) ro.observe(root.current);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
      return function () { window.removeEventListener('resize', measure); if (ro) ro.disconnect(); };
    }, []);
    var st = props.statement || [];
    return h('footer', { ref: root, className: cx('gp-foot', props.className), 'data-theme': props.theme || 'dark' },
      h('div', { ref: slab, className: 'gp-foot__slab' },
        st.length ? h(SplitHeadline, { left: st[0], right: st[1], joiner: '+', as: 'p' }) : null,
        h('div', { className: 'gp-foot__about' },
          props.name ? h('div', { className: 'display-l' }, props.name) : h('span'),
          props.about ? h('p', { className: 'small' }, props.about) : null),
        props.columns ? h('div', { className: 'gp-foot__cols' }, props.columns.map(function (c, i) {
          return h('nav', { key: i, className: 'gp-foot__col', 'aria-label': c.title },
            h('h3', { className: 'small' }, c.title),
            h('ul', null, (c.links || []).map(function (l, k) { return h('li', { key: k }, h(NavLink, { href: l.href }, l.label)); })));
        })) : null,
        props.legal ? h('p', { className: 'label-wide' }, props.legal) : null),
      wireState ? h('svg', { className: 'gp-wires', width: wireState.w, height: wireState.h, 'aria-hidden': true }, h('path', { d: wireState.d }), h('circle', { cx: wireState.x1, cy: wireState.y1, r: 3.5 })) : null,
      props.cta ? h('div', { ref: cta, className: 'gp-foot__cta' }, h(CtaTab, { size: 'xl', corner: 'tl', href: props.cta.href, onClick: props.cta.onClick }, props.cta.label)) : null);
  }

  /* ---------- Motion ---------- */
  /* [x, y, w, h] as fractions of the field: a = scattered graph, b = docked tool */
  var MORPH = {
    prompt: { a: [0.04, 0.10, 0.25, 0.52], b: [0, 0, 0.30, 0.97] },
    nodeA: { a: [0.36, 0.00, 0.14, 0.50], b: [0.56, 0.30, 0.10, 0.30] },
    nodeB: { a: [0.22, 0.66, 0.11, 0.30], b: [0.56, 0.40, 0.10, 0.25] },
    nodeC: { a: [0.56, 0.06, 0.12, 0.26], b: [0.60, 0.30, 0.10, 0.25] },
    output: { a: [0.70, 0.12, 0.26, 0.56], b: [0.315, 0, 0.685, 0.97] }
  };

  function ScrollMorph(props) {
    var reduced = useReducedMotion();
    var scroller = useRef(null), field = useRef(null);
    var fw = useWidth(field);
    var height = props.height || 560;
    var runway = reduced ? 1 : (props.runway || 2.6);
    var ps = useState(0), p = ps[0], setP = ps[1];
    var fs = useState(0), fh = fs[0], setFh = fs[1];
    useLayoutEffect(function () { if (field.current) setFh(field.current.clientHeight); }, [fw, height]);
    useEffect(function () {
      var el = scroller.current; if (!el || reduced) return undefined; var raf = 0;
      function read() { raf = 0; var max = el.scrollHeight - el.clientHeight; setP(max > 0 ? clamp(el.scrollTop / max, 0, 1) : 0); }
      function on() { if (!raf) raf = requestAnimationFrame(read); }
      read(); el.addEventListener('scroll', on, { passive: true });
      return function () { el.removeEventListener('scroll', on); if (raf) cancelAnimationFrame(raf); };
    }, [reduced]);
    function flip(on) {
      if (reduced) { setP(on ? 1 : 0); return; }
      var el = scroller.current; if (el) el.scrollTo({ top: on ? el.scrollHeight : 0, behavior: 'smooth' });
    }
    var W = fw || 1, H = fh || 1;
    var t = easeOutCubic(seg(p, 0.1, 0.85));
    var fade = 1 - seg(p, 0.15, 0.55);
    var showRun = seg(p, 0.55, 0.9);
    var r = {};
    Object.keys(MORPH).forEach(function (k) { var m = MORPH[k]; r[k] = [0, 1, 2, 3].map(function (i) { return lerp(m.a[i], m.b[i], t); }); });
    function box(k, extra) { var q = r[k]; return Object.assign({ transform: 'translate(' + px(q[0] * W) + ',' + px(q[1] * H) + ')', width: px(q[2] * W), height: px(q[3] * H) }, extra || {}); }
    function outP(k) { var q = r[k]; return [(q[0] + q[2]) * W, q[1] * H + 45]; }
    function inP(k) { var q = r[k]; return [q[0] * W, q[1] * H + 45]; }
    var labels = props.labels || {};
    var node = function (key, type, model, alt) {
      return h('div', { key: key, className: 'gp-morph__item', style: box(key, { opacity: fade }), 'aria-hidden': p > 0.5 }, h(NodeCard, { type: type, model: model, alt: alt, width: '100%', style: { height: '100%' } }));
    };
    var stage = h('div', { className: 'gp-morph__stage', style: { height: height } },
      h(SplitHeadline, { size: props.size || 'l', left: props.left || 'From Graph', right: props.right || 'to Tool', emphasis: p < 0.5 ? 'left' : 'right',
        joiner: h(Toggle, { progress: reduced ? undefined : p, checked: p >= 0.5, onChange: flip, label: 'Show the simplified tool' }) }),
      h('div', { ref: field, className: 'gp-morph__field' },
        fw ? h('svg', { className: 'gp-wires', 'aria-hidden': true, style: { opacity: fade } },
          wire(outP('prompt'), inP('nodeA'), 0), wire(outP('nodeB'), inP('nodeA'), 1), wire(outP('nodeA'), inP('output'), 2), wire(outP('nodeC'), inP('output'), 3)) : null,
        fw ? [
          h('div', { key: 'prompt', className: 'gp-morph__item', style: box('prompt') }, h(HeaderCard, { label: labels.prompt || 'Prompt', style: { height: '100%' } }, props.prompt || 'A glass loom on a pale bench, soft light from the left, strands falling into a tray.')),
          node('nodeA', 'Image', 'Diffusion 3', 'Generated draft'),
          node('nodeB', 'Image', 'Reference', 'Reference photo'),
          node('nodeC', 'Color', 'Style', 'Colour swatch'),
          h('div', { key: 'output', className: 'gp-morph__item', style: box('output') }, h(HeaderCard, {
            label: labels.output || 'Output', tone: 'media', alt: props.outputAlt || 'Final render', style: { height: '100%' },
            action: { label: labels.run || 'Run' }, actionStyle: { opacity: showRun, pointerEvents: showRun > 0.5 ? 'auto' : 'none' }
          }))
        ] : null));
    return h('div', { ref: scroller, className: cx('gp-morph', 'gp-paper', props.className), style: { height: height, overflowY: reduced ? 'hidden' : 'auto' }, tabIndex: reduced ? undefined : 0, 'aria-label': props.label || 'Graph to tool. Scroll inside to switch views.' },
      h('div', { style: { height: height * runway } }, stage));
  }

  function Reveal(props) {
    var reduced = useReducedMotion();
    var ref = useRef(null);
    var s = useState('idle'), state = s[0], set = s[1];
    useEffect(function () {
      var el = ref.current; if (reduced || !el || !window.IntersectionObserver) return undefined;
      var root = props.root ? props.root.current : null;
      var bottom = root ? root.getBoundingClientRect().bottom : window.innerHeight;
      if (el.getBoundingClientRect().top < bottom) return undefined; /* already on screen: never hide it */
      set('hidden');
      var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { set('in'); io.disconnect(); } }); }, { root: root, threshold: 0.2 });
      io.observe(el);
      return function () { io.disconnect(); };
    }, [reduced]);
    var Tag = props.as || 'div';
    return h(Tag, { ref: ref, className: cx(state !== 'idle' && 'gp-reveal', state === 'in' && 'is-in', props.className), style: props.style }, props.children);
  }

  window.Graphpaper = Object.assign(window.Graphpaper || {}, {
    CtaTab: CtaTab, NavLink: NavLink, ArrowButton: ArrowButton, Toggle: Toggle, NavBar: NavBar,
    SplitHeadline: SplitHeadline, SectionIntro: SectionIntro, GraphPaper: GraphPaper, NodeCard: NodeCard, NodeCanvas: NodeCanvas,
    ToolChips: ToolChips, HeaderCard: HeaderCard, Panel: Panel, MediaCard: MediaCard, CardRail: CardRail,
    ScrollSpyList: ScrollSpyList, FooterSlab: FooterSlab, ScrollMorph: ScrollMorph, Reveal: Reveal,
    useReducedMotion: useReducedMotion, useScrollProgress: useScrollProgress
  });
})();
