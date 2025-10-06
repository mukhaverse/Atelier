//API endpoint to fetch product by ID
const API_PRODUCT_BY_ID = "https://atelier-0adu.onrender.com/products/id/";

const pick = (...xs) => xs.find(v => v !== undefined && v !== null && String(v).trim() !== "");

function renderProduct(p) {
  //DOMs
  const $img     = document.querySelector(".product_image img");
  const $title   = document.querySelector(".title");
  const $price   = document.querySelector(".price");
  const $size    = document.querySelector(".size");
  const $medium  = document.querySelector(".medium");
  const $desc    = document.querySelector(".description");
  const $name    = document.querySelector(".artisan.account h3");
  const $user    = document.querySelector(".artisan.account .username");
  const $avatar  = document.querySelector(".artisan.account img");

  // Map fields from API
  const imageUrl = pick(
    Array.isArray(p.images) && (p.images[0]?.url || p.images[0]),
    p.image, p.imageUrl, p.photo, p.url
  );
  const title    = pick(p.name, p.title, "Untitled");
  const price    = pick(p.price, p.cost);
  const size     = pick(p.size, p.dimensions, p.dimension);
  const medium   = pick(p.medium, p.material, p.category);
  const desc     = pick(p.description, p.details, "");

  const artistName = pick(p?.artist?.name, "Artisan");
  const username   = pick(p?.artist?.username, "@unknown");
  const avatarUrl  = pick(p?.artist?.profilePic, p?.artist?.avatar, p?.artist?.avatarUrl);

  // Paint
  if ($img && imageUrl) {
    $img.src = imageUrl;
    $img.onerror = () => { $img.src = "assets/post5.jpg"; };
  }
  if ($title)  $title.textContent  = title;
  if ($price)  (price != null ? $price.textContent = (typeof price === "number" ? `$${price}` : String(price)) : $price.style.display = "none");
  if ($size)   (size  ? $size.textContent  = size   : $size.style.display  = "none");
  if ($medium) (medium? $medium.textContent= medium : $medium.style.display= "none");
  if ($desc)   ($desc.textContent = desc);

  if ($name)   $name.textContent   = artistName;
  if ($user)   $user.textContent   = username;
  if ($avatar && avatarUrl) $avatar.src = avatarUrl;
}

// Load product by ID from API
async function loadProductById(id) {
  if (!id) {
    console.error("No product id provided in URL or localStorage.");
    return;
  }
  try {
    const res = await fetch(`${API_PRODUCT_BY_ID}${encodeURIComponent(id)}`, {
      headers: { "Accept": "application/json" }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    // Some APIs return the object directly; others wrap in { product }
    const product = data?.product ?? data;
    if (!product) throw new Error("Invalid API response: no product object.");

    renderProduct(product);
  } catch (err) {
    console.error("Failed to load product:", err);
  }
}

// On page load, get ?id= from URL and load product
document.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) {
    console.error("Missing ?id= in URL");
    return;
  }
  loadProductById(id);
});
