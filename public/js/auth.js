

function loginUser(token, userId) {
  localStorage.setItem('token', token);
  localStorage.setItem('userId', userId);
}



function getUserId() {
  return localStorage.getItem('userId');
}


function setGuest() {
  localStorage.setItem('userId', 'guest');
  localStorage.removeItem('token');
}




function isLoggedIn() {
  return localStorage.getItem('token') !== null;
}


function isGuest() {
  return getUserId() === 'guest';
}
