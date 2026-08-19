/* loader.js —— 最小化同步加载器
 * 作用：fetch('data.json')，把后台改过的 zh/en 合并进原文件内联的 i18n 对象，
 *       然后调用原 setLanguage(currentLang) 重渲染所有 [data-i18n] 节点。
 * 不修改 DOM 结构、不重写事件绑定、不动下载面板逻辑，因此不影响"下载中心"打开/关闭。
 */
(function () {
  var DATA_URL = 'data.json';
  function apply(data) {
    if (!data || (!data.zh && !data.en)) return false;
    var i18n = window.i18n;
    if (!i18n) return false;
    if (data.zh && typeof data.zh === 'object') {
      i18n.zh = i18n.zh || {};
      Object.keys(data.zh).forEach(function (k) { i18n.zh[k] = data.zh[k]; });
    }
    if (data.en && typeof data.en === 'object') {
      i18n.en = i18n.en || {};
      Object.keys(data.en).forEach(function (k) { i18n.en[k] = data.en[k]; });
    }
    if (typeof window.setLanguage === 'function') {
      window.setLanguage(window.currentLang || 'zh');
    }
    return true;
  }
  function load() {
    var req = new XMLHttpRequest();
    req.open('GET', DATA_URL, true);
    req.onreadystatechange = function () {
      if (req.readyState !== 4) return;
      if (req.status === 200) {
        try {
          var data = JSON.parse(req.responseText);
          apply(data);
        } catch (e) { /* 解析失败则沿用原内联字典，不影响前台 */ }
      }
    };
    req.send();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
