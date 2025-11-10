document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("productId");
  if (!productId) return console.error("No product ID in URL");

    showArtisanSkeleton();
  // Fetch artisan info + their products/collections
  const artisanData = await fetchArtisanByProduct(productId);
   artisanID = artisanData.artistId;   // Display artisan info at the top

   hideArtisanSkeleton();
  displayArtisanInfo(artisanData);

  const artisanProducts = await fetchArtisanProduct(artisanID);
  // Default: show products
  displayProducts(artisanProducts);

  // Set up tab switching
  setupCategorySwitching(artisanProducts);
});

function showArtisanSkeleton() {
    const profilePic = document.querySelector(".profilePic img");
    const name = document.querySelector(".name");
    const username = document.querySelector(".username");

    // Apply skeleton classes
    profilePic.classList.add("skeleton-circle");
    name.classList.add("skeleton-line");
    username.classList.add("skeleton-line");

    // Hide the real image temporarily
    profilePic.src = "";
}

function hideArtisanSkeleton() {
    const profilePic = document.querySelector(".profilePic img");
    const name = document.querySelector(".name");
    const username = document.querySelector(".username");

    // Remove skeleton classes
    profilePic.classList.remove("skeleton-circle");
    name.classList.remove("skeleton-line");
    username.classList.remove("skeleton-line");
}



// === Fetch data ===
async function fetchArtisanByProduct(productId) {


 const res = await fetch(`https://atelier-0adu.onrender.com/products/id/${productId}`);
    const data = await res.json();

    const artist = data.artist;

    if (!artist) {
      console.error("No artist found for this product");
      return;
    }

    return artist;
}


async function fetchArtisanProduct(artistId) {
const res1 = await fetch(`https://atelier-0adu.onrender.com/products/artistId/${artistId}`);
const data1 = await res1.json();
console.log("Products for artist:", data1);

    let products = []; // initialize as an empty array

    const res = await fetch(`https://atelier-0adu.onrender.com/products/artistId/${artistId}`);
    const data = await res.json();

    // assuming the API returns an array of products
    if (Array.isArray(data)) {
        products = data;
    } else if (Array.isArray(data.products)) {
        products = data.products;
    }

    return products; 
}



// === Display artisan info ===
function displayArtisanInfo(artist) {

     document.querySelector(".name").textContent = artist.name || "Unknown Artist";
    document.querySelector(".username").textContent = `${artist.username || "unknown"}`;
    document.querySelector(".profilePic img").src =
      artist.profilePic || "assets/placeholder.jpg";
    document.querySelector(".description p").textContent =
      artist.bio || "No description available.";
    document.querySelector(".link-text").textContent =
      artist.website ? artist.website : "No website";
    document.querySelector(".link a").href =
      artist.website || "#";
}
function shuffleArray(array) {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}
// === Display products ===
async function displayProducts(products) {

    const container = document.getElementById('products-container');
    
    container.innerHTML = '';

    

    products = shuffleArray(products);
    
    
    //remove skeletone loader
    container.innerHTML = '';

    //calls the function to create each card disregarding the number of suggested posts 
    products.forEach(item => {
        const card = createProductsCard(item);
        container.appendChild(card);
    });
}




function createProductsCard(product) {
    const card = document.createElement('div');
    card.className = 'products-card'; 

    // Check availability and create overlay if needed
    const outOfStockOverlay = product.availability === "Out of Stock"
        ? `<div class="out-of-stock-overlay">Out of Stock</div>`
        : '';

    card.innerHTML = `
        <div class="column">
            <div class="photo">
                <img src="${product.images[0]}" 
                     alt="Product Image"
                     class="products-image">
                ${outOfStockOverlay}
            </div>
        </div>
    `;
    return card;
}


let inStockActive = false; // toggle state
const inStockButton = document.getElementById('inStockButton');

inStockButton.addEventListener('click', async () => {
    if (!artisanID) return console.error('Artist ID not set yet');

    try {
        let products;

        if (!inStockActive) {
            // Show in-stock products
            const response = await fetch(`https://atelier-0adu.onrender.com/products/artistId/available/${artisanID}`);
            products = await response.json();

            // Highlight the button
            inStockButton.classList.add('active');
            inStockButton.textContent = " All Items";
        } else {
            // Show all products
            products = await fetchArtisanProduct(artisanID);

            // Remove highlight
            inStockButton.classList.remove('active');
            inStockButton.textContent = "Available";
        }

        displayProducts(products);

        // Toggle the state
        inStockActive = !inStockActive;

    } catch (error) {
        console.error(error);
    }
});


/*
// === Display collections ===
function displayCollections(collections) {
  const container = document.getElementById("content-container");
  container.innerHTML = "";

  collections.forEach(collection => {
    const card = document.createElement("div");
    card.className = "collection-card";
    card.innerHTML = `
      <img src="${collection.cover}" alt="${collection.title}">
      <p>${collection.title}</p>
    `;
    container.appendChild(card);
  });
}
*/
// === Category (tab) switching === 
function setupCategorySwitching(artisanProducts) {
  const navLinks = document.querySelectorAll(".navigation a");
  const indicator = document.getElementById("indicator");

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // update active link
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      // move indicator under the clicked link
      indicator.style.width = link.offsetWidth + "px";
      indicator.style.transform = `translateX(${link.offsetLeft}px)`;

      // load correct content
      const cat = link.dataset.cat;
      if (cat === "products") displayProducts(artisanProducts);
      else displayCollections(artisanData.collections);
    });
  });

  // set indicator initially under the active link
  const active = document.querySelector(".navigation a.active");
  if (active) {
    indicator.style.width = active.offsetWidth + "px";
    indicator.style.transform = `translateX(${active.offsetLeft}px)`;
  }
}
