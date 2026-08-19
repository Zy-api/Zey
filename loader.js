/* loader.js — Flash Toolbox 同步加载器：从 data.json 读取内容/主题/卡片/按钮/菜单/图标，驱动前台渲染。
   设计原则：原前台 index.html 代码一字不改，本文件仅通过 DOM/CSS 变量注入数据。data.json 缺失时降级用原内联字典。 */
(function () {
  var DATA_URL = 'data.json';
  var ICONS = {};
  (function injectStyles() {
    var css = '.hero h1{font-size:var(--hero-title-size,38px)}.section-head h2,.section-title-bar h2{font-size:var(--section-title-size,20px)}.dl-card-title{font-size:var(--card-title-size,15px)}.dl-card-info h3{font-size:var(--dl-card-title-size,24px)}.btn-lg{padding:12px 22px;font-size:15px}.btn-sm{padding:7px 12px;font-size:12px}.no-anim *{transition:none!important;transform:none!important}.dl-card,.dl-btn,.env-card,.arch-layer{transition:var(--anim-duration,.25s) var(--anim-easing,cubic-bezier(.2,.8,.2,1))}.dl-btn:hover,.btn-primary:hover{transform:translateY(-1px)}';
    var s = document.createElement('style'); s.id = 'loader-patch'; s.textContent = css; document.head.appendChild(s);
  })();
  function el(sel) { return document.querySelector(sel); }
  function all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function curLang() { return document.documentElement.lang === 'en' ? 'en' : 'zh'; }
  function t(key) { return (window.i18n && window.i18n[curLang()] && window.i18n[curLang()][key]) || key; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function applyTheme(th) {
    if (!th) return;
    var root = document.documentElement.style;
    if (th.colors) Object.keys(th.colors).forEach(function (k) { root.setProperty('--' + k, th.colors[k]); });
    if (th.font) {
      if (th.font.family) root.setProperty('--font', th.font.family);
      if (th.font.baseSize) { root.setProperty('--font-size', th.font.baseSize); document.body.style.fontSize = th.font.baseSize; }
      if (th.font.heroTitleSize) root.setProperty('--hero-title-size', th.font.heroTitleSize);
      if (th.font.sectionTitleSize) root.setProperty('--section-title-size', th.font.sectionTitleSize);
      if (th.font.cardTitleSize) root.setProperty('--card-title-size', th.font.cardTitleSize);
      if (th.font.dlCardTitleSize) root.setProperty('--dl-card-title-size', th.font.dlCardTitleSize);
    }
    if (th.layout) {
      if (th.layout.radius) root.setProperty('--radius', th.layout.radius);
      if (th.layout.cardRadius) root.setProperty('--card-radius', th.layout.cardRadius);
      if (th.layout.btnRadius) root.setProperty('--btn-radius', th.layout.btnRadius);
      if (th.layout.pageMaxWidth) root.setProperty('--page-max-width', th.layout.pageMaxWidth);
      if (th.layout.sectionPadding) root.setProperty('--section-padding', th.layout.sectionPadding);
      if (th.layout.heroPadding) root.setProperty('--hero-padding', th.layout.heroPadding);
    }
    if (th.anim) {
      document.body.classList.toggle('no-anim', th.anim.cardHover === false && th.anim.btnHoverLift === false && th.anim.menuSlide === false);
      if (th.anim.duration) root.setProperty('--anim-duration', th.anim.duration);
      if (th.anim.easing) root.setProperty('--anim-easing', th.anim.easing);
    }
    if (th.nav) {
      var nav = el('.topnav'); if (nav) {
        if (th.nav.height) nav.style.height = th.nav.height;
        if (th.nav.sticky === false) nav.style.position = 'static';
      }
      var links = el('.topnav-links'); if (links && th.nav.linksGap) links.style.gap = th.nav.linksGap;
      var logo = el('.logo'); if (logo && th.nav.logoSize) logo.style.fontSize = th.nav.logoSize;
    }
  }

  function iconSVG(name, size) {
    size = size || 24;
    var raw = ICONS[name] || ICONS.cube || '';
    var m = raw.match(/viewBox='([^']+)'/); var vb = m ? m[1] : '0 0 24 24';
    var inner = raw.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '');
    return '<svg width="' + size + '" height="' + size + '" viewBox="' + vb + '" fill="none" stroke="currentColor" stroke-width="2">' + inner + '</svg>';
  }

  function applyBrand(brand) {
    if (!brand) return;
    var flash = all('.logo span, .nav-brand span.flash'); flash.forEach(function (s) { s.textContent = brand.flash || 'Flash'; });
    var tb = all('.brand span:not(.flash), .nav-brand span:not(.flash)'); tb.forEach(function (s) { if (s.textContent === 'Toolbox' || s.textContent === 'toolbox') s.textContent = brand.toolbox || 'Toolbox'; });
    if (brand.logoIcon) {
      var logoSvg = el('.logo svg'); if (logoSvg) logoSvg.outerHTML = iconSVG(brand.logoIcon, 26);
      var navSvg = el('.nav-brand svg'); if (navSvg) navSvg.outerHTML = iconSVG(brand.logoIcon, 26);
    }
  }

  function renderNav(nav) {
    if (!nav || !nav.length) return;
    var host = el('.topnav-links'); if (!host) return;
    host.innerHTML = '';
    nav.filter(function (n) { return n.show !== false; }).forEach(function (n) {
      var a = document.createElement('a'); a.href = n.href || '#'; a.dataset.nav = n.key;
      var s = document.createElement('span'); s.dataset.i18n = 'nav.' + n.key; s.textContent = n.labelZh || n.labelEn || n.key;
      a.appendChild(s); host.appendChild(a);
    });
  }

  function renderMenu(menu) {
    if (!menu || !menu.length) return;
    var hosts = all('.mega-nav'); hosts.forEach(function (host) {
      host.innerHTML = '';
      menu.filter(function (m) { return m.show !== false; }).forEach(function (m) {
        var a = document.createElement('a'); a.href = '#'; a.className = 'mega-nav-item' + (m.key === 'home' ? ' active' : ''); a.dataset.page = m.page || m.key;
        a.innerHTML = '<span class="mega-nav-num">' + esc(m.num || '') + '</span><span class="mega-nav-text" data-i18n="menu.' + esc(m.key) + '">' + esc(m.labelZh || m.labelEn || m.key) + '</span><svg class="mega-nav-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>';
        host.appendChild(a);
      });
    });
  }

  function cardIconHTML(c) {
    if (c.iconImg) return '<img src="' + esc(c.iconImg) + '" style="width:20px;height:20px;object-fit:contain" onerror="this.outerHTML=\'' + iconSVG(c.icon || 'cube', 20).replace(/'/g,"\\'") + '\'">';
    return iconSVG(c.icon || 'cube', 20);
  }
  function dlCardIconHTML(d) {
    if (d.iconImg) return '<img src="' + esc(d.iconImg) + '" style="width:32px;height:32px;object-fit:contain" onerror="this.outerHTML=\'' + iconSVG(d.icon || 'package', 32).replace(/'/g,"\\'") + '\'">';
    return iconSVG(d.icon || 'package', 32);
  }

  function renderCards(cards) {
    if (!cards || !cards.length) return;
    var host = el('.dl-grid'); if (!host) return;
    host.innerHTML = '';
    cards.filter(function (c) { return c.show !== false; }).forEach(function (c) {
      var featured = c.featured ? ' featured' : '';
      var metaHtml = (c.meta || []).map(function (m) { return '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ' + esc(m.textZh || '') + '</span>'; }).join('');
      var div = document.createElement('div'); div.className = 'dl-card' + featured;
      div.innerHTML =
        '<div class="dl-card-head"><div class="dl-card-icon" style="color:' + esc(c.iconColor || 'var(--accent)') + '">' + cardIconHTML(c) + '</div><div><div class="dl-card-title">' + esc(c.titleZh || '') + '</div><div class="dl-card-version">' + esc(c.versionZh || '') + '</div></div></div>' +
        '<div class="dl-card-desc">' + esc(c.descZh || '') + '</div>' +
        '<div class="dl-card-meta">' + metaHtml + '</div>' +
        '<button class="dl-btn ' + (c.btnStyle === 'ghost' ? 'ghost' : '') + '" onclick="showToast(\'toast.welcome\')">' + iconSVG('check', 15) + '<span>' + esc(c.btnTextZh || '') + '</span></button>';
      host.appendChild(div);
    });
  }

  function renderDlCards(dlCards) {
    if (!dlCards || !dlCards.length) return;
    var panel = el('.dl-panel .dl-container'); if (!panel) return;
    var support = panel.querySelector('.dl-support');
    var proj = panel.querySelector('.dl-section-title'); if (proj) proj.lastElementChild.textContent = String(dlCards.filter(function (d) { return d.show !== false; }).length).padStart(2, '0') + ' 个项目';
    all('.dl-panel .dl-card').forEach(function (n) { n.parentNode.removeChild(n); });
    var frag = document.createDocumentFragment();
    dlCards.filter(function (d) { return d.show !== false; }).forEach(function (d) {
      var featHtml = (d.features || []).map(function (f) { return '<div class="dl-feature">' + esc(f.zh || '') + '</div>'; }).join('');
      var div = document.createElement('div'); div.className = 'dl-card';
      div.innerHTML =
        '<div class="dl-card-header"><div class="dl-card-icon">' + dlCardIconHTML(d) + '</div><div class="dl-card-info"><div class="dl-version">' + esc(d.versionZh || '') + '</div><h3>' + esc(d.titleZh || '') + '</h3><p>' + esc(d.descZh || '') + '</p></div></div>' +
        '<div class="dl-features">' + featHtml + '</div>' +
        '<div class="dl-card-desc">' + esc(d.detailZh || '') + '</div>' +
        '<button class="dl-btn" onclick="dlFile(\'' + esc(d.titleZh || '') + '\')">' + iconSVG('download', 18) + '<span>' + esc(d.btnTextZh || '立即下载') + '</span></button>';
      frag.appendChild(div);
    });
    if (support) panel.insertBefore(frag, support); else panel.appendChild(frag);
  }

  function btnSizeClass(s) { return s === 'large' ? 'btn-lg' : (s === 'small' ? 'btn-sm' : ''); }
  function renderButtons(buttons) {
    if (!buttons || !buttons.length) return;
    var heroBox = el('.hero-actions'); var ctaBox = el('.cta-banner-actions');
    if (heroBox) heroBox.innerHTML = '';
    if (ctaBox) ctaBox.innerHTML = '';
    buttons.filter(function (b) { return b.show !== false; }).forEach(function (b) {
      var a = document.createElement('a'); a.href = b.link || '#'; a.className = 'btn ' + (b.style === 'ghost' ? 'btn-ghost' : 'btn-primary') + ' ' + btnSizeClass(b.size);
      a.innerHTML = '<span>' + esc(b.textZh || b.textEn || '') + '</span>';
      if (b.id === 'bTg' || (b.link && b.link.indexOf('t.me') >= 0)) a.target = '_blank';
      if (b.id === 'bHero' || b.zone === 'hero') { if (heroBox) heroBox.appendChild(a); }
      else if (b.id === 'bCta' || b.zone === 'cta') { if (ctaBox) ctaBox.appendChild(a); }
      else if (b.zone === 'hero' && heroBox) heroBox.appendChild(a);
      else if (ctaBox) ctaBox.appendChild(a);
    });
  }

  function buildI18n(data) {
    var zh = JSON.parse(JSON.stringify(data.content.zh || {}));
    var en = JSON.parse(JSON.stringify(data.content.en || {}));
    (data.nav || []).forEach(function (n) { zh['nav.' + n.key] = n.labelZh; en['nav.' + n.key] = n.labelEn; });
    (data.menu || []).forEach(function (m) { zh['menu.' + m.key] = m.labelZh; en['menu.' + m.key] = m.labelEn; });
    window.i18n = { zh: zh, en: en };
  }

  function applyI18nToDom() {
    var lang = curLang();
    document.querySelectorAll('[data-i18n]').forEach(function (node) {
      var key = node.getAttribute('data-i18n');
      var val = (window.i18n && window.i18n[lang] && window.i18n[lang][key]);
      if (val) { if (String(val).indexOf('<br>') >= 0) node.innerHTML = val; else node.textContent = val; }
    });
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
  }

  function renderAll(data) {
    ICONS = data.icons || {};
    buildI18n(data);
    applyTheme(data.theme);
    applyBrand(data.brand);
    renderNav(data.nav);
    renderMenu(data.menu);
    renderCards(data.cards);
    renderDlCards(data.dlCards);
    renderButtons(data.buttons);
    applyI18nToDom();
    window.__DATA__ = data;
  }

  fetch(DATA_URL, { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (data) {
    renderAll(data);
    window.setLanguage = function (lang) { document.documentElement.lang = (lang === 'en' ? 'en' : 'zh-CN'); applyI18nToDom(); };
  }).catch(function (err) {
    console.warn('[loader] data.json 加载失败，使用内联字典降级', err);
  });
})();
