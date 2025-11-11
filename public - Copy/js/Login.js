const shape = document.querySelector('.shape');
const logLeft = document.querySelector('.log-div');
const signRight = document.querySelector('.sign-div')
const img = document.querySelector('.img')



const registerBtn = document.querySelector('.reg-link') 
const loginBtn = document.querySelector('.log-link')

const welc = document.querySelectorAll('.wm')
const join = document.querySelectorAll('.jm')  

const timeline1 = gsap.timeline({ paused: true })

const larg = window.matchMedia("(max-width: 1700px)");
const mid = window.matchMedia("(max-width: 768px)");
const small = window.matchMedia("(max-width: 480px)");


if (larg.matches) {
  console.log("Viewport is 1700px or smaller.");


  timeline1.to(welc,{opacity: 0, x: 30, duration: .7, stagger:.2 })
            // .to(img,{opacity: 0, duration: .7})
            .to(shape, { scale: 3,  duration: 1, ease: 'circ' })
            .to(logLeft, { opacity: 0, duration: 0.1 })
            .to(signRight, {opacity: 1, duration: 0.1})
            .to(shape,{  x: '-100%',scale: 1, duration: 1,  ease: 'circ' })
            .to(join,{opacity: 1, x: 30, duration: .7, stagger:.2 })
            

  console.log(7)

} 
else if (mid.matches) {
    console.log("Medium screen (≤768px)");

     timeline1.to(shape, { scale: 4.3, duration: 1, ease: 'circ'})
            .to(logLeft, { opacity: 0, duration: 0.3 })
            .to(signRight, {opacity: 1, duration: 0.3})
            .to(shape,{  x: '-140%', scale: 1,y: '-145%' , duration: 1, ease: 'circ' })
    



  } else if (small.matches) {
  console.log("Viewport is 480px or smaller.");


  timeline1.to(shape, { scale: 4, duration: 1, ease: 'circ'})
            .to(logLeft, { opacity: 0, duration: 0.1 })
            .to(signRight, {opacity: 1, duration: 0.1})
            .to(shape,{  x: '-50%', scale: 1,y: '-270%' , duration: 1, ease: 'circ' })
  


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










/////////////////////////////////////////////////////////// Logic



const loginForm = document.querySelector('.Login form')

loginForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    const username = document.getElementById('login-username').value
    const password = document.getElementById('login-password').value

    // here add the backend logic to check the account exist or not





    
    
// if true then log them in &  store in localstorage  
    setLoggedIn(username, password)
    
})


function setLoggedIn(username, password) {
  localStorage.setItem('loggedIn', JSON.stringify({ username, password }))
  console.log('user logged :', username)
}