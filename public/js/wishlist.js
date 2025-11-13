// public/js/wishlist.js

const API_BASE             = "https://atelier-0adu.onrender.com";
const API_PRODUCT_BY_ID    = `${API_BASE}/products/id/`;
const API_COLLECTION_BY_SLUG = `${API_BASE}/products/collection/`;
const PRODUCT_PAGE         = "./product.html";
const HEART_FILLED_ICON = "assets/heart_icon_(added in wishlist).svg";
const CART_ICON         = "assets/cart_icon.svg";
const FALLBACK_IMG      = "assets/placeholder.jpg";

const productMap = {}; // id → product data cache

async function api(path, { method = "GET", body, headers = {} } = {}) {
  // Always get latest token
  const freshToken = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(freshToken ? { Authorization: `Bearer ${freshToken}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body)} : {}),
    // Removed credentials: "include"
  });

  // Handle API errors
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} – ${msg || res.statusText}`);
  }

  // Parse JSON if exists
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : null;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[m]));
}

function pulse(el) {
  el.style.transform = "scale(1.06)";
  setTimeout(() => (el.style.transform = ""), 140);
}

function renderEmpty(grid) {
  grid.innerHTML = `
    <div style="text-align:center; opacity:.85; padding:32px 12px">
      <p>Your wishlist is empty ✨</p>
      <button onclick="location.href='index.html'">Browse products</button>
    </div>`;
}

function renderCard(p) {
  const id    = p._id || p.id;
  const title = p.name || p.title || "Product";
  const price = (typeof p.price === "number") ? `${p.price} SAR` : (p.price || "");
  const img   =
    (Array.isArray(p.images) && (p.images[0]?.url || p.images[0])) ||
    p.mainImage || p.image || p.imageUrl || p.photo || FALLBACK_IMG;

  productMap[id] = p;

  return `
    <article class="wishlist_card" data-id="${escapeHtml(id)}">
      <a class="image_link" href="${PRODUCT_PAGE}?id=${encodeURIComponent(id)}" aria-label="${escapeHtml(title)}">
        <img src="${escapeHtml(img)}" alt="${escapeHtml(title)}" loading="lazy" onerror="this.src='${FALLBACK_IMG}'" />
      </a>

      <button class="fav_icon" aria-label="Remove from wishlist" title="Remove from wishlist">
        <img src="${HEART_FILLED_ICON}" alt="">
      </button>

      <button class="cart_icon" aria-label="Add to cart" title="Add to cart">
        <img src="${CART_ICON}" alt="">
      </button>

      <div class="meta">
        <h3 class="title">${escapeHtml(title)}</h3>
        ${price ? `<span class="price">${escapeHtml(price)}</span>` : ""}
      </div>
    </article>
  `;
}

