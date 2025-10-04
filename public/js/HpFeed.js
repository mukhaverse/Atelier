


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
async function loadCollection() {
    try {
        const response = await fetch('collections.json'); //call from json file
        const data = await response.json();
        return data.collections;
    } catch (error) {
        console.error('Error loading Feed:', error);
        return []; 
    }
}

//loads suggested posts from json file
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
    //calls the loading function
    let collections = await loadCollection();
    //chooses the category so it can filter the posts
    //if its home dont carry out since no filter is needed
    if (category && category !== 'Home') {
        collections = collections.filter(c => c.category === category);
    }

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

async function displaySuggested(category = null) {
    let suggested = await loadSuggested();
    //chooses the category so it can filter the posts
    //if its home dont carry out since no filter is needed
    if (category && category !== 'Home') {
        suggested = suggested.filter(s => s.category === category);
    }

    // randomize suggested
    suggested = shuffleArray(suggested);

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
    //calls the div inorder to write html inside it
    const card = document.createElement('div');
    card.className = 'suggested-card'; 
    
    //write in html the code for a single card that will display
    //a new card will form by calling this function
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