
// 1) إعدادات عامة
const API_BASE = "https://atelier-0adu.onrender.com";

// 2) قراءة اسم الكوليكشن من الرابط (collection.html?name=...)
const params = new URLSearchParams(window.location.search);
const collectionName = (params.get("name") || "saudi-collection").trim().toLowerCase();

// يحوّل "saudi-collection" -> "Saudi Collection"
function toTitle(slug = "") {
  return slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

// 3) تطبيع روابط Google Drive إلى رابط مباشر
function normalizeImageUrl(url) {
  if (!url) return "assets/placeholder.jpg";

  // أنماط مدعومة: .../file/d/<ID>/view  أو  ...?id=<ID>  أو  uc?export=view&id=<ID>
  const idMatch =
    url.match(/(?:\/d\/)([-\w]{10,})/) ||  // /d/<ID>/
    url.match(/[?&]id=([-\w]{10,})/);      // ?id=<ID>

  if (idMatch && idMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
  }
  return url;
}

// 4) تعبئة الهيدر بمعلومات الفنان
function fillHeaderFromArtist(artist) {
  const titleEl  = document.getElementById("collectionTitle");
  const metaEl   = document.getElementById("collectionMeta");
  const handleEl = document.getElementById("collectionHandle");
  const avatarEl = document.getElementById("collectionAvatar");

  if (titleEl) titleEl.textContent = toTitle(collectionName);

  if (artist) {
    if (metaEl)   metaEl.textContent   = artist.username || (artist.artistId ? `Artist ${artist.artistId}` : "Artist");
    if (handleEl) handleEl.textContent = artist.username ? `@${artist.username}` :
                                          (artist.artistId ? `@artist-${artist.artistId}` : "@artist");
    if (avatarEl && artist.profilePic) avatarEl.src = normalizeImageUrl(artist.profilePic);
  } else {
    if (handleEl) handleEl.textContent = `@${collectionName}`;
  }
}

// 5) إنشاء عنصر (a + img) لعنصر المنتج
function createProductCard(product) {
  const link = document.createElement("a");
  link.href = `product.html?id=${encodeURIComponent(product._id)}`;
  link.setAttribute("aria-label", product.name || "Artwork");

  const img = document.createElement("img");
  const raw = Array.isArray(product.images) ? product.images[0] : null;
  const imgUrl = normalizeImageUrl(raw);

  img.src = imgUrl;
  img.alt = product.name || "Artwork";
  img.loading = "lazy";
  img.decoding = "async";
  img.referrerPolicy = "no-referrer";

  // Fallback لصورة بديلة إن فشل التحميل
  img.onerror = () => {
    img.onerror = null;
    img.src = "assets/placeholder.jpg";
  };

  link.appendChild(img);
  return link;
}

// 6) تحميل وعرض المنتجات
async function loadCollection() {
  const url = `${API_BASE}/products/collection/${encodeURIComponent(collectionName)}`;
  const status = document.getElementById("status");
  const grid = document.querySelector(".grid_gallery");

  if (status) status.textContent = "Loading...";
  if (grid) grid.innerHTML = "";

  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const payload = await res.json();
    const products = Array.isArray(payload) ? payload : (payload.products || []);
    const artist   = Array.isArray(payload) ? null    : (payload.artist  || null);

    fillHeaderFromArtist(artist);

    if (!Array.isArray(products) || products.length === 0) {
      if (status) status.textContent = "No items found.";
      return;
    }

    if (status) status.textContent = "";
    for (const p of products) {
      grid.appendChild(createProductCard(p));
    }
  } catch (err) {
    console.error("loadCollection error:", err);
    if (status) status.textContent = "Error loading collection.";
  }
}

// 7) بدء التنفيذ
document.addEventListener("DOMContentLoaded", loadCollection);
