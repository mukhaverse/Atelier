const shape = document.querySelector('.shape');
const logLeft = document.querySelector('.log-div');

// const contentRight = document.querySelector('.content-right');
// const btnLeft = document.getElementById('btn-left');
// const btnRight = document.getElementById('btn-right');

const registerBtn = document.querySelector('.reg-link') 

const timeline1 = gsap.timeline()

// registerBtn.addEventListener("click", () =>{
//     registerBtn.style.color = "red";
    
// })

registerBtn.addEventListener("click", (e) =>{
    registerBtn.classList.add('active');



//                     animation for disktop

const larg = window.matchMedia("(max-width: 1700px)");
if (larg.matches) {
  console.log("Viewport is 1700px or smaller.");


  timeline1.to(logLeft, { opacity: 0, x: -30, duration: 1 })
            .to(shape, { 
            scale: 3, 
            duration: 1,
            ease: 'crick'
        })
            .to(shape,{ 
                x: '-100%',
            scale: 1,
            // y: '-300%' ,
            duration: 1, 
            ease: 'power2.inOut' 
            })
  


} else {
  console.log("Viewport is larger than 1700px.");
}




// const mid = window.matchMedia("(max-width: 768px)");
// if (mid.matches) {
//   console.log("Viewport is 768px or smaller.");


//   timeline1.to(logLeft, { opacity: 0, x: 30, duration: 1 })
//             .to(shape, { 
//             scale: 3.5,
//             duration: 1,
//             ease: 'crick'
//         })
//             .to(shape,{ 
//             x: '-130%',
//             scale: 1,
//             y: '-130%' ,
//             duration: 1, 
//             ease: 'power2.inOut' 
//             })
  




// } else {
//   console.log("Viewport is larger than 768px.");
// }



})















const small = window.matchMedia("(max-width: 480px)");

if (small.matches) {
  console.log("Viewport is 480px or smaller.");
} else {
  console.log("Viewport is larger than 480px.");
}









  

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

