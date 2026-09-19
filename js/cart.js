/* ============================================================
   NISRAA CART — Shared across all pages
   Uses localStorage key: "nisraa_cart"
   ============================================================ */

const CART_KEY = 'nisraa_cart';

/* Products that qualify for the FREE 50ml Tonic gift */
const FREE_TONIC_KEY  = 'free-tonic-50ml';
const FREE_TONIC_QUALIFYING = new Set([
  'full-treatment-set', 'trial-set', 'tonic-shampoo-set', 'tonic-150ml', 'shampoo', 'conditioner'
]);

const PRODUCTS = {
  'full-treatment-set': { name: 'NISRAA Full Treatment Set', price: 109.90, original: 269.00, img: 'images/products/full-treatment-set.jpg' },
  'trial-set':          { name: 'NISRAA Trial Set',          price: 57.90,  original: 129.00, img: 'images/products/trial-set.jpg' },
  'tonic-70ml':         { name: 'NISRAA Strengthening Tonic 70ml', price: 45.90,  original: 89.90,  img: 'images/products/tonic-70ml.jpg' },
  'tonic-150ml':        { name: 'NISRAA Strengthening Tonic 150ml', price: 69.90,  original: 129.90, img: 'images/products/tonic-150ml.jpg' },
  'shampoo':            { name: 'NISRAA Treatment Shampoo 250ml', price: 58.90,  original: 99.00,  img: 'images/products/shampoo-250ml.jpg' },
  'conditioner':        { name: 'NISRAA Treatment Conditioner 250ml', price: 58.90, original: 99.00, img: 'images/products/conditioner-250ml.jpg' },
  'tonic-shampoo-set':  { name: 'NISRAA Set Tonic 150ml + Shampoo 250ml', price: 117.90, original: 269.00, img: 'https://www.genspark.ai/api/files/s/3rR0twnc' },
  /* Free gift — zero price, not removable by user */
  [FREE_TONIC_KEY]:      { name: 'FREE Strengthening Tonic 50ml 🎁', price: 0, original: 35.00, img: 'images/products/tonic-70ml.jpg', isFreeGift: true }
};

/* ── Read / Write ─────────────────────────────────────── */
function cartGet() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function cartSave(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  cartRefreshUI();
}

/* ── Add ──────────────────────────────────────────────── */
function cartAdd(productKey, qty) {
  qty = qty || 1;
  const prod = PRODUCTS[productKey];
  if (!prod) return;
  let items = cartGet();
  const existing = items.find(i => i.key === productKey);
  if (existing) {
    existing.qty += qty;
  } else {
    items.push({ key: productKey, qty: qty });
  }
  /* Auto-add free 50ml tonic if qualifying product and not already in cart */
  if (FREE_TONIC_QUALIFYING.has(productKey)) {
    const hasFree = items.find(i => i.key === FREE_TONIC_KEY);
    if (!hasFree) items.push({ key: FREE_TONIC_KEY, qty: 1, isFreeGift: true });
  }
  cartSave(items);
  cartShowToast(prod.name);
  cartDrawerOpen();
}

/* ── Remove ───────────────────────────────────────────── */
function cartRemove(productKey) {
  if (PRODUCTS[productKey] && PRODUCTS[productKey].isFreeGift) return; // cannot remove free gift
  let items = cartGet().filter(i => i.key !== productKey);
  /* Remove free tonic if no qualifying products remain */
  const hasQualifying = items.some(i => FREE_TONIC_QUALIFYING.has(i.key));
  if (!hasQualifying) items = items.filter(i => i.key !== FREE_TONIC_KEY);
  cartSave(items);
}

/* ── Change qty ───────────────────────────────────────── */
function cartSetQty(productKey, qty) {
  qty = parseInt(qty);
  if (qty < 1) { cartRemove(productKey); return; }
  let items = cartGet();
  const item = items.find(i => i.key === productKey);
  if (item) item.qty = qty;
  cartSave(items);
}

/* ── Count ────────────────────────────────────────────── */
function cartCount() {
  return cartGet().reduce((s, i) => s + i.qty, 0);
}

/* ── Totals ───────────────────────────────────────────── */
function cartTotals() {
  const items = cartGet();
  let sub = 0, saved = 0;
  items.forEach(i => {
    const p = PRODUCTS[i.key];
    if (!p) return;
    sub   += p.price    * i.qty;
    saved += (p.original - p.price) * i.qty;
  });
  return { subtotal: sub, saved: saved, shipping: 7, total: sub + 7 };
}

