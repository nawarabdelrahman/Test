
/* =========================
   Bike HEMA - Main JavaScript
========================= */

/* Restaurant settings */
const WHATSAPP_NUMBER = "201099786562";
const RESTAURANT_NAME = "Bike HEMA";
const ADDRESS = "شارع بورسعيد - أمام صيدلية الشعب وفريش بيري";
const HOURS = "يوميًا من 1 ظهرًا إلى 2 صباحًا";
const CART_STORAGE_KEY = "bikeHemaCart";

/* Menu products */
const products = [
  // Meals
  {
    id: "m1",
    name: "وجبة رز + 3 استربس",
    price: 160,
    category: "meals",
    categoryLabel: "وجبات",
    description: "وجبة رز مع 3 قطع استربس."
  },
  {
    id: "m2",
    name: "وجبة 2 استربس + كولا",
    price: 120,
    category: "meals",
    categoryLabel: "وجبات",
    description: "قطعتان استربس مع مشروب كولا."
  },
  {
    id: "m3",
    name: "طبق ريزو",
    price: 60,
    category: "meals",
    categoryLabel: "وجبات",
    description: "طبق ريزو لذيذ."
  },

  // Burgers
  {
    id: "b1",
    name: "أوريجنال برجر",
    price: 110,
    category: "burger",
    categoryLabel: "برجر",
    description: "برجر أوريجنال بطعم مميز."
  },
  {
    id: "b2",
    name: "بيف برجر",
    price: 120,
    category: "burger",
    categoryLabel: "برجر",
    description: "بيف برجر شهي."
  },
  {
    id: "b3",
    name: "هالبينو برجر",
    price: 120,
    category: "burger",
    categoryLabel: "برجر",
    description: "برجر هالبينو لمحبي الطعم الحار."
  },
  {
    id: "b4",
    name: "تشيـز برجر",
    price: 130,
    category: "burger",
    categoryLabel: "برجر",
    description: "برجر بالجبنة."
  },
  {
    id: "b5",
    name: "بيج هيما",
    price: 150,
    category: "burger",
    categoryLabel: "برجر",
    description: "بيج هيما لعشاق البرجر."
  },
  {
    id: "b6",
    name: "راب برجر",
    price: 90,
    category: "burger",
    categoryLabel: "برجر",
    description: "راب برجر سهل ولذيذ."
  },

  // Chicken
  {
    id: "c1",
    name: "تشيكن أوريجنال",
    price: 100,
    category: "chicken",
    categoryLabel: "فراخ",
    description: "ساندوتش فراخ أوريجنال."
  },
  {
    id: "c2",
    name: "تشيكن فاير",
    price: 100,
    category: "chicken",
    categoryLabel: "فراخ",
    description: "ساندوتش فراخ بطعم حار."
  },
  {
    id: "c3",
    name: "تشيكن رانش",
    price: 110,
    category: "chicken",
    categoryLabel: "فراخ",
    description: "فراخ مع صوص رانش."
  },
  {
    id: "c4",
    name: "تشيكن تركي",
    price: 110,
    category: "chicken",
    categoryLabel: "فراخ",
    description: "ساندوتش تشيكن تركي."
  },
  {
    id: "c5",
    name: "تشيكن بومب",
    price: 115,
    category: "chicken",
    categoryLabel: "فراخ",
    description: "ساندوتش تشيكن بومب."
  },
  {
    id: "c6",
    name: "تشيكن بيف",
    price: 115,
    category: "chicken",
    categoryLabel: "فراخ",
    description: "ساندوتش تشيكن بيف."
  },
  {
    id: "c7",
    name: "راب فراخ",
    price: 80,
    category: "chicken",
    categoryLabel: "فراخ",
    description: "راب فراخ خفيف ولذيذ."
  },

  // Extras
  {
    id: "x1",
    name: "فرايز تشيز",
    price: 50,
    category: "extras",
    categoryLabel: "إضافات",
    description: "بطاطس مع الجبنة."
  },
  {
    id: "x2",
    name: "فرايز استربس",
    price: 70,
    category: "extras",
    categoryLabel: "إضافات",
    description: "بطاطس مع قطع الاستربس."
  }
];

/* App state */
let activeCategory = "all";
let searchTerm = "";
let cart = loadCart();

/* DOM helpers */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

/* Price formatting */
function formatPrice(price) {
  return Number(price).toLocaleString("ar-EG");
}

/* Escape text inserted into HTML */
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return entities[char];
  });
}

