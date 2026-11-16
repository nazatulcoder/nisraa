/* NISRAA — website-exclusive gift popup: shown ONCE per visitor across the whole site.
   Uses the same flag as the inline popup in belinisraa.html: nisraa_exclusive_popup_seen_v1 */
(function () {
  var KEY = 'nisraa_exclusive_popup_seen_v1';

  function hasSeen() {
    try { if (localStorage.getItem(KEY) === '1') return true; } catch (e) {}
    return document.cookie.indexOf(KEY + '=1') !== -1;
  }
  function markSeen() {
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    try { document.cookie = KEY + '=1; max-age=31536000; path=/; SameSite=Lax'; } catch (e) {}
  }

  if (hasSeen()) return;

  function build() {
    if (document.getElementById('entry-popup')) return;
    markSeen(); // counts as seen as soon as it is shown

    var css = document.createElement('style');
    css.textContent =
      '.nisraa-popup{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(26,18,12,.72);backdrop-filter:blur(6px);opacity:0;visibility:hidden;transition:opacity .35s ease,visibility .35s ease;font-family:system-ui,sans-serif}' +
      '.nisraa-popup.is-open{opacity:1;visibility:visible}' +
      '.nisraa-popup-box{position:relative;width:min(520px,100%);max-height:calc(100vh - 40px);overflow:auto;border-radius:24px;box-shadow:0 24px 60px rgba(0,0,0,.35);transform:translateY(16px) scale(.97);transition:transform .35s ease}' +
      '.nisraa-popup.is-open .nisraa-popup-box{transform:translateY(0) scale(1)}' +
      '.nisraa-popup .popup-close{position:absolute;top:10px;right:10px;z-index:2;width:36px;height:36px;border:none;border-radius:50%;background:rgba(26,58,46,.88);color:#fff;font-size:22px;line-height:1;cursor:pointer;display:grid;place-items:center}' +
      '.nisraa-popup .popup-close:hover{background:#1a3a2e}' +
      '.nisraa-popup-box img{width:100%;height:auto;display:block;border-radius:24px}' +
      '.nisraa-popup-box a{display:block;text-decoration:none}';
    document.head.appendChild(css);

    var onShop = /(^|\/)shop(\.html)?\/?$/.test(location.pathname);
    var imgHtml = '<img src="images/website-exclusive-gift.png" width="804" height="1024" decoding="async" alt="Website Exclusive Gift: Free Shipping and NISRAA Strengthening Tonic 50ml (worth RM35) for purchases above RM100">';

    var wrap = document.createElement('div');
    wrap.className = 'nisraa-popup';
    wrap.id = 'entry-popup';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.setAttribute('aria-label', 'Website exclusive offer');
    wrap.innerHTML =
      '<div class="nisraa-popup-box">' +
      '<button type="button" class="popup-close" aria-label="Close">&times;</button>' +
      (onShop ? '<a href="#" class="popup-link">' : '<a href="shop.html" class="popup-link">') + imgHtml + '</a>' +
      '</div>';
    document.body.appendChild(wrap);

    function close() {
      wrap.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(function () { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 400);
    }
    wrap.querySelector('.popup-close').addEventListener('click', close);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && wrap.classList.contains('is-open')) close(); });
    wrap.querySelector('.popup-link').addEventListener('click', function (e) {
      if (onShop) { e.preventDefault(); }
      close();
    });

    setTimeout(function () {
      wrap.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }, 300);
  }

  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
})();
