// ===== API =====
const API_COLLECTION = "https://atelier-0adu.onrender.com/products/collection";
const API_BASE = "https://atelier-0adu.onrender.com";

async function wishlistApi(path, { method = "GET", body, headers = {} } = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} – ${msg || res.statusText}`);
  }

  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : null;
}

// ===== DOM (نفس IDs في HTML) =====
const $title  = document.getElementById("collectionTitle");
const $meta   = document.getElementById("collectionMeta");   
const $handle = document.getElementById("collectionHandle");  
const $avatar = document.getElementById("collectionAvatar");
const $grid   = document.getElementById("grid");
const $status = document.getElementById("status");
const $heart = document.querySelector(".icons img[alt='wishlist icon']");
const HEART_OUTLINE = "assets/heart_icon.svg";
const HEART_FILLED  = "assets/heart_icon_(added in wishlist).svg";


function setStatus(msg) { if ($status) $status.textContent = msg || ""; }


function addCard(item) {
  const src =
    (Array.isArray(item.images) && (item.images[0]?.url || item.images[0])) ||
    item.image || item.imageUrl || item.url || item.photo;
  if (!src) return;

  const a = document.createElement("a");
  a.className = "grid_item_link";
  a.href = "#";

  const img = document.createElement("img");
  img.src = src;
  img.alt = item.name || item.title || "item";
  img.loading = "lazy";

  // Click to product page
  a.addEventListener("click", (e) => {
  e.preventDefault();
  const id   = item._id || item.id;
  const slug = new URLSearchParams(location.search).get("name");
  window.location.href = `product.html?id=${encodeURIComponent(id)}&collection=${encodeURIComponent(slug)}`;
});

  a.appendChild(img);
  $grid.appendChild(a);
}

function setupCollectionWishlistHeart() {
  if (!$heart) return;

  const slug   = new URLSearchParams(location.search).get("name") || "";
  const userId = localStorage.getItem("userId");

  function setHeart(filled) {
    $heart.src = filled ? HEART_FILLED : HEART_OUTLINE;
    $heart.dataset.filled = filled ? "1" : "0";
  }

  // لو مو مسجلة دخول
  if (!userId) {
    setHeart(false);
    $heart.addEventListener("click", () => {
      alert("Please login to save this collection.");
      location.href = "login.html";
    });
    return;
  }

  // أولاً: نتأكد هل الكوليكشن محفوظ في الويشليست أو لا
  wishlistApi(`/users/${userId}/wishlist/collections`)
    .then((list) => {
      const exists =
        Array.isArray(list) && list.some((c) => c.collection === slug);
      setHeart(exists);
    })
    .catch(() => setHeart(false));

  // لما تضغطي الهارت → نرسل toggle
  $heart.addEventListener("click", async () => {
    try {
      const result = await wishlistApi(
        `/users/${userId}/wishlist/collections/toggle`,
        {
          method: "PUT",
          body: { collection: slug },
        }
      );

      setHeart(result?.toggled === "added");
    } catch (err) {
      console.error("toggle collection wishlist error:", err);
      alert("Could not update wishlist. Please try again.");
    }
  });
}


async function loadCollection(collectionParam) {
  const fromQuery = new URLSearchParams(location.search).get("name");
  const slug = (collectionParam || fromQuery || "").trim();
  if (!slug) { setStatus("No collection provided."); return; }
  
  $title.textContent  = slug;
  $meta.textContent   = "";
  $handle.textContent = "";
  $grid.innerHTML = "";
  setStatus("Loading...");

  try {
    const res = await fetch(`${API_COLLECTION}/${encodeURIComponent(slug)}`, {
      headers: { "Accept": "application/json" }
    });
    if (!res.ok) { setStatus(`Collection not found (HTTP ${res.status}).`); return; }

    let payload;
    try { payload = await res.json(); }
    catch { setStatus("Server returned invalid data."); return; }

    const products = Array.isArray(payload?.products) ? payload.products : [];
    const artist   = payload?.artist || {};

    //Header
    $meta.textContent   = artist.name || "";
    $handle.textContent = artist.username || "";
    const avatarSrc = artist.profilePic || artist.avatar || artist.avatarUrl;
    if (avatarSrc) $avatar.src = avatarSrc;

    // Products
    if (!products.length) {
      setStatus("No products in this collection.");
      return;
    }
    for (const p of products) addCard(p);

    setStatus(""); 
  } catch {
    setStatus("Network error. Please try again.");
  }
}

// Send Parameter
window.loadCollection = loadCollection;

(function () {
  const q = new URLSearchParams(location.search).get("name");
  if (q) loadCollection(q);
  setupCollectionWishlistHeart();
})();
