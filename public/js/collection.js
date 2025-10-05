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
