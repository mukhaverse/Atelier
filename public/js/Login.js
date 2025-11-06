const shape = document.querySelector('.shape');
const logLeft = document.querySelector('.log-div');
const signRight = document.querySelector('.sign-div')

// const contentRight = document.querySelector('.content-right');
// const btnLeft = document.getElementById('btn-left');
// const btnRight = document.getElementById('btn-right');

const registerBtn = document.querySelector('.reg-link') 
const loginBtn = document.querySelector('.log-link')

const welc = document.querySelectorAll('.wm')
const join = document.querySelectorAll('.jm')

const timeline1 = gsap.timeline({ paused: true })

const larg = window.matchMedia("(max-width: 1700px)");
const mid = window.matchMedia("(max-width: 768px)");
const small = window.matchMedia("(max-width: 480px)");



if (small.matches) {
  console.log("Viewport is 480px or smaller.");


  timeline1.to(shape, { scale: 4, duration: 1, ease: 'cric'})
            .to(logLeft, { opacity: 0, duration: 0.1 })
            .to(signRight, {opacity: 1, duration: 0.1})
            .to(shape,{  x: '-105%', scale: 1,y: '-170%' , duration: 1, ease: 'cric' })
  


} else if (mid.matches) {
    console.log("Medium screen (≤768px)");

     timeline1.to(shape, { scale: 4.3, duration: 1, ease: 'cric'})
            .to(logLeft, { opacity: 0, duration: 0.3 })
            .to(signRight, {opacity: 1, duration: 0.3})
            .to(shape,{  x: '-140%', scale: 1,y: '-145%' , duration: 1, ease: 'cric' })
    



  } else if (larg.matches) {
  console.log("Viewport is 1700px or smaller.");


  timeline1.to(welc,{opacity: 0, x: 30, duration: .7, stagger:.2 })
            .to(shape, { scale: 3,  duration: 1, ease: 'cric' })
            .to(logLeft, { opacity: 0, duration: 0.1 })
            .to(signRight, {opacity: 1, duration: 0.1})
            .to(shape,{  x: '-100%',scale: 1, duration: 1,  ease: 'cric' })
  

} 



registerBtn.addEventListener("click", () =>{
    registerBtn.classList.add('active');

    timeline1.play(); 

    signRight.style.pointerEvents = "auto"
    logLeft.style.pointerEvents = "none"

})

loginBtn.addEventListener("click", () => {
    timeline1.reverse(); 
    logLeft.style.pointerEvents = "auto"
    signRight.style.pointerEvents = "none"
})













// const small = window.matchMedia("(max-width: 480px)");

// if (small.matches) {
//   console.log("Viewport is 480px or smaller.");
// } else {
//   console.log("Viewport is larger than 480px.");
// }









  

// function animateToLeft() {
//     const tl = gsap.timeline();
    
//     tl.to(contentLeft, { opacity: 0, x: -30, duration: 0.4 })
//         .to(shape, { 
//             scale: 3,
//             duration: 0.3,
//             ease: 'power1.inOut'
//         }, '-=0.1')
//         .to(shape, { 
//             x: '-150%', 
//             rotation: -180,
//             duration: 1, 
//             ease: 'power2.inOut' 
//         }, '-=0.2')
//         .to(shape, {
//             scale: 1,
//             duration: 0.4,
//             ease: 'power1.inOut'
//         }, '-=0.5')
//         .to(contentRight, { opacity: 1, x: 0, duration: 0.4 }, '-=0.4');
// }






// function animateToRight() {
//     const tl = gsap.timeline();
    
//     tl.to(contentRight, { opacity: 0, x: 30, duration: 0.4 })
//         .to(shape, { 
//             scale: 3,
//             duration: 0.3,
//             ease: 'power1.inOut'
//         }, '-=0.1')
//         .to(shape, { 
//             x: '0%', 
//             rotation: 0,
//             duration: 1, 
//             ease: 'power2.inOut' 
//         }, '-=0.2')
//         .to(shape, {
//             scale: 1,
//             duration: 0.4,
//             ease: 'power1.inOut'
//         }, '-=0.5')
//         .to(contentLeft, { opacity: 1, x: 0, duration: 0.4 }, '-=0.4');
// }

// btnLeft.addEventListener('click', animateToLeft);
// btnRight.addEventListener('click', animateToRight);





//old timeline WORKS!!!!!!!!!! for bis screen but without checking



//     timeline1.to(logLeft, { opacity: 0, x: -30, duration: 1 })
//      .to(shape, { 
//             scale: 3,
//             duration: 1,
//             ease: 'crick'
//         }, )
//         .to(shape, { 
//             x: '-100%',
//             scale: 1,
//             // y: '-300%' ,
//             duration: 1, 
//             ease: 'power2.inOut' 
//         }, )
//         // .to(shape, { 
//         //     x: '-250%',
//         //     y: '-200%' ,
//         //     duration: 1, 
//         //     ease: 'power2.inOut' 
//         // }, )
        
// })

