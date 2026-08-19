 /* loader.js — Flash Toolbox 同步加载器：从 data.json 读取内容/主题/卡片/按钮/菜单/图标，驱动前台渲染 */
(function () {
  var DATA_URL = 'data.json';
  var ICONS = {};
  function el(sel) { return document.querySelector(sel); }
  function all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function curLang() { return document.documentElement.lang === 'en' ? 'en' : 'zh'; }
  function t(key) { return (window.i18n && window.i18n[curLang()] && window.i18n[curLang()][key]) || key; }

  function applyTheme(th) {
    if (!th) return;
    var root = document.documentElement.style;
    if (th.colors) Object.keys(th.colors).forEach(function (k) { root.setProperty('--' + k, th.colors[k]); });
    if (th.font) {
      if (th.font.family) root.setProperty('--font', th.font.family);
      if (th.font.baseSize) root.setProperty('--font-size', th.font.baseSize);
    }
    if (th.layout) {
      if (th.layout.radius) root.setProperty('--radius', th.layout.radius);
    }
    if (th.font && th.font.baseSize) document.body.style.fontSize = th.font.baseSize;
    if (th.anim) {
      document.body.classList.toggle('no-anim', th.anim.cardHover === false && th.anim.btnHoverLift === false);
    }
    if (th.nav && th.nav.height) {
      var nav = el('.topnav'); if (nav) nav.style.height = th.nav.height;
    }
  }

  function iconSVG(name, size) {
    size = size || 24;
    var raw = ICONS[name] || ICONS.cube || '';
    var m = raw.match(/viewBox='([^']+)'/); var vb = m ? m[1] : '0 0 24 24';
    var inner = raw.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '');
    return '<svg width="' + size + '" height="' + size + '" viewBox="' + vb + '" fill="none" stroke="currentColor" stroke-width="2">' + inner + '</svg>';
  }

  function getCardIcon(c, size) {
    size = size || 20;
    // 优先使用 iconUrl（外部链接）
    if (c.iconUrl) {
      return '<img src="' + escAttr(c.iconUrl) + '" style="width:' + size + 'px;height:' + size + 'px;object-fit:contain">';
    }
    // 其次使用 iconImg（base64 上传）
    if (c.iconImg) {
      return '<img src="' + c.iconImg + '" style="width:' + size + 'px;height:' + size + 'px;object-fit:contain">';
    }
    // 最后使用 SVG 图标库
    return iconSVG(c.icon || 'cube', size);
  }

  function escAttr(s) { return String(s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

  function applyBrand(brand) {
    if (!brand) return;
    var flash = all('.logo span, .nav-brand span.flash'); flash.forEach(function (s) { s.textContent = brand.flash || 'Flash'; });
    var tb = all('.brand span:not(.flash), .nav-brand span:not(.flash)'); tb.forEach(function (s) { if (s.textContent === 'Toolbox' || s.textContent === 'toolbox') s.textContent = brand.toolbox || 'Toolbox'; });
    var logoSvg = el('.logo svg'); if (logoSvg && brand.logoIcon) logoSvg.outerHTML = iconSVG(brand.logoIcon, 26);
    var navSvg = el('.nav-brand svg'); if (navSvg && brand.logoIcon) navSvg.outerHTML = iconSVG(brand.logoIcon, 26);
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
        a.innerHTML = '<span class="mega-nav-num">' + (m.num || '') + '</span><span class="mega-nav-text" data-i18n="menu.' + m.key + '">' + (m.labelZh || m.labelEn || m.key) + '</span><svg class="mega-nav-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>';
        host.appendChild(a);
      });
    });
  }

  function getCardSizeClass(c) {
    var s = c.size || 'medium';
    if (s === 'small') return ' dl-card-sm';
    if (s === 'large') return ' dl-card-lg';
    return '';
  }

  function renderCards(cards) {
    if (!cards || !cards.length) return;
    var host = el('.dl-grid'); if (!host) return;
    host.innerHTML = '';
    // 按 order 排序
    var sorted = cards.slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    sorted.filter(function (c) { return c.show !== false; }).forEach(function (c) {
      var featured = c.featured ? ' featured' : '';
      var sizeCls = getCardSizeClass(c);
      var iconHtml = getCardIcon(c, 20);
      var metaHtml = (c.meta || []).map(function (m) { return '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ' + (m.textZh || '') + '</span>'; }).join('');
      var div = document.createElement('div');
      div.className = 'dl-card' + featured + sizeCls;
      if (c.width && c.width > 1) div.style.gridColumn = 'span ' + Math.min(c.width, 3);
      div.innerHTML =
        '<div class="dl-card-head"><div class="dl-card-icon" style="color:' + (c.iconColor || 'var(--accent)') + '">' + iconHtml + '</div><div><div class="dl-card-title">' + (c.titleZh || '') + '</div><div class="dl-card-version">' + (c.versionZh || '') + '</div></div></div>' +
        '<div class="dl-card-desc">' + (c.descZh || '') + '</div>' +
        '<div class="dl-card-meta">' + metaHtml + '</div>' +
        '<button class="dl-btn ' + (c.btnStyle === 'ghost' ? 'ghost' : '') + '" onclick="showToast(\'toast.welcome\')">' + iconSVG('check', 15) + '<span>' + (c.btnTextZh || '') + '</span></button>';
      host.appendChild(div);
    });
  }

  function renderDlCards(dlCards) {
    if (!dlCards || !dlCards.length) return;
    var panel = el('.dl-panel .dl-container'); if (!panel) return;
    var header = panel.querySelector('.dl-header'); var support = panel.querySelector('.dl-support');
    var proj = panel.querySelector('.dl-section-title');
    if (proj) proj.lastElementChild.textContent = String(dlCards.filter(function (d) { return d.show !== false; }).length).padStart(2, '0') + ' 个项目';
    all('.dl-panel .dl-card').forEach(function (n) { n.parentNode.removeChild(n); });
    var frag = document.createDocumentFragment();
    var sorted = dlCards.slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    sorted.filter(function (d) { return d.show !== false; }).forEach(function (d) {
      var iconHtml = d.iconUrl
        ? '<img src="' + escAttr(d.iconUrl) + '" style="width:32px;height:32px;object-fit:contain" onerror="this.outerHTML=\'' + iconSVG(d.icon || 'package', 32).replace(/'/g, "\\'") + '\'">'
        : (d.iconImg
          ? '<img src="' + d.iconImg + '" style="width:32px;height:32px;object-fit:contain" onerror="this.outerHTML=\'' + iconSVG(d.icon || 'package', 32).replace(/'/g, "\\'") + '\'">'
          : iconSVG(d.icon || 'package', 32));
      var featHtml = (d.features || []).map(function (f) { return '<div class="dl-feature">' + (f.zh || '') + '</div>'; }).join('');
      var div = document.createElement('div'); div.className = 'dl-card';
      if (d.width && d.width > 1) div.style.gridColumn = 'span ' + Math.min(d.width, 2);
      div.innerHTML =
        '<div class="dl-card-header"><div class="dl-card-icon">' + iconHtml + '</div><div class="dl-card-info"><div class="dl-version">' + (d.versionZh || '') + '</div><h3>' + (d.titleZh || '') + '</h3><p>' + (d.descZh || '') + '</p></div></div>' +
        '<div class="dl-features">' + featHtml + '</div>' +
        '<div class="dl-card-desc">' + (d.detailZh || '') + '</div>' +
        '<button class="dl-btn" onclick="dlFile(\'' + (d.titleZh || '') + '\')">' + iconSVG('download', 18) + '<span>' + (d.btnTextZh || '立即下载') + '</span></button>';
      frag.appendChild(div);
    });
    if (support) panel.insertBefore(frag, support); else panel.appendChild(frag);
  }

  function renderButtons(buttons) {
    if (!buttons || !buttons.length) return;
    buttons.filter(function (b) { return b.show !== false; }).forEach(function (b) {
      var sel = b.id === 'bHero' ? '.hero .btn-primary span' : (b.id === 'bCta' ? '.cta-banner .btn-primary span' : (b.id === 'bTg' ? '.cta-banner .btn-ghost' : null));
      if (!sel) return;
      var node = el(sel); if (node) node.textContent = b.textZh || b.textEn || '';
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
      if (val) node.textContent = val;
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
    var orig = window.setLanguage; window.setLanguage = function (lang) { document.documentElement.lang = (lang === 'en' ? 'en' : 'zh-CN'); applyI18nToDom(); };
  }).catch(function (err) {
    console.warn('[loader] data.json 加载失败，使用内联字典降级', err);
  });
})();
