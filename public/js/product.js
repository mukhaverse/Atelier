// API endpoints
const API_PRODUCT_BY_ID      = "https://atelier-0adu.onrender.com/products/id/";
const API_COLLECTION_BY_SLUG = "https://atelier-0adu.onrender.com/products/collection/";

const pick = (...xs) => xs.find(v => v !== undefined && v !== null && String(v).trim() !== "");

// Extract artist info
function extractArtist(p) {
  const obj = p.artist || p.artistData || {};
  return {
    name:     pick(p.artistName, obj.name),
    username: pick(p.artistUsername, obj.username),
    avatar:   pick(p.artistAvatar, obj.profilePic, obj.avatarUrl, obj.avatar),
  };
}

// Render the product page from a product object
function renderProduct(p) {
  //Grab DOM elements
  const $img    = document.querySelector(".product_image img");
  const $title  = document.querySelector(".title");
  const $price  = document.querySelector(".price");
  const $size   = document.querySelector(".size");
  const $medium = document.querySelector(".medium");
  const $desc   = document.querySelector(".description");
  const $name   = document.querySelector(".artisan.account h3");
  const $user   = document.querySelector(".artisan.account .username");
  const $avatar = document.querySelector(".artisan.account img");

  //Map product fields
  const imageUrl = pick(
    Array.isArray(p.images) && (p.images[0]?.url || p.images[0]),
    p.image, p.imageUrl, p.photo, p.url
  );
  const title    = pick(p.name, p.title, "Untitled");
  const price    = pick(p.price, p.cost);
  const size     = pick(p.size, p.dimensions, p.dimension);
  const medium   = pick(p.medium, p.material, p.category);
  const desc     = pick(p.description, p.details, "");

  //Resolve artist info
  const { name: artistName, username, avatar } = extractArtist(p);

  //Paint product image 
  if ($img && imageUrl) {
    $img.src = imageUrl;
    $img.onerror = () => { $img.src = "assets/post5.jpg"; };
  }

  if ($title) $title.textContent = title;

  // Price
  if ($price) {
    if (price != null) $price.textContent = (typeof price === "number" ? `${price} SR` : String(price));
    else $price.style.display = "none";
  }

  // Size
  if ($size)   (size   ? $size.textContent   = size   : $size.style.display   = "none");
  if ($medium) (medium ? $medium.textContent = medium : $medium.style.display = "none");

  // Description
  if ($desc)   $desc.textContent = desc;

  //Fill artist area
  if ($name)   $name.textContent = artistName;
  if ($user)   $user.textContent = username;
  if ($avatar && avatar) $avatar.src = avatar;
}

// Fallback, fetch artist from the collection endpoint if needed 
async function enrichArtistFromCollectionIfNeeded(product) {
  const alreadyHasArtist = product.artist && typeof product.artist === "object";
  if (alreadyHasArtist) return product;

  const slug = new URLSearchParams(location.search).get("collection");
  if (!slug) return product;

  try {
    const res = await fetch(`${API_COLLECTION_BY_SLUG}${encodeURIComponent(slug)}`, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) return product;

    const payload = await res.json();

    // If the collection payload has an artist object, merge it into the product
    if (payload?.artist && typeof payload.artist === "object") {
      return { ...product, artist: payload.artist };
    }
    return product;
  } catch {
    // On any error, keep the original product
    return product;
  }
}

// Fetch product by ID then merge artist if returned separately
async function loadProductById(id) {
  if (!id) {
    console.error("No product id provided in URL.");
    return;
  }
  try {
    // Fetch product by ID
    const res = await fetch(`${API_PRODUCT_BY_ID}${encodeURIComponent(id)}`, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    const baseProduct = data?.product ?? data;

    //If artist is returned at the top level, merge it under product.artist
    let product = baseProduct;
    if (data?.artist && typeof data.artist === "object") {
      product = { ...baseProduct, artist: data.artist };
    }

    // Render the page
    renderProduct(product);
  } catch (err) {
    console.error("Failed to load product:", err);
  }
}

// Bootstrap, read ?id= from URL and load the product
document.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) {
    console.error("Missing ?id= in URL");
    return;
  }
  loadProductById(id);
});


/************ Wishlist on Product Page (init + toggle) ************/
const API_BASE_WL = "https://atelier-0adu.onrender.com"; // نفس دومين الباك
const WL_ICON_OUTLINE = "assets/heart_icon.svg";
const WL_ICON_FILLED  = "assets/heart_icon_(added in wishlist).svg";

const WL_token  = localStorage.getItem("token");   // لو عندك JWT
const WL_userId = localStorage.getItem("userId");  // خزّنيه عند تسجيل الدخول

// استدعاء API عام
async function wlApi(path, { method = "GET", body, headers = {} } = {}) {
  const res = await fetch(`${API_BASE_WL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(WL_token ? { Authorization: `Bearer ${WL_token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    credentials: "include", // احذفيها لو ما تستخدمين كوكيز
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} – ${msg || res.statusText}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : null;
}

function wlPulse(el) {
  el.style.transform = "scale(1.12)";
  setTimeout(() => (el.style.transform = ""), 140);
}

// تعرض الأيقونة حسب الحالة
function setHeartState(heartImgEl, isInWishlist) {
  heartImgEl.src = isInWishlist ? WL_ICON_FILLED : WL_ICON_OUTLINE;
  heartImgEl.setAttribute("aria-label", isInWishlist ? "Remove from wishlist" : "Add to wishlist");
}

// (اختياري) تحديث عدّاد الويشليست في الهيدر عبر localStorage
function updateWishlistBadgeLocally(productId, isInWishlist) {
  try {
    let wl = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (isInWishlist && !wl.includes(productId)) wl.push(productId);
    if (!isInWishlist) wl = wl.filter(id => id !== productId);
    localStorage.setItem("wishlist", JSON.stringify(wl));
    // لبعض الهيدرات نطلق حدث storage لتحديث البادج
    window.dispatchEvent(new Event("storage"));
  } catch {}
}

document.addEventListener("DOMContentLoaded", async () => {
  const productId = new URLSearchParams(location.search).get("id");
  const heart = document.querySelector(".add_to_wishlist"); // <img class="add_to_wishlist" ...>
  if (!heart || !productId) return;

  // الحالة الابتدائية: اقرأ IDs من الويشليست وحدّد الأيقونة
  let isInWishlist = false;
  try {
    if (!WL_userId) throw new Error("No user");
    const list = await wlApi(`/users/${WL_userId}/wishlist`); // يرجّع IDs
    isInWishlist = Array.isArray(list) && list.some(id => String(id) === String(productId));
    setHeartState(heart, isInWishlist);
  } catch (err) {
    // لو المستخدم مو داخل أو أي خطأ: خليه على الأيقونة الفارغة
    setHeartState(heart, false);
  }

  // التبديل عند الضغط
  heart.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!WL_userId) {
      alert("Please sign in to use wishlist.");
      location.href = "login.html";
      return;
    }

    if (heart.dataset.busy === "1") return;
    heart.dataset.busy = "1";

    try {
      const result = await wlApi(`/users/${WL_userId}/wishlist/toggle`, {
        method: "PUT",
        body: { productId }
      });

      // حدّث الحالة بحسب الاستجابة
      if (result?.toggled === "added")  isInWishlist = true;
      if (result?.toggled === "removed") isInWishlist = false;

      setHeartState(heart, isInWishlist);
      wlPulse(heart);
      updateWishlistBadgeLocally(productId, isInWishlist); // اختياري
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
      alert("Could not update wishlist. Please try again.");
    } finally {
      heart.dataset.busy = "0";
    }
  });
});
