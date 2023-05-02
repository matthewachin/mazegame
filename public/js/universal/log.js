window.addEventListener('click', function(e){
  const data = {
    type: 'click',
    current_link: window.location.href
  }
  const response = fetch('/log/update', {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then((response)=>response.json())
  .then((data) => {
    // console.log('SERVER RESPONSE:', data);
  })
  .catch((error) => {
    console.error('SERVER RESPONSE (ERROR):', error);
  });
})