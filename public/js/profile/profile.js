let usernameChange = false

document.getElementById('profile-delete').addEventListener('click', ()=>{
  fetch('/users/delete', {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json',
    },
  })
  .then((response)=>response.json())
  .then((data) => {
    console.log('SERVER RESPONSE:', data);
    window.location.href ='/logout'
  })
  .catch((error) => {
    console.error('SERVER RESPONSE (ERROR):', error);
  });
})

document.getElementById('profile-username').addEventListener('keyup',()=>usernameChange=true)

let gridLines = userData.settings.grid_lines

function toggleFeedback(force){
  // true = show
  // false = false
  const feedbackDiv = document.getElementById('feedback-div')
  const feedbackButton = document.getElementById('feedback-button')
  if(force){
    feedbackDiv.classList.toggle('hidden', false)
    feedbackButton.innerHTML = 'Hide Feedback'
  }else{
    feedbackDiv.classList.toggle('hidden', true)
    feedbackButton.innerHTML = 'Show Feedback'
  }
}

class ButtonGroup{
  constructor(n){
    this.n =String(n)
    this.buttons = Array.from(document.getElementsByClassName(`radioGroup${this.n}`))
    this.selected = document.getElementsByClassName(`radio${this.n}-selected`)[0]
  }
  newSelection(element){
    this.selected.classList.remove(`radio${this.n}-selected`)
    this.selected = element
    element.classList.add(`radio${this.n}-selected`)
  }
  addClick(buttonNumber, f){
    this.buttons[buttonNumber].addEventListener('click', f)
  }
}

const group3 = new ButtonGroup(3)

// Show/hide grid lines
group3.addClick(0, (e)=>{
  group3.newSelection(e.target)
  gridLines = true 
})
group3.addClick(1, (e)=>{
  group3.newSelection(e.target)
  gridLines = false
})


if(!gridLines){
  group3.newSelection(document.getElementsByClassName('radio-right')[0])
}

Array.from(document.getElementsByClassName('delButton')).forEach((e)=>{
  e.addEventListener('click', (e)=>{
    const mazeID = e.target.getAttribute('id').slice(7)
    const response = fetch('/mazes/delete', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({
        id: mazeID,
      }),
    })
    .then((response)=>response.json())
    .then((data) => {
      console.log('SERVER RESPONSE:', data);
      window.location.href ='/users/me'
    })
    .catch((error) => {
      console.error('SERVER RESPONSE (ERROR):', error);
    });
  })
})

document.getElementById('profile-submit').addEventListener('click', (e)=>{
  let cellSize= Number(document.getElementById('profile-cell_size_input').value.trim())
  if(cellSize !== NaN){
    let data = {
      grid_lines : gridLines,
      cell_size : document.getElementById('profile-cell_size_input').value
    }
    if(usernameChange){
      data.username = document.getElementById('profile-username').value
    }
    const response = fetch('/users/me', {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then((response)=>response.json())
    .then((res) => {
      console.log('SERVER RESPONSE:', res);
      displayFeedback(res, 'good', false, 'profile-feedback')
    })
    .catch((error) => {
      console.error('SERVER RESPONSE (ERROR):', error);
      displayFeedback(error, 'bad', false, 'profile-feedback')
    });
  } 
})