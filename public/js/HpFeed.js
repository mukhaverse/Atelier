
//Choosing category
    const nav = document.getElementById('nav');
    const container = document.getElementById('collections-container');

    nav.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-cat]');
      if (!link) return;
      e.preventDefault();

     
      nav.querySelectorAll('a[data-cat]').forEach(a => a.classList.remove('active'));
      link.classList.add('active');

      const category = link.dataset.cat;

     
      document.dispatchEvent(new CustomEvent('category:change', { detail: { category } }));

      if (typeof window.fetchAndRenderCollections === 'function') {
        
        window.fetchAndRenderCollections(category, container);
      } else {
        
        container.innerHTML = `<h2>${category} Collections</h2>
                               <p>سيتم عرض الكوليكشن هنا.</p>`;
      }
    });

//Picture display
document.addEventListener('DOMContentLoaded', function() {
    console.log("Page loaded - starting data display");
    displayCollections();
    displaySuggested();
});

async function loadCollection() {
    try {
        const response = await fetch('collections.json'); //call from jason file
        const data = await response.json();
        return data.collections;
    } catch (error) {
        console.error('Error loading Feed:', error);
        return []; 
    }
}

async function loadSuggested() {
    try {
        const response = await fetch('collections.json');
        const data = await response.json();
        return data.suggested;  
    } catch (error) {
        console.error('Error loading suggested:', error);
        return []; 
    }
}

async function displayCollections() {
    const collections = await loadCollection();
    const container = document.getElementById('collections-container');
    container.innerHTML = '';
    //for a gap before the collections 
    const gapCard = createGapCard();
    container.appendChild(gapCard);

    collections.forEach(collection => {
        const card = createCollectionCard(collection);
        container.appendChild(card);
    });
}
async function displaySuggested() {
    const suggested = await loadSuggested();
    const container = document.getElementById('suggested-container');
    container.innerHTML = '';
    
    suggested.forEach(suggested => {
        const card = createSuggestedCard(suggested);
        container.appendChild(card);
    });
}

function createCollectionCard(collection) {
    const card = document.createElement('div');
    card.className = 'collection-card'; 
    
    card.innerHTML = `
        <div class="collection-image-container">
            <img src="${collection.collectionImage}" 
                 alt="Collection Image"
                 class="collection-image">
        </div>
        <div class="collection-info">            
            <img src="${collection.profilePic}" 
                 alt="Profile picture"
                 class="profile-picture">
            <div>
                <p class="collection-name">${collection.collectionName}</p>
                <p class="username">${collection.username}</p>
            </div>          
        </div>
    `;
    
    return card; 
}

function createSuggestedCard(suggested) {
    const card = document.createElement('div');
    card.className = 'suggested-card'; 
    
    card.innerHTML = `
        <div class="column" >
            <div class="photo">
            <img src="${suggested.suggestedImage}" 
                 alt="Suggested Image"
                 class="suggested-image">
            </div>
        </div>
    `;
    
    return card; 
}
function createGapCard() {
    const gapDiv = document.createElement('div');
    gapDiv.id = 'gap';
    gapDiv.className = 'gap-space';
    return gapDiv;
}