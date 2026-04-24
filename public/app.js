// ─── State ───
let cart = [];
let allProducts = [];
let activeCategory = 'All';
let activeSort = '';

// ─── Icon map ───
const ICONS = {
  headphones: '🎧',
  laptop:     '💻',
  phone:      '📱',
  tablet:     '🖥️',
  keyboard:   '⌨️',
  monitor:    '🖥️',
  mouse:      '🖱️',
  default:    '📦'
};

// ─── Fetch products from Express API ───
async function fetchProducts(category = 'All', sort = '') {
  try {
    let url = '/api/products?';
    if (category !== 'All') url += `category=${encodeURIComponent(category)}&`;
    if (sort) url += `sort=${sort}`;

    const res = await fetch(url);
    const data = await res.json();
    return data.products || [];
  } catch (err) {
    console.error('Failed to fetch products:', err);
    return [];
  }
}

// ─── Render products ───
function renderProducts(products) {
  const grid = document.getElementById('productGrid');
  const countEl = document.getElementById('productCount');

  countEl.textContent = `(${products.length})`;

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <p style="font-size:2rem;margin-bottom:.5rem">🔍</p>
        <p>No products found in this category.</p>
      </div>`;
    return;
  }

  grid.innerHTML = products.map((p, i) => {
    const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
    const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '½' : '');
    const icon = ICONS[p.image] || ICONS.default;
    const badgeClass = getBadgeClass(p.badge);
    const isInCart = cart.some(c => c.id === p.id);

    return `
      <div class="product-card" style="animation-delay:${i * 0.05}s">
        <div class="card-image">
          <span class="product-icon">${icon}</span>
          <span class="card-badge ${badgeClass}">${p.badge}</span>
        </div>
        <div class="card-body">
          <p class="card-category">${p.category}</p>
          <h3 class="card-name">${p.name}</h3>
          <p class="card-desc">${p.description}</p>
          <div class="card-rating">
            <span class="stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))}</span>
            <span class="rating-val">${p.rating}</span>
            <span class="rating-count">(${p.reviews.toLocaleString()})</span>
          </div>
          <div class="card-footer">
            <div class="price-block">
              <span class="price-current">₹${p.price.toLocaleString('en-IN')}</span>
              <span class="price-original">₹${p.originalPrice.toLocaleString('en-IN')}</span>
              <span class="price-discount">${discount}% off</span>
              ${p.stock <= 5 ? `<span class="stock-low">Only ${p.stock} left!</span>` : ''}
            </div>
            <button
              class="add-btn ${isInCart ? 'added' : ''}"
              onclick="handleAddToCart(event, ${p.id})"
              data-id="${p.id}"
            >
              ${isInCart ? 'Added ✓' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>`;
  }).join('');
}

function getBadgeClass(badge) {
  const map = {
    'Best Seller': 'badge-best-seller',
    'Hot Deal':    'badge-hot-deal',
    'New':         'badge-new',
    'Top Rated':   'badge-top-rated',
    'Limited':     'badge-limited',
    'Sale':        'badge-sale',
  };
  return map[badge] || 'badge-default';
}

// ─── Cart logic ───
function handleAddToCart(e, productId) {
  e.stopPropagation();
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(c => c.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  renderProducts(allProducts.filter(p =>
    activeCategory === 'All' || p.category === activeCategory
  ));
  showToast(`${product.name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
  renderProducts(allProducts.filter(p =>
    activeCategory === 'All' || p.category === activeCategory
  ));
}

function updateCartUI() {
  const countEl = document.getElementById('cartCount');
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');

  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  countEl.textContent = totalItems;

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.2" viewBox="0 0 24 24">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <p>Your cart is empty</p>
      </div>`;
    footerEl.style.display = 'none';
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span class="cart-item-icon">${ICONS[item.image] || ICONS.default}</span>
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name} ${item.qty > 1 ? `×${item.qty}` : ''}</p>
        <p class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</p>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">×</button>
    </div>
  `).join('');

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  totalEl.textContent = '₹' + total.toLocaleString('en-IN');
  footerEl.style.display = 'block';
}

// ─── Cart drawer toggle ───
function toggleCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  drawer.classList.toggle('open');
  overlay.classList.toggle('open');
}

// ─── Toast ───
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ─── Filters ───
document.getElementById('categoryFilters').addEventListener('click', async (e) => {
  if (!e.target.matches('.filter-btn')) return;

  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');

  activeCategory = e.target.dataset.cat;
  const products = await fetchProducts(activeCategory, activeSort);
  renderProducts(products);
});

document.getElementById('sortSelect').addEventListener('change', async (e) => {
  activeSort = e.target.value;
  const products = await fetchProducts(activeCategory, activeSort);
  allProducts = products;
  renderProducts(products);
});

// ─── Init ───
(async () => {
  allProducts = await fetchProducts();
  renderProducts(allProducts);
})();