/* Product icon */
function getProductIcon(category) {
  const icons = {
    meals: "bi-egg-fried",
    burger: "bi-emoji-smile",
    chicken: "bi-fire",
    extras: "bi-basket2"
  };

  return icons[category] || "bi-egg-fried";
}

/* Render menu */
function renderProducts() {
  const grid = $("#productsGrid");
  const emptyMessage = $("#emptyProducts");

  if (!grid || !emptyMessage) return;

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "all" ||
      product.category === activeCategory;

    const searchableText =
      `${product.name} ${product.description} ${product.categoryLabel}`
        .toLowerCase();

    const matchesSearch = searchableText.includes(
      searchTerm.trim().toLowerCase()
    );

    return matchesCategory && matchesSearch;
  });

  if (filteredProducts.length === 0) {
    grid.innerHTML = "";
    emptyMessage.classList.remove("d-none");
    return;
  }

  emptyMessage.classList.add("d-none");

  grid.innerHTML = filteredProducts.map((product) => `
    <div class="col-12 col-sm-6 col-lg-4">
      <article class="product-card">
        <div class="product-visual">
          <span class="product-category-label">
            ${escapeHTML(product.categoryLabel)}
          </span>
          <i class="bi ${getProductIcon(product.category)}"
             aria-hidden="true"></i>
        </div>

        <div class="product-info">
          <h3>${escapeHTML(product.name)}</h3>

          <p class="product-description">
            ${escapeHTML(product.description)}
          </p>

          <div class="product-bottom">
            <span class="product-price">
              ${formatPrice(product.price)} جنيه
            </span>

            <button
              type="button"
              class="add-to-cart-btn"
              data-add="${escapeHTML(product.id)}"
              aria-label="إضافة ${escapeHTML(product.name)} إلى السلة">
              <i class="bi bi-plus-lg"></i>
              أضف للسلة
            </button>
          </div>
        </div>
      </article>
    </div>
  `).join("");
}

/* Category filters */
function setupFilters() {
  const filtersContainer = $("#menuFilters");
  if (!filtersContainer) return;

  filtersContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    activeCategory = button.dataset.category;

    $$("#menuFilters .filter-btn").forEach((filterButton) => {
      filterButton.classList.toggle(
        "active",
        filterButton === button
      );
    });

    renderProducts();
  });
}

/* Search */
function setupSearch() {
  const input = $("#searchInput");
  if (!input) return;

  input.addEventListener("input", () => {
    searchTerm = input.value;
    renderProducts();
  });
}

/* Load cart safely */
function loadCart() {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!savedCart) return {};

    const parsedCart = JSON.parse(savedCart);

    if (
      !parsedCart ||
      typeof parsedCart !== "object" ||
      Array.isArray(parsedCart)
    ) {
      return {};
    }

    const safeCart = {};

    Object.entries(parsedCart).forEach(([id, quantity]) => {
      const productExists = products.some(
        (product) => product.id === id
      );

      const validQuantity =
        Number.isInteger(quantity) &&
        quantity > 0 &&
        quantity <= 99;

      if (productExists && validQuantity) {
        safeCart[id] = quantity;
      }
    });

    return safeCart;
  } catch (error) {
    console.warn("تعذر قراءة السلة المحفوظة:", error);
    return {};
  }
}

/* Save cart */
function saveCart() {
  try {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cart)
    );
  } catch (error) {
    console.warn("تعذر حفظ السلة:", error);
    showToast("تعذر حفظ السلة في المتصفح.");
  }
}

/* Cart calculations */
function getCartCount() {
  return Object.values(cart).reduce(
    (total, quantity) => total + quantity,
    0
  );
}

function getCartTotal() {
  return Object.entries(cart).reduce((total, [id, quantity]) => {
    const product = products.find((item) => item.id === id);

    if (!product) return total;

    return total + product.price * quantity;
  }, 0);
}

/* Add product */
function addToCart(productId) {
  const product = products.find(
    (item) => item.id === productId
  );

  if (!product) return;

  const currentQuantity = cart[productId] || 0;

  if (currentQuantity >= 99) {
    showToast("وصلت للحد الأقصى من الكمية.");
    return;
  }

  cart[productId] = currentQuantity + 1;

  saveCart();
  renderCart();
  showToast(`تمت إضافة ${product.name} للسلة.`);
}

