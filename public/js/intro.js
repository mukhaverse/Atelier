let intro = document.querySelector('.intro');
let introImg = document.querySelector('.intro-img');
let logoImage = document.querySelector('img.int-logo'); 
let logoWord = document.querySelector('h1.int-logo'); 
let slogan = document.querySelector('h2.int-logo-slogan');

window.addEventListener('DOMContentLoaded', () => {

  if (!sessionStorage.getItem('introPlayed')) {

    // Fade out the background image
    setTimeout(() => {
      introImg.style.transition = 'opacity 1s ease-in-out';
      introImg.style.opacity = '0';
    }, 2000);

    // Show logo image and text
    setTimeout(() => {
      logoImage.classList.add('active');
      logoWord.classList.add('active');
    }, 2500);

    // Show slogan
    setTimeout(() => {
      slogan.classList.add('active');
    }, 3500);

    // Show login options 
    setTimeout(() => {
      showLoginOptions();
    }, 5500);

  } else {
    // Skip intro if already played
    intro.style.display = 'none';
  }
});

function showLoginOptions() {
  
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'intro-options';
  
  
  const guestBtn = document.createElement('button');
  guestBtn.className = 'intro-btn guest-btn';
  guestBtn.textContent = 'Continue as Guest';
  guestBtn.onclick = () => {
    localStorage.setItem('user', 'guest');
    sessionStorage.setItem('introPlayed', 'true');
    fadeOutIntro();
  };
  
 
  const loginBtn = document.createElement('button');
  loginBtn.className = 'intro-btn login-btn';
  loginBtn.textContent = 'Login';
  loginBtn.onclick = () => {
    sessionStorage.setItem('introPlayed', 'true');
    window.location.href = 'public/Login.html';
  };
  
 
  optionsContainer.appendChild(loginBtn);
   optionsContainer.appendChild(guestBtn);
  
  

  document.querySelector('.int-logo-header').appendChild(optionsContainer);
  
  
  
  setTimeout(() => {
    optionsContainer.classList.add('active');
  }, 100);
}

function fadeOutIntro() {


  // Fade out all elements
  logoImage.classList.add('fade');
  logoWord.classList.add('fade');
  slogan.classList.add('fade');
  document.querySelector('.intro-options').classList.add('fade');
  

  // Fade out the entire intro screen
  setTimeout(() => {
    intro.style.transition = 'opacity 1s ease-in-out';
    intro.style.opacity = '0';
  }, 500);
  


  // Hide intro completely after fade
  setTimeout(() => {
    intro.style.display = 'none';
  }, 1500);

  
}