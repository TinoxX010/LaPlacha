// === Config ===
const WHATSAPP_NUMBER = "5492216168280";

// === Year ===
document.getElementById("year").textContent = new Date().getFullYear();

// === Marquee strip ===
const stripTrack = document.getElementById("stripTrack");
const stripHTML = Array.from({length: 8}).map(() =>
  `<span>SMASH BURGERS <span class="star">★</span> hamburguesas <span class="star">★</span> TRAGOS DE AUTOR <span class="star">★</span></span>`
).join(" ");
stripTrack.innerHTML = stripHTML + stripHTML;

// === Menu data ===
const MENU = {
  "Hamburguesas": [
    { name: "La Planchetta Clásica", desc: "Doble medallón, cheddar, lechuga, tomate y salsa de la casa.", price: "$8.900", img: "assets/fotolaploanchetta.jpg" },
    { name: "Bacon Brutal", desc: "Triple bacon, cheddar fundido.", price: "$10.500", img: "assets/fotolaploanchetta.jpg" },
    { name: "Smash Doble", desc: "Dos smash patis, queso, y mostaza.", price: "$9.400", img: "assets/fotolaploanchetta.jpg" },
    { name: "La Picante", desc: "Jalapeños, queso provolone, salsa y cebolla morada.", price: "$9.800", img: "assets/fotolaploanchetta.jpg" },
  ],
  "tragos": [
    { name: "Flowerss", desc: "vodka rasberry, vodka piña, almibar frutos rojos y sprite.", price: "$10.000", img: "assets/fotolaploanchetta.jpg" },
    { name: "gin-paff", desc: "gin, flyn paffs y sprite", price: "$8.000", img: "assets/fotolaploanchetta.jpg" },
    { name: "Fernet con Coca", desc: "El clásico, bien cargado.", price: "$7.000", img: "assets/fotolaploanchetta.jpg" },
  ],
  "Postres": [
    { name: "Tiramisu", desc: "Postre italiano con crema de mascarpone y cafe", price: "$7.500", img: "assets/fotolaplachetta.jpg" },
    { name: "Chocotorta", desc: "postre argentino que no falla jamas", price: "$7.500", img: "assets/fotolaploanchetta.jpg" },
    { name: "Bombom Escoces", desc: "Postre escoces helado, cobertura de chocolate con mani", price: "$4.000", img: "assets/fotolaploanchetta.jpg" },
  ],
  "papas": [
    { name: "Papas onduladas con cheddar y bacon", desc: "Papas fritas con forma ondulada, bañadas en cheddar y bacon.", price: "$4.500", img: "assets/fotolaploanchetta.jpg" },
    { name: "Salchipapa con cheddar", desc: "Papas cubierta con queso cheddar fundido y trozos de salchicha.", price: "$5.000", img: "assets/fotolaploanchetta.jpg" },
    { name: "Papas Especiales", desc: "Papas especiales con especias de la casa.", price: "$5.000", img: "assets/fotolaploanchetta.jpg" },
  ],
  "Bebidas" : [
    { name: "Coca-Cola", desc: "La clásica bebida gaseosa.", price: "$2.000", img: "assets/coca.jpg" },
    { name: "Sprite", desc: "refresco de sabor a lima-limón", price: "$1.500", img: "assets/sprite.jpg" },
    { name: "Manaos", desc: "cola, lima y pomelo.", price: "$3.500", img: "assets/MANAOS.jpg" },
  ],
  "Pizzas ": [
    { name: "Muzzarella", desc: "Pizza clásica con muzzarella y salsa de tomate.", price: "$6.000", img: "assets/fotolaploanchetta.jpg" },
    { name: "Napolitana", desc: "Pizza con muzzarella, tomate, ajo y albahaca.", price: "$7.000", img: "assets/fotolaploanchetta.jpg" },
  ],
};

const tabsEl = document.getElementById("tabs");
const gridEl = document.getElementById("menuGrid");
let currentTab = Object.keys(MENU)[0];

