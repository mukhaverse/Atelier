// let intro = document.querySelector(' .intro')
// let logo = document.querySelector(' .int-logo-header')
// let logoSpan = document.querySelectorAll(' .int-logo')

// window.addEventListener('DOMContentLoaded', ()=>{

//     setTimeout(()=>{

//         logoSpan.forEach((span, idx)=>{
//             setTimeout(()=>{
//                 span.classList.add('active')
//             }, (idx + 1) * 400)
//         })

//         setTimeout(()=>{
//             logoSpan.forEach((span, idx)=>{

//                 setTimeout(()=>{
//                     span.classList.remove('active')
//                     span.classList.add('fade')
//                 }, (idx + 1) * 50 )

//             })

//         },2000)

//         setTimeout(()=>{
//             intro.style.top = '-100vh'
//             intro.style.opacity = '0'
//         }, 2300)

//     })
// })


let intro = document.querySelector('.intro');
let introImg = document.querySelector('.intro-img');
let logoImage = document.querySelector('img.int-logo'); 
let logoWord = document.querySelector('h1.int-logo'); 
let slogan = document.querySelector('h2.int-logo-slogan');

window.addEventListener('DOMContentLoaded', () => {


  setTimeout(() => {
    introImg.style.transition = 'opacity 1s ease-in-out';
    introImg.style.opacity = '0';
  }, 2000);

  setTimeout(() => {
    logoImage.classList.add('active');
    logoWord.classList.add('active');
  }, 2500);


  setTimeout(() => {
    slogan.classList.add('active');
  }, 3500);

  
  setTimeout(() => {
    logoImage.classList.remove('active');
    logoImage.classList.add('fade');

    logoWord.classList.remove('active');
    logoWord.classList.add('fade');

    slogan.classList.remove('active');
    slogan.classList.add('fade');
  }, 5500); 

  
  setTimeout(() => {
    intro.style.transition = 'opacity 1s ease-in-out';
    intro.style.opacity = '0';
  }, 6550); 
});
