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


if (small.matches) {
  console.log("Viewport is 480px or smaller.");

  timeline1.to(shape, { scale: 4, duration: .7, ease: 'sine.inOut'})
           .to(logLeft, { opacity: 0, duration: 0.05 })
           .to(signRight, {opacity: 1, duration: 0.05})
           .to(shape,{  x: '-115%', scale: 1, y: '-150%', duration: .7, ease: 'sine.inOut' })

} else if (mid.matches) {
  console.log("Medium screen (≤768px)");

  timeline1.to(shape, { scale: 4.3, duration: .7, ease: 'sine.inOut'})
           .to(logLeft, { opacity: 0, duration: 0.05 })
           .to(signRight, {opacity: 1, duration: 0.05})
           .to(shape,{  x: '-130%', scale: 1, y: '-140%', duration: .7, ease: 'sine.inOut' })

} else if (larg.matches) {
  console.log("Viewport is 1700px or smaller.");

  timeline1.to(welc,{opacity: 0, x: 30, duration: .7, stagger:.2 })
           .to(shape, { scale: 3,  duration: .7, ease: 'sine.inOut' })
           .to(logLeft, { opacity: 0, duration: 0.1 })
           .to(signRight, {opacity: 1, duration: 0.1})
           .to(shape,{  x: '-100%',scale: 1, duration: .7,  ease: 'sine.inOut' })
           .to(join,{opacity: 1, x: 30, duration: .7, stagger:.2 })
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
function setLoggedIn(username, password) {
    localStorage.setItem('loggedIn', JSON.stringify({ username, password }))
    const user = JSON.parse(localStorage.getItem('loggedIn'))
    console.log(user.username)
}


const loginForm = document.querySelector('.log-div .form-div.Login form');
const signupForm = document.querySelector('.sign-div .form-div.Sign form');


if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const inputs = signupForm.querySelectorAll('input');
        const username = inputs[0].value.trim(); 
        const email = inputs[1].value.trim();      
        const password = inputs[2].value.trim();    
        
        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registration successful! You can now log in.");
                console.log("Registration Successful!", data);
                
                timeline1.reverse(); 

            } else {
                alert(`Registration Failed: ${data.message || 'Email or Username already in use.'}`);
                console.error("Registration Failed:", data.message);
            }

        } catch (error) {
            console.error('Network Error during registration:', error);
        }
    });
}



if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const loginInputs = loginForm.querySelectorAll('input');
        const emailOrUsername = loginInputs[0].value.trim(); 
        const password = loginInputs[1].value.trim();

        if (!emailOrUsername || !password) {
            console.error('Username/Password are required.');
            return;
        }

        try {
            const response = await fetch('https://atelier-0adu.onrender.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: emailOrUsername, password })
            });

            const data = await response.json();

            if (response.ok) { 
                console.log("Login Successful!", data);
                
                localStorage.setItem('userToken', data.token); 
                localStorage.setItem('userId', data.user.id);
                
                setLoggedIn(data.user.username, password); 
                
                alert("Login successful!");
                setTimeout(() => { 
                    window.location.href = '/index.html'; 
                }, 100); 

            } else {
                alert(`Login Failed: ${data.message || 'Incorrect credentials.'}`);
                console.error("Login Failed:", data.message);
            }

        } catch (error) {
            console.error('Network Error during login:', error);
            alert('A network error occurred while connecting to the server.');
        }
    });
}