/* ── Toast notification ───────────────────────────────── */
function cartShowToast(name) {
  let t = document.getElementById('cart-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'cart-toast';
    t.innerHTML = `<i class="fas fa-check-circle"></i> <span id="cart-toast-msg"></span>`;
    Object.assign(t.style, {
      position:'fixed', bottom:'84px', left:'50%', transform:'translateX(-50%) translateY(20px)',
      background:'#fff', border:'1px solid var(--border)', borderRadius:'12px',
      padding:'12px 18px', boxShadow:'0 8px 32px rgba(0,0,0,0.14)',
      display:'flex', alignItems:'center', gap:'8px',
      fontSize:'14px', fontWeight:'600', color:'var(--text-main)',
      zIndex:'9999', opacity:'0', transition:'opacity 0.25s, transform 0.25s',
      whiteSpace:'nowrap'
    });
    document.body.appendChild(t);
  }
  document.getElementById('cart-toast-msg').textContent = `"${name}" added to cart`;
  t.style.opacity = '1';
  t.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(20px)';
  }, 3500);
}

/* ── Cart Drawer ──────────────────────────────────────── */
function cartDrawerOpen() {
  cartDrawerBuild();
  const d = document.getElementById('cart-drawer');
  const ov = document.getElementById('cart-drawer-overlay');
  if (d) { d.classList.add('open'); }
  if (ov) { ov.classList.add('open'); }
  document.body.style.overflow = 'hidden';
}
function cartDrawerClose() {
  const d = document.getElementById('cart-drawer');
  const ov = document.getElementById('cart-drawer-overlay');
  if (d) d.classList.remove('open');
  if (ov) ov.classList.remove('open');
  document.body.style.overflow = '';
}

function cartDrawerBuild() {
  /* Create once */
  if (!document.getElementById('cart-drawer')) {
    /* Overlay */
    const ov = document.createElement('div');
    ov.id = 'cart-drawer-overlay';
    ov.onclick = cartDrawerClose;
    Object.assign(ov.style, {
      position:'fixed', inset:'0', background:'rgba(0,0,0,0.45)',
      zIndex:'8000', opacity:'0', pointerEvents:'none',
      transition:'opacity 0.3s'
    });
    ov.addEventListener('transitionend', () => {
      if (!ov.classList.contains('open')) ov.style.pointerEvents = 'none';
    });

    /* Drawer */
    const dr = document.createElement('div');
    dr.id = 'cart-drawer';
    Object.assign(dr.style, {
      position:'fixed', top:'0', right:'0', height:'100%',
      width:'min(420px, 100vw)', background:'#fff',
      zIndex:'8001', boxShadow:'-8px 0 40px rgba(0,0,0,0.15)',
      display:'flex', flexDirection:'column',
      transform:'translateX(100%)', transition:'transform 0.32s cubic-bezier(0.4,0,0.2,1)'
    });
    dr.innerHTML = `
      <div id="cart-drawer-head" style="display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid #ede4d3;flex-shrink:0;">
        <div style="display:flex;align-items:center;gap:10px;">
          <i class="fas fa-shopping-bag" style="color:var(--primary);font-size:18px;"></i>
          <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;color:var(--primary);margin:0;">Your Cart</h3>
          <span id="drawer-count" style="background:var(--primary);color:#fff;font-size:11px;font-weight:700;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;">0</span>
        </div>
        <button onclick="cartDrawerClose()" style="background:none;border:none;font-size:22px;color:#a07850;cursor:pointer;line-height:1;padding:4px;">&times;</button>
      </div>
      <div id="cart-drawer-items" style="flex:1;overflow-y:auto;padding:16px 24px;"></div>
      <div id="cart-drawer-footer" style="padding:20px 24px;border-top:1px solid #ede4d3;flex-shrink:0;background:#fdfaf5;"></div>`;

    document.body.appendChild(ov);
    document.body.appendChild(dr);

    /* Inject CSS for open states */
    const st = document.createElement('style');
    st.textContent = `
      #cart-drawer-overlay.open { opacity:1 !important; pointer-events:auto !important; }
      #cart-drawer.open { transform:translateX(0) !important; }
      .drawer-item { display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid #f1e9db; }
      .drawer-item:last-child { border-bottom:none; }
      .drawer-item-img { width:64px;height:64px;border-radius:10px;background:#f5ede3;overflow:hidden;flex-shrink:0;padding:4px;box-sizing:border-box;border:1px solid rgba(196,154,108,0.2); }
      .drawer-item-img img { width:100%;height:100%;object-fit:contain;display:block; }
      .drawer-item-info { flex:1;min-width:0; }
      .drawer-item-name { font-size:13.5px;font-weight:600;color:#2c1a0e;margin-bottom:3px;line-height:1.3; }
      .drawer-item-price { font-size:13px;color:#6c4323;font-weight:700; }
      .drawer-qty { display:flex;align-items:center;gap:0;border:1px solid #ddd0bb;border-radius:8px;overflow:hidden;flex-shrink:0; }
      .drawer-qty button { background:#f5ede3;border:none;width:28px;height:28px;cursor:pointer;font-size:15px;color:#6b4c34;transition:background 0.15s; }
      .drawer-qty button:hover { background:#ede4d3; }
      .drawer-qty span { width:32px;text-align:center;font-size:13px;font-weight:600;color:#2c1a0e; }
      .drawer-remove { background:none;border:none;color:#c0a080;cursor:pointer;font-size:15px;padding:4px;transition:color 0.15s;flex-shrink:0; }
      .drawer-remove:hover { color:#c84b00; }
      .drawer-empty { text-align:center;padding:48px 24px;color:#a07850; }
      .drawer-empty i { font-size:40px;display:block;margin-bottom:14px;opacity:0.3; }
      .drawer-empty p { font-size:14px;margin-bottom:4px; }
      .drawer-empty small { font-size:12px;opacity:0.6; }
    `;
    document.head.appendChild(st);
  }
  cartDrawerRefresh();
}

