// public/js/wishlist.js

const API_BASE          = "https://atelier-0adu.onrender.com";
const API_PRODUCT_BY_ID = `${API_BASE}/products/id/`;
const PRODUCT_PAGE      = "./product.html";
const HEART_FILLED_ICON = "public/assets/heart_icon_(added in wishlist).svg";
const CART_ICON         = "public/assets/cart_icon.svg";
const FALLBACK_IMG      = "public/assets/placeholder.jpg";

const token  = localStorage.getItem("token");

const productMap = {}; // id → product mapping

async function api(path, { method = "GET", body, headers = {} } = {}) {
  // Always get the latest token from localStorage in case the user logged in after page load
  const freshToken = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(freshToken ? { Authorization: `Bearer ${freshToken}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    credentials: "include",
  });

  // Handle errors gracefully
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} – ${msg || res.statusText}`);
  }

  // Detect if the response is JSON before parsing
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : null;
}


function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
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
        headers: { Accept: "application/json" }
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

async function loadWishlist() {
  const grid = document.getElementById("grid");
  const loginPrompt = document.querySelector(".login_prompt");
  const userId = localStorage.getItem("userId");

  if (!grid || !loginPrompt) return;

  // If the user is not logged in
  if (!userId) {
    loginPrompt.style.display = "flex"; // Show the message and button
    grid.style.display = "none";        // Hide the grid
    return;
  }

  // If the user is logged in
  loginPrompt.style.display = "none";   // Hide the message
  grid.style.display = "block";         // Show the grid
  grid.innerHTML = `<p style="opacity:.8">Loading wishlist…</p>`;

  try {
    const ids = await api(`/users/${userId}/wishlist`);
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

document.addEventListener("click", async (e) => {
  const userId = localStorage.getItem("userId");
  const link    = e.target.closest(".image_link");
  const favBtn  = e.target.closest(".fav_icon");
  const cartBtn = e.target.closest(".cart_icon");

  // When clicking the product image → store product data in sessionStorage before navigation
  if (link) {
    const card = link.closest(".wishlist_card");
    const id = card?.dataset?.id;
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

  // Remove a product from wishlist (with fade-out effect)
  if (favBtn) {
    if (!userId) {
      alert("Please sign in to use wishlist.");
      location.href = "login.html";
      return;
    }

    const card = favBtn.closest(".wishlist_card");
    const id = card?.dataset?.id;
    if (!id) return;

    if (favBtn.dataset.busy === "1") return;
    favBtn.dataset.busy = "1";

    try {
      const result = await api(`/users/${userId}/wishlist/toggle`, {
        method: "PUT",
        body: { productId: id }
      });

      if (result?.toggled === "removed") {
        // Fade-out animation before removal
        card.classList.add("fade-out");
        setTimeout(() => card.remove(), 400);

        // Update localStorage
        try {
          let wl = JSON.parse(localStorage.getItem("wishlist") || "[]");
          wl = wl.filter(x => String(x) !== String(id));
          localStorage.setItem("wishlist", JSON.stringify(wl));
          window.dispatchEvent(new Event("storage"));
        } catch {}

        const grid = document.getElementById("grid");
        if (grid && grid.querySelectorAll(".wishlist_card").length === 1) {
          // After last card removed, show empty state
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

window.addEventListener("DOMContentLoaded", loadWishlist);

// Handle "login"/"sign in" button clicks in empty state and save redirect URL
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
    location.href = "./login.html"; // Change to "../login.html" if located in a parent folder
  }
});