function renderTabs() {
  tabsEl.innerHTML = "";
  Object.keys(MENU).forEach((t) => {
    const b = document.createElement("button");
    b.className = "tab" + (t === currentTab ? " active" : "");
    b.textContent = t;
    b.onclick = () => { currentTab = t; renderTabs(); renderGrid(); };
    tabsEl.appendChild(b);
  });
}

function renderGrid() {
  gridEl.innerHTML = "";
  MENU[currentTab].forEach((item) => {
    const card = document.createElement("article");
    card.className = "menu-card";
    card.innerHTML = `
      <div class="img"><img src="${item.img}" alt="${item.name}" loading="lazy" /></div>
      <div class="body">
        <div class="row">
          <h3>${item.name}</h3>
          <span class="price">${item.price}</span>
        </div>
        <p class="desc">${item.desc}</p>
        <button class="add-btn">+ Agregar</button>
      </div>`;
    card.querySelector(".add-btn").onclick = () => {
      addToCart(item.name, parsePrice(item.price));
      openCart();
    };
    gridEl.appendChild(card);
  });
}

renderTabs();
renderGrid();

// === Cart ===
function parsePrice(str) {
  return parseInt(String(str).replace(/[^\d]/g, ""), 10) || 0;
}
function formatPrice(n) {
  return "$" + n.toLocaleString("es-AR");
}

let cart = [];
try { cart = JSON.parse(localStorage.getItem("cart") || "[]"); } catch {}

function saveCart() { localStorage.setItem("cart", JSON.stringify(cart)); }

function addToCart(name, price) {
  const ex = cart.find((i) => i.name === name);
  if (ex) ex.qty += 1;
  else cart.push({ name, price, qty: 1 });
  saveCart(); renderCart();
}
function decItem(name) {
  const ex = cart.find((i) => i.name === name);
  if (!ex) return;
  ex.qty -= 1;
  if (ex.qty <= 0) cart = cart.filter((i) => i.name !== name);
  saveCart(); renderCart();
}
function removeItem(name) {
  cart = cart.filter((i) => i.name !== name);
  saveCart(); renderCart();
}

const itemsEl = document.getElementById("cartItems");
const totalEl = document.getElementById("cartTotal");
const countEl = document.getElementById("cartCount");

function renderCart() {
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  if (totalQty > 0) { countEl.hidden = false; countEl.textContent = totalQty; }
  else countEl.hidden = true;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty">Tu carrito está vacío.<br>Agregá algo del menú 🍔</div>`;
  } else {
    itemsEl.innerHTML = "";
    cart.forEach((i) => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <div>
          <div class="name">${i.name}</div>
          <div class="ip">${formatPrice(i.price)} c/u</div>
        </div>
        <div class="qty">
          <button data-act="dec">−</button>
          <span>${i.qty}</span>
          <button data-act="inc">+</button>
        </div>`;
      row.querySelector('[data-act="dec"]').onclick = () => decItem(i.name);
      row.querySelector('[data-act="inc"]').onclick = () => addToCart(i.name, i.price);
      itemsEl.appendChild(row);
    });
  }
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  totalEl.textContent = formatPrice(total);
}
renderCart();

// === Drawer ===
const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("cartOverlay");
function openCart() { drawer.classList.add("open"); overlay.hidden = false; drawer.setAttribute("aria-hidden","false"); }
function closeCart() { drawer.classList.remove("open"); overlay.hidden = true; drawer.setAttribute("aria-hidden","true"); }
document.getElementById("cartBtn").onclick = openCart;
document.getElementById("cartClose").onclick = closeCart;
overlay.onclick = closeCart;

// === WhatsApp ===
const waText = "Hola! Me gustaría hacer un pedido en La Planchetta 🍔";
document.getElementById("waBtn").href =
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

document.getElementById("cartSend").onclick = () => {
  if (cart.length === 0) { alert("Tu carrito está vacío."); return; }
  const lines = cart.map((i) => `• ${i.qty}x ${i.name} — ${formatPrice(i.price * i.qty)}`).join("\n");
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const msg =
`Hola! Quiero hacer este pedido en La Planchetta 🍔

${lines}

Total: ${formatPrice(total)}

Te paso el comprobante de la transferencia por acá. Sin comprobante entiendo que no pueden entregar el pedido. ¡Gracias!`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
};
