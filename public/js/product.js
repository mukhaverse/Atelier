// ================== PRODUCT & ARTIST LOADING ==================

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
  // Grab DOM elements
  const $img    = document.querySelector(".product_image img");
  const $title  = document.querySelector(".title");
  const $price  = document.querySelector(".price");
  const $size   = document.querySelector(".size");
  const $medium = document.querySelector(".medium");
  const $desc   = document.querySelector(".description");
  const $name   = document.querySelector(".artisan.account h3");
  const $user   = document.querySelector(".artisan.account .username");
  const $avatar = document.querySelector(".artisan.account img");
  const $artisanId = document.querySelector(".artisan.account._id");

  // Map product fields
  const imageUrl = pick(
    Array.isArray(p.images) && (p.images[0]?.url || p.images[0]),
    p.image, p.imageUrl, p.photo, p.url
  );
  const title    = pick(p.name, p.title, "Untitled");
  const price    = pick(p.price, p.cost);
  const size     = pick(p.size, p.dimensions, p.dimension);
  const medium   = pick(p.medium, p.material, p.category);
  const desc     = pick(p.description, p.details, "");

  // ===== AR BUTTON VISIBILITY BY CATEGORY =====
  const arButton = document.querySelector(".ar_button");
  if (arButton) {
    if (p.category === "painting") {
      arButton.style.display = "flex";
    } else {
      arButton.style.display = "none";
    }
  }

  // Resolve artist info
  const { name: artistName, username, avatar } = extractArtist(p);

  // Product image
  if ($img && imageUrl) {
    $img.src = imageUrl;
    $img.onerror = () => { $img.src = "assets/post5.jpg"; };
  }

  if ($title) $title.textContent = title;

  // Price
  if ($price) {
    if (price != null) {
      $price.textContent = (typeof price === "number" ? `${price} SR` : String(price));
    } else {
      $price.style.display = "none";
    }
  }

  // Size / Medium
  if ($size)   (size   ? $size.textContent   = size   : $size.style.display   = "none");
  if ($medium) (medium ? $medium.textContent = medium : $medium.style.display = "none");

  // Description
  if ($desc) $desc.textContent = desc;

  // Artist
  if ($name)   $name.textContent = artistName;
  if ($user)   $user.textContent = username;
  if ($avatar && avatar) $avatar.src = avatar;

  const artistObj = p.artist || p.artistData || {};
  const artistId  = artistObj._id || artistObj.id;

  const productId = p._id || p.id;

  if (!productId) {
    console.warn("No product ID found for this product:", p);
  } else {
    function navigateToArtisanProfile(id) {

      window.location.href = `profile.html?productId=${encodeURIComponent(id)}`;
    }

    if ($avatar) {
      $avatar.style.cursor = "pointer";
      $avatar.addEventListener("click", () => navigateToArtisanProfile(productId));
    }

    if ($name) {
      $name.style.cursor = "pointer";
      $name.addEventListener("click", () => navigateToArtisanProfile(productId));
    }

    if ($user) {
      $user.style.cursor = "pointer";
      $user.addEventListener("click", () => navigateToArtisanProfile(productId));
    }
  }
}

// (Optional) enrich artist from collection endpoint if needed
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

    if (payload?.artist && typeof payload.artist === "object") {
      return { ...product, artist: payload.artist };
    }
    return product;
  } catch {
    return product;
  }
}

// Fetch product by ID then render
async function loadProductById(id) {
  if (!id) {
    console.error("No product id provided in URL.");
    return;
  }
  try {
    const res = await fetch(`${API_PRODUCT_BY_ID}${encodeURIComponent(id)}`, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    const baseProduct = data?.product ?? data;

    let product = baseProduct;
    if (data?.artist && typeof data.artist === "object") {
      product = { ...baseProduct, artist: data.artist };
    } else {
      product = await enrichArtistFromCollectionIfNeeded(baseProduct);
    }

    renderProduct(product);
  } catch (err) {
    console.error("Failed to load product:", err);
  }
}

// Load product on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) {
    console.error("Missing ?id= in URL");
    return;
  }
  loadProductById(id);
});


// ================== WISHLIST (PRODUCT PAGE) ==================

const API_BASE_WL       = "https://atelier-0adu.onrender.com";
const WL_ICON_OUTLINE   = "assets/heart_icon.svg";
const WL_ICON_FILLED    = "assets/heart_icon_(added in wishlist).svg";