async function fetchProductsByIds(ids) {
  const tasks = ids.map(async (id) => {
    try {
      const res = await fetch(`${API_PRODUCT_BY_ID}${encodeURIComponent(id)}`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data?.product ?? data;
    } catch {
      return null;
    }
  });

  const arr = await Promise.all(tasks);
  return arr.filter(Boolean);
}

/* --------- PRODUCTS TAB LOADING --------- */
async function loadWishlistProducts() {
  const grid        = document.getElementById("grid");
  const loginPrompt = document.querySelector(".login_prompt");
  const userId      = localStorage.getItem("userId");

  if (!grid || !loginPrompt) return;

  // Not logged in → show login message
  if (!userId) {
    loginPrompt.style.display = "flex";
    grid.style.display        = "none";
    return;
  }

  // Logged in
  loginPrompt.style.display = "none";
  grid.style.display        = "block";
  grid.innerHTML            = `<p style="opacity:.8">Loading wishlist…</p>`;

  try {
    // Use the new endpoint that returns product IDs only
    const ids = await api(`/users/${userId}/wishlist/products`);
    if (!Array.isArray(ids) || ids.length === 0) {
      renderEmpty(grid);
      return;
    }

    const items = await fetchProductsByIds(ids);
    if (!items.length) {
      renderEmpty(grid);
      return;
    }

    grid.innerHTML = items.map(renderCard).join("");
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p style="color:#ff6b6b">Failed to load wishlist. Please try again.</p>`;
  }
}

/* --------- COLLECTIONS TAB LOADING --------- */
async function loadWishlistCollections() {
  const collectionsGrid = document.getElementById("collections-grid");
  const userId          = localStorage.getItem("userId");

  if (!collectionsGrid) return;

  // If not logged in, just clear collections section (login message already handled by products)
  if (!userId) {
    collectionsGrid.innerHTML = "";
    return;
  }

  collectionsGrid.innerHTML = `<p style="opacity:.8">Loading collections…</p>`;

  try {
    // This endpoint returns something like: [ { collection: "Floral", count: 3 }, ... ]
    const collections = await api(`/users/${userId}/wishlist/collections`);

    if (!Array.isArray(collections) || !collections.length) {
      collectionsGrid.innerHTML = `<p style="opacity:.8">No collections in your wishlist yet.</p>`;
      return;
    }

    // For each collection, fetch one product to use its image as a cover
    const cardsHtml = await Promise.all(
      collections.map(async (c) => {
        const slug = c.collection;
        let coverImg = FALLBACK_IMG;

        try {
          const res = await fetch(`${API_COLLECTION_BY_SLUG}${encodeURIComponent(slug)}`, {
            headers: { Accept: "application/json" },
          });
          if (res.ok) {
            const data = await res.json();
            const firstProduct =
              Array.isArray(data?.products) && data.products.length
                ? data.products[0]
                : null;

            if (firstProduct) {
              coverImg =
                (Array.isArray(firstProduct.images) &&
                  (firstProduct.images[0]?.url || firstProduct.images[0])) ||
                firstProduct.mainImage ||
                firstProduct.image ||
                firstProduct.imageUrl ||
                firstProduct.photo ||
                FALLBACK_IMG;
            }
          }
        } catch {
          // ignore errors and keep fallback image
        }

        return `
          <article class="wishlist_card" data-collection="${escapeHtml(slug)}">
            <a class="image_link" href="collection.html?name=${encodeURIComponent(slug)}" aria-label="${escapeHtml(slug)}">
              <img src="${escapeHtml(coverImg)}" alt="${escapeHtml(slug)}" loading="lazy" onerror="this.src='${FALLBACK_IMG}'" />
            </a>
            <div class="meta">
              <h3 class="title">${escapeHtml(slug)}</h3>
              <span class="price">${c.count} item${c.count > 1 ? "s" : ""}</span>
            </div>
          </article>
        `;
      })
    );

    collectionsGrid.innerHTML = cardsHtml.join("");
  } catch (err) {
    console.error("Failed to load wishlist collections:", err);
    collectionsGrid.innerHTML = `<p style="color:#ff6b6b">Failed to load collections. Please try again.</p>`;
  }
}

/* --------- GLOBAL CLICK HANDLERS (PRODUCT CARDS) --------- */
document.addEventListener("click", async (e) => {
  const userId = localStorage.getItem("userId");
  const link   = e.target.closest(".image_link");
  const favBtn = e.target.closest(".fav_icon");
  const cartBtn = e.target.closest(".cart_icon");

  // When clicking the product image → store product data in sessionStorage before navigation
  if (link) {
    const card = link.closest(".wishlist_card");
    const id   = card?.dataset?.id;
    if (id && productMap[id]) {
      try {
        sessionStorage.setItem(`product_cache:${id}`, JSON.stringify(productMap[id]));
      } catch {}
    }
    return;
  }

  // Prevent navigation when clicking on action buttons
  if (favBtn || cartBtn) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Remove / toggle a product in wishlist (with fade-out effect)
  if (favBtn) {
    if (!userId) {
      alert("Please sign in to use wishlist.");
      location.href = "login.html";
      return;
    }

    const card = favBtn.closest(".wishlist_card");
    const id   = card?.dataset?.id;
    if (!id) return;

    if (favBtn.dataset.busy === "1") return;
    favBtn.dataset.busy = "1";

    try {
      // When (re)adding from wishlist page, we can attach the first collection as metadata if available
      const collection =
        productMap[id] && Array.isArray(productMap[id].collections)
          ? productMap[id].collections[0]
          : productMap[id]?.collections || null;

      const result = await api(`/users/${userId}/wishlist/products/toggle`, {
        method: "PUT",
        body: { productId: id, collection },
      });

      if (result?.toggled === "removed") {
        // Fade-out animation before removal
        card.classList.add("fade-out");
        setTimeout(() => card.remove(), 400);

        // Update localStorage "wishlist" (optional badge sync)
        try {
          let wl = JSON.parse(localStorage.getItem("wishlist") || "[]");
          wl = wl.filter(x => String(x) !== String(id));
          localStorage.setItem("wishlist", JSON.stringify(wl));
          window.dispatchEvent(new Event("storage"));
        } catch {}

        const grid = document.getElementById("grid");
        if (grid && grid.querySelectorAll(".wishlist_card").length === 1) {
          setTimeout(() => renderEmpty(grid), 420);
        }
      } else {
        pulse(favBtn);
      }
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
      alert("Could not update wishlist. Please try again.");
    } finally {
      favBtn.dataset.busy = "0";
    }
    return;
  }
});

/* --------- LOGIN BUTTON REDIRECT HANDLER --------- */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button, a");
  if (!btn) return;

  const label = (btn.textContent || "").trim().toLowerCase();
  const isLoginButton =
    btn.id === "loginBtn" || btn.dataset.login === "1" ||
    label === "login" || label === "sign in";

  if (isLoginButton) {
    e.preventDefault();
    try { sessionStorage.setItem("post_login_redirect", location.href); } catch {}
    location.href = "./login.html";
  }
});

/* --------- TABS (Products / Collections) --------- */
function initWishlistTabs() {
  const navLinks          = document.querySelectorAll("#wishlistNav a");
  const indicator         = document.getElementById("indicator");
  const tabsWrapper       = document.querySelector(".wishlist_tabs");
  const productsSection   = document.getElementById("grid");
  const collectionsSection = document.getElementById("collections-grid");

  if (!navLinks.length || !indicator || !tabsWrapper || !productsSection || !collectionsSection) return;

  function moveIndicator(el) {
    const rect        = el.getBoundingClientRect();
    const wrapperRect = tabsWrapper.querySelector(".navigation").getBoundingClientRect();
    const x           = rect.left - wrapperRect.left;

    indicator.style.width     = `${rect.width}px`;
    indicator.style.transform = `translateX(${x}px)`;
  }

  const active = document.querySelector("#wishlistNav .active") || navLinks[0];
  moveIndicator(active);

  let collectionsLoaded = false;

  navLinks.forEach(link => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();

      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      moveIndicator(link);

      const tab = link.dataset.tab;
      if (tab === "collections") {
        productsSection.style.display    = "none";
        collectionsSection.style.display = "block";

        if (!collectionsLoaded) {
          await loadWishlistCollections();
          collectionsLoaded = true;
        }
      } else {
        productsSection.style.display    = "block";
        collectionsSection.style.display = "none";
        // Optionally reload products when returning to this tab:
        // await loadWishlistProducts();
      }
    });
  });
}

/* --------- BOOTSTRAP --------- */
window.addEventListener("DOMContentLoaded", () => {
  loadWishlistProducts();
  initWishlistTabs();
});