/* Change quantity */
function changeQuantity(productId, change) {
  if (!cart[productId]) return;

  const newQuantity = cart[productId] + change;

  if (newQuantity <= 0) {
    delete cart[productId];
  } else if (newQuantity <= 99) {
    cart[productId] = newQuantity;
  }

  saveCart();
  renderCart();
}

/* Remove item */
function removeFromCart(productId) {
  if (!cart[productId]) return;

  delete cart[productId];

  saveCart();
  renderCart();
  showToast("تم حذف الصنف من السلة.");
}

/* Clear cart */
function clearCart() {
  if (getCartCount() === 0) return;

  const confirmed = window.confirm(
    "هل أنت متأكد إنك عايز تفرّغ السلة؟"
  );

  if (!confirmed) return;

  cart = {};

  saveCart();
  renderCart();
  showToast("تم إفراغ السلة.");
}

/* Render cart */
function renderCart() {
  const cartItems = $("#cartItems");
  const emptyCart = $("#emptyCart");
  const cartSummary = $("#cartSummary");
  const cartCount = $("#cartCount");
  const cartTotal = $("#cartTotal");

  if (
    !cartItems ||
    !emptyCart ||
    !cartSummary ||
    !cartCount ||
    !cartTotal
  ) {
    return;
  }

  const entries = Object.entries(cart).filter(([id, quantity]) => {
    return (
      products.some((product) => product.id === id) &&
      Number.isInteger(quantity) &&
      quantity > 0
    );
  });

  cartItems.innerHTML = entries.map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);

    return `
      <div class="cart-item">
        <div class="cart-item-icon">
          <i class="bi ${getProductIcon(product.category)}"
             aria-hidden="true"></i>
        </div>

        <div class="cart-item-info">
          <h4>${escapeHTML(product.name)}</h4>

          <div class="cart-item-price">
            ${formatPrice(product.price * quantity)} جنيه
          </div>

          <div class="cart-item-actions">
            <button type="button"
              class="quantity-btn"
              data-change="-1"
              data-id="${escapeHTML(id)}"
              aria-label="تقليل الكمية">
              −
            </button>

            <span class="quantity-number">${quantity}</span>

            <button type="button"
              class="quantity-btn"
              data-change="1"
              data-id="${escapeHTML(id)}"
              aria-label="زيادة الكمية">
              +
            </button>

            <button type="button"
              class="remove-item-btn"
              data-remove="${escapeHTML(id)}">
              حذف
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  const isEmpty = entries.length === 0;

  emptyCart.classList.toggle("d-none", !isEmpty);
  cartSummary.classList.toggle("d-none", isEmpty);

  cartCount.textContent = formatPrice(getCartCount());
  cartTotal.textContent = formatPrice(getCartTotal());

  const checkoutTotal = $("#checkoutTotal");

  if (checkoutTotal) {
    checkoutTotal.textContent = formatPrice(getCartTotal());
  }
}

/* Cart click events */
function setupCartEvents() {
  const grid = $("#productsGrid");
  const cartItems = $("#cartItems");
  const clearCartButton = $("#clearCartBtn");
  const checkoutButton = $("#checkoutBtn");

  grid?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add]");
    if (!button) return;

    addToCart(button.dataset.add);
  });

  cartItems?.addEventListener("click", (event) => {
    const quantityButton = event.target.closest("[data-change]");
    const removeButton = event.target.closest("[data-remove]");

    if (quantityButton) {
      changeQuantity(
        quantityButton.dataset.id,
        Number(quantityButton.dataset.change)
      );
      return;
    }

    if (removeButton) {
      removeFromCart(removeButton.dataset.remove);
    }
  });

  clearCartButton?.addEventListener("click", clearCart);

  checkoutButton?.addEventListener("click", openCheckout);
}

/* Checkout modal */
function openCheckout() {
  if (getCartCount() === 0) {
    showToast("أضف وجبة للسلة الأول.");
    return;
  }

  const cartElement = $("#cartDrawer");
  const checkoutElement = $("#checkoutModal");

  if (!cartElement || !checkoutElement) return;

  const cartInstance = bootstrap.Offcanvas.getOrCreateInstance(
    cartElement
  );

  const checkoutInstance = bootstrap.Modal.getOrCreateInstance(
    checkoutElement
  );

  cartElement.addEventListener(
    "hidden.bs.offcanvas",
    function showCheckout() {
      checkoutElement.addEventListener(
        "shown.bs.modal",
        () => $("#customerName")?.focus(),
        { once: true }
      );

      checkoutInstance.show();
    },
    { once: true }
  );

  cartInstance.hide();
}

/* Build WhatsApp order */
function buildOrderMessage(customer) {
  const lines = Object.entries(cart)
    .map(([id, quantity]) => {
      const product = products.find((item) => item.id === id);

      if (!product || quantity <= 0) return null;

      return `• ${product.name} × ${quantity} = ${
        product.price * quantity
      } جنيه`;
    })
    .filter(Boolean);

  const notes = customer.notes.trim() || "لا توجد";

  return [
    `السلام عليكم، عايز أطلب من ${RESTAURANT_NAME}.`,
    "",
    "تفاصيل الطلب:",
    ...lines,
    "",
    `الإجمالي: ${getCartTotal()} جنيه`,
    "",
    "بيانات العميل:",
    `الاسم: ${customer.name}`,
    `رقم الموبايل: ${customer.phone}`,
    `العنوان: ${customer.address}`,
    `ملاحظات: ${notes}`,
    "",
    `عنوان المطعم: ${ADDRESS}`,
    `مواعيد العمل: ${HOURS}`
  ].join("\n");
}

/* Validate Egyptian mobile number */
function isValidEgyptianMobile(phone) {
  return /^01[0125][0-9]{8}$/.test(phone);
}

/* Submit checkout */
function setupCheckoutForm() {
  const form = $("#checkoutForm");
  if (!form) return;

  const phoneInput = $("#customerPhone");

  phoneInput?.addEventListener("input", () => {
    phoneInput.setCustomValidity("");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (getCartCount() === 0) {
      showToast("السلة فاضية. أضف وجبة الأول.");
      return;
    }

    if (!form.reportValidity()) return;

    const name = $("#customerName").value.trim();
    const phone = $("#customerPhone").value.trim();
    const address = $("#customerAddress").value.trim();
    const notes = $("#orderNotes").value.trim();

    if (!isValidEgyptianMobile(phone)) {
      phoneInput.setCustomValidity(
        "اكتب رقم موبايل مصري صحيح يبدأ بـ 010 أو 011 أو 012 أو 015."
      );
      phoneInput.reportValidity();
      phoneInput.setCustomValidity("");
      return;
    }

    if (!name || !address) {
      showToast("من فضلك أكمل الاسم والعنوان.");
      return;
    }

    const message = buildOrderMessage({
      name,
      phone,
      address,
      notes
    });

    const whatsappURL =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    /*
      نفتح واتساب من تفاعل المستخدم مباشرةً
      لتقليل احتمال منع نافذة المتصفح.
    */
    const whatsappWindow = window.open(
      whatsappURL,
      "_blank",
      "noopener,noreferrer"
    );

    if (!whatsappWindow) {
      showToast("المتصفح منع فتح واتساب. اسمح بالنوافذ المنبثقة وحاول تاني.");
      return;
    }

    /* إفراغ السلة بعد فتح رابط الطلب */
    cart = {};
    saveCart();
    renderCart();

    form.reset();

    const checkoutElement = $("#checkoutModal");

    if (checkoutElement) {
      bootstrap.Modal.getOrCreateInstance(checkoutElement).hide();
    }

    showToast("اتفتح واتساب برسالة الطلب. راجعها وابعتها لتأكيد الطلب.");
  });
}

/* Toast notification */
function showToast(message) {
  const toastElement = $("#siteToast");
  const toastMessage = $("#toastMessage");

  if (!toastElement || !toastMessage) return;

  toastMessage.textContent = message;

  if (typeof bootstrap !== "undefined") {
    bootstrap.Toast.getOrCreateInstance(toastElement, {
      delay: 3000
    }).show();
  }
}

/* Back to top */
function setupBackToTop() {
  const button = $("#toTop");
  if (!button) return;

  window.addEventListener("scroll", () => {
    button.classList.toggle("show", window.scrollY > 350);
  }, { passive: true });

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* Close mobile navbar after clicking a link */
function setupMobileNavbar() {
  const navbar = $("#mainNavbar");
  if (!navbar) return;

  navbar.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (
        window.innerWidth < 992 &&
        navbar.classList.contains("show")
      ) {
        bootstrap.Collapse.getOrCreateInstance(navbar).hide();
      }
    });
  });
}

/* Current year */
function setCurrentYear() {
  const yearElement = $("#currentYear");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/* Initialize */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();

  setupFilters();
  setupSearch();
  setupCartEvents();
  setupCheckoutForm();
  setupBackToTop();
  setupMobileNavbar();
  setCurrentYear();
});
