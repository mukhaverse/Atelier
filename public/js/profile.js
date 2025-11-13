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
  const artisanCollections = await fetchArtisanCollection(artisanID);
  // Default: show products
  displayProducts(artisanProducts);

  // Set up tab switching
  setupCategorySwitching(artisanProducts,artisanCollections);
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

async function fetchArtisanCollection(artistId){

    const restemp = await fetch(`https://atelier-0adu.onrender.com/collections/artist/${artistId}`);
const datatemp = await restemp.json();
console.log("collection for artist:", datatemp);

     let collections = []; // initialize as an empty array

    const res = await fetch(`https://atelier-0adu.onrender.com/collections/artist/${artistId}`);
    const data = await res.json();
    collections = data;
    return collections ;
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
    // laod skeletons 

    for (let i = 0; i < 8; i++) {
        const skeletonCard = createProductSkeletonCard();
        container.appendChild(skeletonCard);
    }
    
    await new Promise(res => setTimeout(res, 1000));

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
            inStockButton.textContent = "Show All Items";
        } else {
            // Show all products
            products = await fetchArtisanProduct(artisanID);

            // Remove highlight
            inStockButton.classList.remove('active');
            inStockButton.textContent = "Show Available";
        }

        displayProducts(products);

        // Toggle the state
        inStockActive = !inStockActive;

    } catch (error) {
        console.error(error);
    }
});



// === Display collections ===
async function displayCollections(collections) {
    const container = document.getElementById('collections-container');
      container.scrollIntoView({ behavior: "smooth", block: "start" });
    container.innerHTML = '';

    for (let i = 0; i < 8; i++) {
        const skeletonCard = createCollectionSkeletonCard();
        container.appendChild(skeletonCard);
    }

      await new Promise(res => setTimeout(res, 800));

        container.innerHTML = '';
    // Shuffle collections
    collections = shuffleArray(collections);

    // Fetch all products once to avoid multiple network calls
    let allProducts = [];
    try {
        const res = await fetch('https://atelier-0adu.onrender.com/products');
        const data = await res.json();
        allProducts = Array.isArray(data) ? data : (data.products || []);
    } catch (err) {
        console.error('Error fetching products:', err);
    }

    collections.forEach(collection => {
        const card = createCollectionCard(collection, allProducts);
        container.appendChild(card);
    });
}

function createCollectionCard(collection, allProducts) {
    const card = document.createElement('div');
    card.className = 'collection-card';

    const mainImgSrc = collection.images?.[0] || '';
    const hoverImgSrc = collection.images?.[1] || mainImgSrc;

    card.innerHTML = `
        <div class="collection-image-container">
            <img src="${collection.images && collection.images[0] ? collection.images[0] : ''}" 
                 alt="Collection Image"
                 class="collection-image">
        </div>
        <div class="collection-info">
            <p class="collection-name">${collection.collection}</p>
        </div>
    `;

    // Hover Logics 
    try {
        const imgContainer = card.querySelector('.collection-image-container');
        const mainImg = imgContainer.querySelector('.collection-image');

        
        if (mainImg && !mainImg.classList.contains('main-image')) {
            mainImg.classList.add('main-image');
        }

        const hoverImg = document.createElement('img');
        hoverImg.src = (collection.images && collection.images[1])
                        ? collection.images[1]
                        : (collection.images && collection.images[0]) ? collection.images[0] : '';
        hoverImg.alt = 'Hover Image';
        hoverImg.className = 'collection-image hover-image';

        
        imgContainer.appendChild(hoverImg);

        const collectionKeys = Array.isArray(collection.collections)
            ? collection.collections
            : (collection.collections ? [collection.collections] : []);

        // fetching another product
        fetch('https://atelier-0adu.onrender.com/products')
          .then(res => res.json())
          .then(data => {
              const products = Array.isArray(data) ? data : (data.products || []);
              
              // find the first product that isn't the current one & shares the same collections
              const related = products.find(p =>
                  p._id !== collection._id &&
                  Array.isArray(p.collections) &&
                  p.collections.some(c => collectionKeys.includes(c)) 
              );

              if (related) {
                  hoverImg.src = related.images[0];
              }
          })
          .catch(err => {
              console.error('Could not fetch related product image:', err);
          });

    } catch (err) {
        console.error('Error while setting up hover image:', err);
    }

    // Navigation
    card.addEventListener('click', () => {
        const collectionName = collection.collection;
        if (collectionName) {
            window.location.href = `public/collection.html?name=${encodeURIComponent(collectionName)}`;
        }
    });

    return card;
}


// === Category (tab) switching === 

function setupCategorySwitching(artisanProducts, artisanCollections) {
    const navLinks = document.querySelectorAll(".navigation a");
    const indicator = document.getElementById("indicator");
    

    navLinks.forEach(link => {
        link.addEventListener("click", async (e) => {
            e.preventDefault();

            // update active link
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            // move indicator under clicked link
            if (indicator) {
                indicator.style.width = link.offsetWidth + "px";
                indicator.style.transform = `translateX(${link.offsetLeft}px)`;
            }

            // toggle containers
            const productsContainer = document.getElementById('products-container');
            const collectionsContainer = document.getElementById('collections-container');

            const cat = link.dataset.cat;
            if (cat === "products") {
                productsContainer.style.display = "block";
                collectionsContainer.style.display = "none";
                inStockButton.style.display = "block";
                await displayProducts(artisanProducts);
            } else {
                productsContainer.style.display = "none";
                collectionsContainer.style.display = "grid";
                inStockButton.style.display = "none";
                await displayCollections(artisanCollections);
            }
        });
    });

    // Initial indicator position
    const active = document.querySelector(".navigation a.active");
    if (active && indicator) {
        indicator.style.width = active.offsetWidth + "px";
        indicator.style.transform = `translateX(${active.offsetLeft}px)`;
    }
}


function createProductSkeletonCard() {
    const skeletonCard = document.createElement('div');
    skeletonCard.className = 'products-card';
    
    skeletonCard.innerHTML = `
        <div class="column">
            <div class="photo">
                <div class="product-skeleton skeleton"></div>
            </div>
        </div>
    `;
    
    return skeletonCard;
}

function createCollectionSkeletonCard() {
    const skeletonCard = document.createElement('div');
    skeletonCard.className = 'collections-card';
    
    skeletonCard.innerHTML = `
        <div class="collection-image-container">
            <div class="collection-image skeleton skeleton-square"></div>
        </div>
        <div class="collection-info">            
                <div class="skeleton skeleton-text medium"></div>
        </div>
    `;
    
    return skeletonCard;
}