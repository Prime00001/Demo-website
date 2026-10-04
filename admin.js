// Default Products Array
const defaultProducts = [
  { id: 1, category: "electronics", name: "Wireless Earbuds", description: "Noise-canceling Bluetooth earbuds with 24h battery life.", price: 1200, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80" },
  { id: 2, category: "electronics", name: "Smart Watch", description: "Fitness tracker with heart rate monitor & AMOLED display.", price: 2500, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" },
  { id: 3, category: "fashion", name: "Premium Leather Wallet", description: "Genuine leather bifold wallet with RFID blocking.", price: 850, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80" },
  { id: 4, category: "fashion", name: "Casual Sneakers", description: "Lightweight, breathable everyday walking shoes.", price: 1800, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" },
  { id: 5, category: "lifestyle", name: "Stainless Steel Bottle", description: "Insulated 750ml flask that keeps drinks cold for 18h.", price: 650, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80" },
  { id: 6, category: "lifestyle", name: "Desk Organizer Lamp", description: "LED desk lamp with integrated wireless charger stand.", price: 1400, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80" }
];

let storeProducts = JSON.parse(localStorage.getItem("omni_products")) || defaultProducts;
let whatsappNumber = localStorage.getItem("omni_whatsapp") || "8801700000000";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("whatsappNum").value = whatsappNumber;
  renderTable();
});

// Save WhatsApp Settings
window.saveSettings = function(e) {
  e.preventDefault();
  const num = document.getElementById("whatsappNum").value.trim();
  localStorage.setItem("omni_whatsapp", num);
  alert("WhatsApp order number updated successfully!");
};

// Add New Product Handler
window.handleAddProduct = function(e) {
  e.preventDefault();

  const name = document.getElementById("prodName").value.trim();
  const category = document.getElementById("prodCategory").value;
  const price = parseFloat(document.getElementById("prodPrice").value);
  const image = document.getElementById("prodImage").value.trim();
  const description = document.getElementById("prodDesc").value.trim();

  const newProduct = {
    id: Date.now(),
    name,
    category,
    price,
    image,
    description
  };

  storeProducts.unshift(newProduct);
  saveProductsAndSync();

  document.getElementById("addProductForm").reset();
  alert("New product added to store!");
};

// Delete Product Handler
window.deleteProduct = function(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    storeProducts = storeProducts.filter(p => p.id !== id);
    saveProductsAndSync();
  }
};

function saveProductsAndSync() {
  localStorage.setItem("omni_products", JSON.stringify(storeProducts));
  renderTable();
}

// Render Table Rows
function renderTable() {
  const tbody = document.getElementById("adminProductTable");
  const countSpan = document.getElementById("totalProdCount");

  if (!tbody) return;

  countSpan.innerText = storeProducts.length;
  tbody.innerHTML = "";

  if (storeProducts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-muted);">No products available in inventory.</td></tr>`;
    return;
  }

  storeProducts.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><img src="${p.image}" alt="${p.name}" class="table-img"></td>
      <td><b>${p.name}</b></td>
      <td style="text-transform: capitalize;">${p.category}</td>
      <td>৳${p.price}</td>
      <td><button class="delete-btn" onclick="deleteProduct(${p.id})">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });
}