// Wishlist API helper
async function wlApi(path, { method = "GET", body, headers = {} } = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_WL}${path}`, {
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

function wlPulse(el) {
  el.style.transform = "scale(1.12)";
  setTimeout(() => (el.style.transform = ""), 140);
}

function setHeartState(heartImgEl, isInWishlist) {
  if (!heartImgEl) return;
  heartImgEl.src = isInWishlist ? WL_ICON_FILLED : WL_ICON_OUTLINE;
  heartImgEl.setAttribute(
    "aria-label",
    isInWishlist ? "Remove from wishlist" : "Add to wishlist"
  );
}

// (optional) keep local badge in sync
function updateWishlistBadgeLocally(productId, isInWishlist) {
  try {
    let wl = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (isInWishlist && !wl.includes(productId)) wl.push(productId);
    if (!isInWishlist) wl = wl.filter(id => String(id) !== String(productId));
    localStorage.setItem("wishlist", JSON.stringify(wl));
    window.dispatchEvent(new Event("storage"));
  } catch {}
}

// init wishlist heart on product page
document.addEventListener("DOMContentLoaded", async () => {
  const productId = new URLSearchParams(location.search).get("id");
  const heart     = document.querySelector(".add_to_wishlist"); // <img class="add_to_wishlist" ...>
  if (!heart || !productId) return;

  let isInWishlist = false;
  const userId = localStorage.getItem("userId");

  // initial state
  try {
    if (!userId) throw new Error("No user");
    //user is logged in
    const list = await wlApi(`/users/${userId}/wishlist/products`);
    isInWishlist = Array.isArray(list) &&
                   list.some(id => String(id) === String(productId));
    setHeartState(heart, isInWishlist);
  } catch (err) {
    // not logged in or error
    setHeartState(heart, false);
  }

  // toggle on click
  heart.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) {
      alert("Please sign in to use wishlist");
      location.href = "login.html";
      return;
    }

    if (heart.dataset.busy === "1") return;
    heart.dataset.busy = "1";

    try {
      const collectionSlug =
        new URLSearchParams(location.search).get("collection") || null;

      const result = await wlApi(
        `/users/${currentUserId}/wishlist/products/toggle`,
        {
          method: "PUT",
          body: { productId, collection: collectionSlug },
        }
      );

      if (result?.toggled === "added")  isInWishlist = true;
      if (result?.toggled === "removed") isInWishlist = false;

      setHeartState(heart, isInWishlist);
      wlPulse(heart);
      updateWishlistBadgeLocally(productId, isInWishlist);
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
      alert("Please sign in to use wishlist");
    } finally {
      heart.dataset.busy = "0";
    }
  });
  //  AR BUTTON CLICK
  const arButton = document.querySelector(".ar_button");

  if (arButton) {
    arButton.addEventListener("click", () => {
      const imgEl = document.querySelector(".product_image img");
      if (!imgEl || !imgEl.src) {
        console.error("No product image found for AR.");
        return;
      }

      const productImage = imgEl.src;
      window.open(`AR.html?img=${encodeURIComponent(productImage)}`, "_blank");
    });
  }
});


// ================== CART MANAGEMENT (PRODUCT PAGE) ==================

const API_CART_BASE = "https://atelier-0adu.onrender.com"; 
const CART_ICON_OUTLINE = "assets/cart_icon.svg"; 
const CART_ICON_FILLED = "assets/productTrash.svg"; 

// The endpoints you will use
const API_CART_ADD = `${API_CART_BASE}/cart/add`;
const API_CART_REMOVE = `${API_CART_BASE}/cart/remove`;
const API_CART_GET = `${API_CART_BASE}/cart/`; 

function setCartIconState(cartBtn, isInCart) {
    const imgEl = cartBtn.querySelector('img');
    if (!imgEl) return;
    imgEl.src = isInCart ? CART_ICON_FILLED : CART_ICON_OUTLINE;
    cartBtn.setAttribute(
        "aria-label",
        isInCart ? "Remove from cart" : "Add to cart"
    );
}

// Init Cart Toggle on DOM ready
document.addEventListener("DOMContentLoaded", async () => {
    const productId = new URLSearchParams(location.search).get("id");
    const cartButton = document.querySelector(".add_to_cart");
    
    if (!cartButton || !productId) return;

    let isInCart = false;
    const userId = localStorage.getItem("userId");

    // --- INITIAL STATE CHECK ---
    try {
        if (!userId) throw new Error("No user logged in.");
        
        // 1. Fetch the user's current cart data
        const res = await fetch(`${API_CART_GET}${userId}`);
        const data = await res.json();

        // 2. Check if the product ID exists in the fetched cart data
        isInCart = data.cartData?.some(group => 
            group.items.some(item => String(item.productId) === String(productId))
        );
        
        setCartIconState(cartButton, isInCart);
    } catch (err) {
        console.warn("Could not check initial cart status:", err.message);
        setCartIconState(cartButton, false);
    }

    // --- TOGGLE ON CLICK ---
    cartButton.addEventListener("click", async () => {
        const currentUserId = localStorage.getItem("userId");
        if (!currentUserId) {
            alert("Please sign in to manage your cart.");
            location.href = "login.html";
            return;
        }

        if (cartButton.disabled) return;
        cartButton.disabled = true;

        try {
            let apiURL = '';
            let method = '';
            let body = { userId: currentUserId, productId: productId };

            if (isInCart) {
                // Remove from cart
                apiURL = API_CART_REMOVE;
                method = "DELETE";
            } else {
                // Add to cart
                apiURL = API_CART_ADD;
                method = "POST";
                body.quantity = 1; // Set quantity for POST
            }

            const res = await fetch(apiURL, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || `API failed with status: ${res.status}`);
            }

            // Update state and icon
            isInCart = !isInCart;
            setCartIconState(cartButton, isInCart);
            
            

        } catch (err) {
            console.error("Cart toggle failed:", err);
            alert(`Please sign in to manage your cart.`);
        } finally {
            cartButton.disabled = false;
        }
    });
});