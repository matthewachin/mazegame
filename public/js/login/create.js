const disclaimer = document.getElementById('login-disclaimer')

document.getElementById('login-button').addEventListener('click', ()=>{
  const username = document.getElementById('username').value
  if(username.length > 24){
    disclaimer.innerHTML = 'Username or password is too long. Max 24 characters.'
  }else{
    const data = {
      username: username,
    }
    const response = fetch('/create', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then((response)=>{return response.json()})
    .then((data) => {
      console.log('SERVER RESPONSE:', data);
      disclaimer.innerHTML = 'Success. Redirecting...'
      window.location.href='/maze-list'
    })
    .catch((error) => {
      console.error('SERVER RESPONSE (ERROR):', error);
      disclaimer.innerHTML = 'Error: Internal Server Error.'
    });
  }
})