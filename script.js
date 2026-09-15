const cart = new Map();
const cartDrawer = document.querySelector("[data-cart-drawer]");
const overlay = document.querySelector("[data-overlay]");
const cartItems = document.querySelector("[data-cart-items]");
const cartEmpty = document.querySelector("[data-cart-empty]");
const cartFooter = document.querySelector("[data-cart-footer]");
const cartCount = document.querySelector(".cart-count");
const cartTotal = document.querySelector("[data-cart-total]");
const toast = document.querySelector("[data-toast]");
const productCards = [...document.querySelectorAll(".product-card")];

window.dataLayer = window.dataLayer || [];

function pushDataLayer(event, payload = {}) {
  window.dataLayer.push({ event, ...payload });
}

function formatPrice(value) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

function openCart() {
  overlay.hidden = false;
  document.body.classList.add("has-drawer");
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  cartDrawer.querySelector("[data-close-cart]").focus();
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("has-drawer");
  window.setTimeout(() => { overlay.hidden = true; }, 350);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function renderCart() {
  const items = [...cart.values()];
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = quantity;
  cartTotal.textContent = formatPrice(total);
  cartEmpty.hidden = items.length > 0;
  cartFooter.hidden = items.length === 0;
  cartItems.innerHTML = items.map((item) => `
    <article class="cart-item">
      <div class="cart-thumb" aria-hidden="true">${item.name.slice(0, 1)}</div>
      <div><h3>${item.name}</h3><p>${formatPrice(item.price)} × ${item.quantity}</p></div>
      <button class="remove-item" type="button" data-remove-item="${item.id}">削除</button>
    </article>
  `).join("");
}

document.querySelectorAll("[data-open-cart]").forEach((button) => button.addEventListener("click", openCart));
document.querySelectorAll("[data-close-cart]").forEach((button) => button.addEventListener("click", closeCart));
overlay.addEventListener("click", closeCart);

document.querySelectorAll(".add-button").forEach((button) => {
  button.addEventListener("click", () => {
    const product = {
      id: button.dataset.productId,
      name: button.dataset.productName,
      price: Number(button.dataset.price),
      quantity: 1,
    };
    const existing = cart.get(product.id);
    if (existing) existing.quantity += 1;
    else cart.set(product.id, product);
    renderCart();
    showToast(`${product.name}を追加しました`);
    pushDataLayer("add_to_cart", {
      ecommerce: {
        currency: "JPY",
        value: product.price,
        items: [{ item_id: product.id, item_name: product.name, price: product.price, quantity: 1 }],
      },
    });
  });
});

document.querySelectorAll('.product-card a[href^="product.html"]').forEach((link) => {
  link.addEventListener("click", () => {
    const card = link.closest(".product-card");
    const button = card.querySelector(".add-button");
    pushDataLayer("select_item", {
      ecommerce: {
        item_list_name: "New Arrivals",
        items: [{ item_id: button.dataset.productId, item_name: button.dataset.productName, price: Number(button.dataset.price) }],
      },
    });
  });
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-item]");
  if (!button) return;
  const removed = cart.get(button.dataset.removeItem);
  cart.delete(button.dataset.removeItem);
  renderCart();
  if (removed) {
    pushDataLayer("remove_from_cart", {
      ecommerce: {
        currency: "JPY",
        value: removed.price * removed.quantity,
        items: [{ item_id: removed.id, item_name: removed.name, price: removed.price, quantity: removed.quantity }],
      },
    });
  }
});

document.querySelector("[data-checkout]").addEventListener("click", () => {
  const items = [...cart.values()];
  const value = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  pushDataLayer("begin_checkout", {
    ecommerce: {
      currency: "JPY",
      value,
      items: items.map(({ id, name, price, quantity }) => ({ item_id: id, item_name: name, price, quantity })),
    },
  });
  showToast("デモサイトのため購入処理は行いません");
});

document.querySelectorAll(".filter-chip").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.remove("is-active"));
    button.classList.add("is-active");
    const category = button.dataset.filter;
    productCards.forEach((card) => { card.hidden = category !== "all" && card.dataset.category !== category; });
    pushDataLayer("select_category", { category });
  });
});

const searchDialog = document.querySelector("[data-search-dialog]");
const searchInput = document.querySelector("#site-search");
document.querySelector("[data-open-search]").addEventListener("click", () => {
  searchDialog.showModal();
  searchInput.focus();
});
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  productCards.forEach((card) => { card.hidden = query.length > 0 && !card.dataset.name.toLowerCase().includes(query); });
});
searchDialog.addEventListener("close", () => {
  searchInput.value = "";
  productCards.forEach((card) => { card.hidden = false; });
  document.querySelectorAll(".filter-chip").forEach((chip, index) => chip.classList.toggle("is-active", index === 0));
});

document.querySelector("[data-newsletter-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const email = new FormData(form).get("email");
  form.reset();
  document.querySelector(".form-message").textContent = "ご登録ありがとうございます。サンプルのため送信はされません。";
  pushDataLayer("newsletter_signup", { email_domain: String(email).split("@")[1] || "unknown" });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer.classList.contains("is-open")) closeCart();
});

pushDataLayer("view_item_list", {
  ecommerce: {
    item_list_name: "New Arrivals",
    items: [...document.querySelectorAll(".add-button")].map((button, index) => ({
      item_id: button.dataset.productId,
      item_name: button.dataset.productName,
      price: Number(button.dataset.price),
      index,
    })),
  },
});
