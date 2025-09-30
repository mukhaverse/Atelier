//30/9/2025
//20:22

//Picture display
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

async function displayCollections(category = null) {
    let collections = await loadCollection();

    if (category && category !== 'Home') {
        collections = collections.filter(c => c.category === category);
    }

    // randomize collections
    collections = shuffleArray(collections);

    const container = document.getElementById('collections-container');
    container.innerHTML = '';

    // Gap before first card
    const gapCard = createGapCard();
    container.appendChild(gapCard);

    collections.forEach(collection => {
        const card = createCollectionCard(collection);
        container.appendChild(card);
    });
}

async function displaySuggested(category = null) {
    let suggested = await loadSuggested();

    if (category && category !== 'Home') {
        suggested = suggested.filter(s => s.category === category);
    }

    // randomize suggested
    suggested = shuffleArray(suggested);

    const container = document.getElementById('suggested-container');
    container.innerHTML = '';

    suggested.forEach(item => {
        const card = createSuggestedCard(item);
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