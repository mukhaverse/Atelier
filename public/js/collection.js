// ===== API =====
const API_COLLECTION = "https://atelier-0adu.onrender.com/products/collection";

// ===== DOM (نفس IDs في HTML) =====
const $title  = document.getElementById("collectionTitle");
const $meta   = document.getElementById("collectionMeta");   
const $handle = document.getElementById("collectionHandle");  
const $avatar = document.getElementById("collectionAvatar");
const $grid   = document.getElementById("grid");
const $status = document.getElementById("status");

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

  a.appendChild(img);
  $grid.appendChild(a);
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
})();

// Local JSON (simple & unified)
async function loadLocalCollections() {
  try {
    const res = await fetch("collections.json", { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const grid = document.getElementById("grid");
    if (!grid) return;

    grid.innerHTML = "";

    const list = Array.isArray(data?.collections) ? data.collections : [];
    list.forEach((item) => {
      // <a><img></a> to match .grid_gallery a {...} styles
      const a = document.createElement("a");
      a.className = "grid_item_link";
      a.href = "#";

      const img = document.createElement("img");
      img.className = "grid_item";
      img.src = item.collectionImage;
      img.alt = item.collectionName || "item";
      img.loading = "lazy";

      a.appendChild(img);

      a.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.setItem("selectedProduct", JSON.stringify(item));
        window.location.href = "product.html";
      });

      grid.appendChild(a);
    });
  } catch (error) {
    console.error("Error loading collections from local file:", error);
  }
}

// Load from API if ?name= exists; otherwise load local JSON
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const collectionName = params.get("name");

  if (collectionName) {
    // load from API
    loadCollection(collectionName);
  } else {
    // load from local JSON
    loadLocalCollections();
  }
});
