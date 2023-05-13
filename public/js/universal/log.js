const logTimer = new Timer(null)

window.addEventListener('click', function(e){
  // console.log(e)
  const data = {
    type: 'click',
    current_link: window.location.pathname + window.location.search + window.location.hash,
    description: e.target.id ? `ID: ${e.target.id}, Time: ${logTimer.getElapsedTime(true)}` : `No ID, Time: ${logTimer.getElapsedTime(true)}`
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