function cartDrawerRefresh() {
  const items = cartGet();
  const itemsEl = document.getElementById('cart-drawer-items');
  const footerEl = document.getElementById('cart-drawer-footer');
  const countEl = document.getElementById('drawer-count');
  if (!itemsEl) return;

  const total = cartCount();
  if (countEl) countEl.textContent = total;

  if (items.length === 0) {
    itemsEl.innerHTML = `
      <div class="drawer-empty">
        <i class="fas fa-shopping-bag"></i>
        <p>Your cart is empty</p>
        <small>Add products from the catalogue below</small>
      </div>`;
    if (footerEl) footerEl.innerHTML = `
      <a href="shop.html" onclick="cartDrawerClose()" style="display:block;text-align:center;padding:14px;background:#f5ede3;border-radius:12px;font-size:14px;font-weight:600;color:var(--primary);text-decoration:none;">
        <i class="fas fa-arrow-left"></i> Continue Shopping
      </a>`;
    return;
  }

  /* Free tonic line — shown inline under each qualifying product */
  const FREE_TONIC_LINE = `
    <div style="display:flex;align-items:center;gap:10px;margin:-6px 0 10px 0;padding:7px 12px;background:#f0fdf4;border-radius:8px;border:1.5px dashed #4ade80;">
      <i class="fas fa-gift" style="color:#16a34a;font-size:15px;flex-shrink:0;"></i>
      <div style="flex:1;min-width:0;">
        <span style="font-size:12.5px;font-weight:700;color:#15803d;">Free Tonic 50ml</span>
        <span style="font-size:11px;color:#16a34a;font-weight:600;margin-left:4px;">(Worth RM35)</span>
        <div style="font-size:10px;color:#4ade80;font-weight:600;margin-top:1px;letter-spacing:0.03em;"><i class="fas fa-lock" style="font-size:9px;"></i> Website exclusive gift</div>
      </div>
      <span style="font-size:12px;font-weight:800;color:#16a34a;background:#dcfce7;padding:3px 8px;border-radius:20px;white-space:nowrap;">FREE</span>
    </div>`;

  /* Items list — skip the old grouped free-gift item, inject inline instead */
  itemsEl.innerHTML = items
    .filter(item => !(PRODUCTS[item.key] && PRODUCTS[item.key].isFreeGift))
    .map(item => {
      const p = PRODUCTS[item.key];
      if (!p) return '';
      const showFree = FREE_TONIC_QUALIFYING.has(item.key);
      return `
        <div class="drawer-item">
          <div class="drawer-item-img">
            <img src="${p.img}" alt="${p.name}" />
          </div>
          <div class="drawer-item-info">
            <div class="drawer-item-name">${p.name}</div>
            <div class="drawer-item-price">RM ${(p.price * item.qty).toFixed(2)}</div>
          </div>
          <div class="drawer-qty">
            <button onclick="cartSetQty('${item.key}', ${item.qty - 1}); cartDrawerRefresh();">−</button>
            <span>${item.qty}</span>
            <button onclick="cartSetQty('${item.key}', ${item.qty + 1}); cartDrawerRefresh();">+</button>
          </div>
          <button class="drawer-remove" onclick="cartRemove('${item.key}'); cartDrawerRefresh();" title="Remove">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
        ${showFree ? FREE_TONIC_LINE : ''}`;
    }).join('');

  /* Footer */
  const t = cartTotals();
  footerEl.innerHTML = `
    <div style="margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;font-size:13px;color:#6b4c34;margin-bottom:6px;">
        <span>Subtotal</span><span>RM ${t.subtotal.toFixed(2)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:13px;color:#6b4c34;margin-bottom:6px;">
        <span>Shipping (est.)</span><span>from RM ${t.shipping.toFixed(2)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:13px;color:#2e7d32;font-weight:600;margin-bottom:8px;">
        <span><i class="fas fa-tag"></i> You save</span><span>RM ${t.saved.toFixed(2)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:700;color:#2c1a0e;border-top:1px solid #ede4d3;padding-top:10px;">
        <span>Estimated Total</span><span>RM ${t.total.toFixed(2)}+</span>
      </div>
    </div>
    <a href="cart.html" style="display:flex;align-items:center;justify-content:center;gap:9px;width:100%;background:var(--primary);color:#fff;border-radius:12px;padding:15px 24px;font-size:15px;font-weight:700;text-decoration:none;text-align:center;box-sizing:border-box;transition:background 0.2s;"
       onmouseover="this.style.background='#4a2d14'" onmouseout="this.style.background='var(--primary)'">
      <i class="fas fa-lock"></i> Proceed to Checkout
    </a>
    <a href="https://wa.me/60147592082?text=${encodeURIComponent(cartWhatsAppMsg())}" target="_blank" rel="noopener"
       style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;background:#25d366;color:#fff;border-radius:12px;padding:12px 24px;font-size:14px;font-weight:600;text-decoration:none;text-align:center;box-sizing:border-box;margin-top:10px;transition:background 0.2s;"
       onmouseover="this.style.background='#1ebe5d'" onmouseout="this.style.background='#25d366'">
      <i class="fab fa-whatsapp" style="font-size:18px;"></i> Order via WhatsApp
    </a>
    <p style="font-size:11.5px;color:#a07850;text-align:center;margin-top:12px;">
      <i class="fas fa-shield-alt" style="color:var(--primary);"></i> Loyalty rewards tracked with every purchase
    </p>`;
}

