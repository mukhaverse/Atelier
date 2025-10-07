
fetch("https://atelier-0adu.onrender.com/products")
    .then(response => response.json())
    .then(data => console.log(data))
    .then(error => console.error(error));

 

//Calls the display function and chooses the category Home
document.addEventListener('DOMContentLoaded', function() {
    console.log("Page loaded - starting data display");
    displayCollections('Home');
    displaySuggested('Home');
});

//Choosing category
    const nav = document.getElementById('nav');
    const container = document.getElementById('collections-container');

    nav.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-cat]');
    if (!link) return;
    e.preventDefault();

    const category = link.dataset.cat;

    nav.querySelectorAll('a[data-cat]').forEach(a => a.classList.remove('active'));
    link.classList.add('active');

    displayCollections(category);
    displaySuggested(category);
});

//to randomize the photos
function shuffleArray(array) {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

//loads collection from json file
async function loadCollection(category = null) {
    
    let products=[];
    let collections =[];

    if ( category && category == 'Home') {
        products=  await fetch(`https://atelier-0adu.onrender.com/products`)
            .then(response => response.json());
        collections= await fetch('https://atelier-0adu.onrender.com/collections')
            .then(response => response.json())
    }else{
    const data  = await fetch(`https://atelier-0adu.onrender.com/products/category/${category}`)
        .then(response => response.json());
        products = data.products;
        collections = data.collections;
  
    
    }
       

      
         perCollections = getOneProductPerCollection(products, collections);
    return perCollections;

    
}


function getOneProductPerCollection(products, collectionNames) {
    const collectionMap = new Map();
    
    // Loop through each product in the products array
    products.forEach(product => {
        
        //  Check if the product has a 'collections' and is an array
        if (product.collections && Array.isArray(product.collections)) {
            
            //  Loop through each collection name on the product until it find one
            for (const productCollectionName of product.collections) {
                
                //  Check if this product's collection is one of our target collections
                //  and if we haven't added a product for this target collection yet
                if (collectionNames.includes(productCollectionName) && !collectionMap.has(productCollectionName)) {
                    
                    // add the first product found from a collection and add it to the map
                    collectionMap.set(productCollectionName, product);
                    
                    // Break out of the inner loop since we only need one product  
                    break; 
                }
            }
        }
    });
    
    // Convert the Map values (the products) into an array and return it
    return Array.from(collectionMap.values());
}



//loads suggested posts from json file
async function loadSuggested(category = null) {
    let suggested=[];

    if ( category && category == 'Home') {
        suggested=  await fetch(`https://atelier-0adu.onrender.com/products`)
  .then(response => response.json());
    }else{
    const data  = await fetch(`https://atelier-0adu.onrender.com/products/category/${category}`)
  .then(response => response.json());
   suggested = data.products;
  
    
    }
    return suggested;
}


async function displayCollections(category =null) {
    //calls the loading function
    let collections = await loadCollection(category);
    
    collections = await mergeProductsWithArtists(collections);

    // randomize collections
    collections = shuffleArray(collections);

    //calls the div 
    const container = document.getElementById('collections-container');
    //makes sure that the div is empty
    container.innerHTML = '';

    // Gap before first card
    const gapCard = createGapCard();
    container.appendChild(gapCard);


    //calls the function to create each card disregarding the number of collections 
    collections.forEach(collection => {
        const card = createCollectionCard(collection);
        container.appendChild(card);
    });
    
}

async function mergeProductsWithArtists(products) {
    const combinedProducts = [];

    for (const product of products) {
        let response;
        let fullResponseData; // Renaming to reflect it might be the top-level wrapper
        let productDetails; // This will hold the inner 'product' object
        let artist;
        
        

        
            response = await fetch(`https://atelier-0adu.onrender.com/products/id/${product._id}`);
            fullResponseData = await response.json(); 
            productDetails= fullResponseData.product;
           
            // 3. Extract and merge artist data
            artist = fullResponseData.artist;

            const finalProduct = {
                // ⭐️ CRITICAL FIX: Spread the extracted productDetails, not the full response
                ...productDetails, 
                
                username: artist?.username || 'Unknown',
                profilePic: artist?.profilePic || 'https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png',
            };

            combinedProducts.push(finalProduct);

        
    }

    return combinedProducts;
}


async function displaySuggested(category = null) {
    let suggested = await loadSuggested(category);
    //chooses the category so it can filter the posts
    //if its home dont carry out since no filter is needed
    

  
    // randomize suggested
    suggested = shuffleArray(suggested);
    //console.log("Shuffled suggested array:", suggested);
        //calls the div
    const container = document.getElementById('suggested-container');
        //make sure its empty
    container.innerHTML = '';

    //calls the function to create each card disregarding the number of suggested posts 
    suggested.forEach(item => {
        const card = createSuggestedCard(item);
        container.appendChild(card);
    });
}


function createCollectionCard(collection) {

    

    //calls the div inorder to write html inside it
    const card = document.createElement('div');
    card.className = 'collection-card'; 
    

    
    //write in html the code for a single card that will display
    //a new card will form by calling this function
    card.innerHTML = `
        <div class="collection-image-container">
            <img src="${collection.images[0]}" 
                 alt="Collection Image"
                 class="collection-image">
        </div>
        <div class="collection-info">            
            <img src="${collection.profilePic}" 
                 alt="Profile picture"
                 class="profile-picture">
            <div>
                <p class="collection-name">${collection.collections}</p>
                <p class="username">${collection.username}</p>
            </div>          
        </div>
    `;
    
    // Navigation
    card.addEventListener('click', (e) => {
        e.preventDefault();
        let collectionName = collection.collections;
        if (Array.isArray(collectionName) && collectionName.length > 0) {
            collectionName = collectionName[0];
        }
        
        if (collectionName) {

            window.location.href = `collection.html?name=${encodeURIComponent(collectionName)}`;
        }
    });
    return card; 
}

function createSuggestedCard(suggested) {
    //calls the div inorder to write html inside it
    const card = document.createElement('div');
    card.className = 'suggested-card'; 
    
    //write in html the code for a single card that will display
    //a new card will form by calling this function
    card.innerHTML = `
        <div class="column" >
            <div class="photo">
            <img src="${suggested.images[0]}" 
                 alt="Suggested Image"
                 class="suggested-image">
            </div>
        </div>
    `;

    // Navigation
    card.addEventListener('click', (e) => {
        e.preventDefault();      
        const productId = suggested._id || suggested.id;
        
        if (productId) {

            window.location.href = `product.html?id=${encodeURIComponent(productId)}`;
        } else {
            console.error('No product ID found for suggested item:', suggested);
        }
    });
  
    
    return card; 
}
function createGapCard() {
    const gapDiv = document.createElement('div');
    gapDiv.id = 'gap';
    gapDiv.className = 'gap-space';
    return gapDiv;
}

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  const wrap = document.querySelector('.navScroll') || nav.parentElement;
  const ind = document.getElementById('indicator');

  function move(a) {
    const li = a.closest('li');
    const base = li.offsetLeft - (wrap.scrollLeft || 0);
    
    const left = base + (li.offsetWidth - ind.offsetWidth) / 2;
    ind.style.transform =`translateX(${left}px)`;
  }

 
  move(nav.querySelector('a.active') || nav.querySelector('a'));

 
  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-cat]');
    if (!a) return;
    e.preventDefault();
    nav.querySelectorAll('a[data-cat]').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
    move(a);
  });
});