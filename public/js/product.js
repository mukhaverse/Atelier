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
    if (price != null) $price.textContent = (typeof price === "number" ? `$${price}` : String(price));
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