/* ── WhatsApp message builder ─────────────────────────── */
function cartWhatsAppMsg() {
  const items = cartGet();
  if (!items.length) return 'Hi NISRAA! I would like to ask about your products.';
  let msg = 'Hi NISRAA! 👋 I would like to place an order:\n\n';
  items.forEach(i => {
    const p = PRODUCTS[i.key];
    if (!p) return;
    if (p.isFreeGift) {
      msg += `• ${p.name} — FREE (website exclusive gift)\n`;
    } else {
      msg += `• ${i.qty}× ${p.name} — RM ${(p.price * i.qty).toFixed(2)}\n`;
    }
  });
  const t = cartTotals();
  msg += `\nSubtotal: RM ${t.subtotal.toFixed(2)} + shipping\n\nPlease confirm availability and payment details. Thank you! 🙏`;
  return msg;
}

/* ── Update all header badge counters on the page ─────── */
function cartRefreshUI() {
  const n = cartCount();
  /* Header cart icon badges */
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    el.textContent = n > 0 ? n : '';
    el.style.display = n > 0 ? 'flex' : 'none';
  });
  /* Drawer count */
  const dc = document.getElementById('drawer-count');
  if (dc) dc.textContent = n;
  /* Re-render drawer items if open */
  if (document.getElementById('cart-drawer')?.classList.contains('open')) {
    cartDrawerRefresh();
  }
}

/* ── Inject cart icon badge into header on DOM ready ──── */
document.addEventListener('DOMContentLoaded', () => {
  /* Find the header cart icon link and inject a badge span */
  const cartLinks = document.querySelectorAll('a[href="cart.html"]');
  cartLinks.forEach(link => {
    if (link.querySelector('i.fa-shopping-bag') && !link.querySelector('[data-cart-count]')) {
      link.style.position = 'relative';
      const badge = document.createElement('span');
      badge.setAttribute('data-cart-count', '');
      Object.assign(badge.style, {
        position:'absolute', top:'-6px', right:'-8px',
        background:'var(--primary)', color:'#fff',
        fontSize:'10px', fontWeight:'700',
        width:'18px', height:'18px',
        borderRadius:'50%',
        display:'none', alignItems:'center', justifyContent:'center',
        lineHeight:'1', pointerEvents:'none'
      });
      link.appendChild(badge);
    }
  });

  /* Pre-select from URL param (legacy support — keeps item in cart) */
  /* We still support ?product= links from external sources, but we no longer
     auto-redirect to cart.html; instead cartAdd() keeps the user on the page. */

  cartRefreshUI();
});
