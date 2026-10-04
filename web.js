// LocalStorage থেকে অ্যাডমিন প্যানেলে সেট করা WhatsApp নাম্বার ও প্রোডাক্ট ডাটা রিড করা হচ্ছে
const SELLER_WHATSAPP_NUMBER = localStorage.getItem("omni_whatsapp") || "8801700000000"; 

// ডিফল্ট প্রোডাক্ট লিস্ট
const defaultProducts = [
  { id: 1, category: "electronics", name: "Wireless Earbuds", description: "Noise-canceling Bluetooth earbuds with 24h battery life.", price: 1200, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80" },
  { id: 2, category: "electronics", name: "Smart Watch", description: "Fitness tracker with heart rate monitor & AMOLED display.", price: 2500, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" },
  { id: 3, category: "fashion", name: "Premium Leather Wallet", description: "Genuine leather bifold wallet with RFID blocking.", price: 850, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80" },
  { id: 4, category: "fashion", name: "Casual Sneakers", description: "Lightweight, breathable everyday walking shoes.", price: 1800, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" },
  { id: 5, category: "lifestyle", name: "Stainless Steel Bottle", description: "Insulated 750ml flask that keeps drinks cold for 18h.", price: 650, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80" },
  { id: 6, category: "lifestyle", name: "Desk Organizer Lamp", description: "LED desk lamp with integrated wireless charger stand.", price: 1400, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80" }
];

// অ্যাডমিন প্যানেলে পরিবর্তন করা ডাটা থাকলে সেটি লোড হবে, না থাকলে ডিফল্ট লিস্ট লোড হবে
const products = JSON.parse(localStorage.getItem("omni_products")) || defaultProducts;

let cart = JSON.parse(localStorage.getItem("omni_cart")) || [];
let activeCategory = "all";
let searchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
  renderGrid();
  updateCartUI();
  setupEvents();
});

// প্রোডাক্ট গ্রিড রেন্ডার ফাংশন
function renderGrid() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  const filtered = products.filter(p => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">No products match your criteria.</p>`;
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" class="card-img" loading="lazy">
      <h3>${p.name}</h3>
      <p class="desc">${p.description}</p>
      <div class="card-footer">
        <span class="price">৳${p.price}</span>
        <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ক্যাটাগরি ফিল্টার
window.filterCategory = function(cat, btn) {
  activeCategory = cat;
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  renderGrid();
};

// কার্ডে আইটেম যোগ করা
window.addToCart = function(id) {
  const idx = cart.findIndex(i => i.id === id);
  if (idx > -1) {
    cart[idx].quantity += 1;
  } else {
    const item = products.find(p => p.id === id);
    if (item) cart.push({ ...item, quantity: 1 });
  }
  saveAndSyncCart();
  openCart();
};

// আইটেমের পরিমাণ বাড়ানো/কমানো
window.changeQuantity = function(idx, delta) {
  cart[idx].quantity += delta;
  if (cart[idx].quantity <= 0) cart.splice(idx, 1);
  saveAndSyncCart();
};

// কার্ট থেকে আইটেম রিমুভ করা
window.removeFromCart = function(idx) {
  cart.splice(idx, 1);
  saveAndSyncCart();
};

function saveAndSyncCart() {
  localStorage.setItem("omni_cart", JSON.stringify(cart));
  updateCartUI();
}

// কার্ট UI আপডেট করা
function updateCartUI() {
  const badge = document.getElementById("cartBadge");
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (badge) badge.innerText = totalCount;

  if (!container || !totalEl) return;

  if (cart.length === 0) {
    container.innerHTML = `<p class="empty-msg">Your cart is currently empty.</p>`;
    totalEl.innerText = "৳0";
    return;
  }

  container.innerHTML = "";
  let totalAmount = 0;

  cart.forEach((item, idx) => {
    const subtotal = item.price * item.quantity;
    totalAmount += subtotal;

    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>৳${item.price} x ${item.quantity}</p>
      </div>
      <div style="display:flex; align-items:center; gap:6px;">
        <button onclick="changeQuantity(${idx}, -1)" style="width:24px; height:24px; cursor:pointer;">-</button>
        <span>${item.quantity}</span>
        <button onclick="changeQuantity(${idx}, 1)" style="width:24px; height:24px; cursor:pointer;">+</button>
      </div>
    `;
    container.appendChild(el);
  });

  totalEl.innerText = `৳${totalAmount}`;
}

// ইভেন্ট লিসেনার
function setupEvents() {
  document.getElementById("cartToggleBtn").addEventListener("click", openCart);
  document.getElementById("cartCloseBtn").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);

  document.getElementById("searchInput").addEventListener("input", (e) => {
    searchQuery = e.target.value.trim();
    renderGrid();
  });
}

function openCart() {
  document.getElementById("cartOverlay").classList.add("open");
  document.getElementById("cartDrawer").classList.add("open");
}

function closeCart() {
  document.getElementById("cartOverlay").classList.remove("open");
  document.getElementById("cartDrawer").classList.remove("open");
}

window.openCheckoutModal = function() {
  if (cart.length === 0) return alert("Your cart is empty!");
  closeCart();
  document.getElementById("checkoutModal").classList.add("open");
};

window.closeCheckoutModal = function() {
  document.getElementById("checkoutModal").classList.remove("open");
};

// WhatsApp Order Submit Handler
window.handleOrderSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById("custName").value;
  const phone = document.getElementById("custPhone").value;
  const address = document.getElementById("custAddress").value;

  let orderText = `*NEW ORDER RECEIVED*\n\n`;
  orderText += `*Customer:* ${name}\n`;
  orderText += `*Phone:* ${phone}\n`;
  orderText += `*Address:* ${address}\n\n`;
  orderText += `*Ordered Items:*\n`;

  let grandTotal = 0;
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    grandTotal += itemTotal;
    orderText += `- ${item.name} (x${item.quantity}) = ৳${itemTotal}\n`;
  });

  orderText += `\n*Grand Total:* ৳${grandTotal}`;

  const whatsappUrl = `https://wa.me/${SELLER_WHATSAPP_NUMBER}?text=${encodeURIComponent(orderText)}`;
  window.open(whatsappUrl, "_blank");

  cart = [];
  saveAndSyncCart();
  closeCheckoutModal();
};