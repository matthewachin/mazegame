
function switchMode(colorMode){
  // true = darkMode
  // false = lightMode
  
  if(colorMode){
    const darkMode = {
      '--mainText' :' white',
      '--wall': 'rgb(61, 152, 227)',
      '--pending': 'rgb(0, 255, 119)',
      '--hover': 'rgb(255, 0, 72)',
      '--start': 'greenyellow',
      '--end': 'darkred',
      '--gridLine': 'rgb(67, 53, 53)',
      '--background': 'rgb(40, 40, 40)',
      '--borderSize': '2.5px',
      '--cellSize': '15px',
      '--visited': 'rgb(61, 49, 119)',
      '--neighbor': 'rgb(153, 54, 54)',
    }
    for(variable in darkMode){
      document.querySelector(':root').style.setProperty(variable, darkMode[variable])
    }
  }else{
    const lightMode = {
      '--wall': 'black',
      '--pending': 'orange',
      '--hover': 'red',
      '--start': 'greenyellow',
      '--end': 'darkred',
      '--gridLine': 'lightgrey',
      '--background' : 'white',
      '--borderSize': '2.5px',
      '--cellSize': '15px',
      '--visited': 'rgb(61, 49, 119)',
      '--neighbor': 'rgb(153, 54, 54)',
    }
    for(variable in lightMode){
      console.log(variable)
      document.querySelector(':root').style.setProperty(variable, lightMode[variable])
    }
  }
}
function displayFeedback(text, type, force=false){
  const feedbackElement = document.getElementById('feedback-text')
  if(type == 'good'){
    feedbackElement.classList.add('feedback-good')
    feedbackElement.classList.remove('feedback-bad')
    feedbackElement.classList.remove('feedback-medium')
  }else if(type == 'bad'){
    feedbackElement.classList.add('feedback-bad')
    feedbackElement.classList.remove('feedback-good')
    feedbackElement.classList.remove('feedback-medium')
  }else{
    feedbackElement.classList.remove('feedback-good')
    feedbackElement.classList.add('feedback-medium')
    feedbackElement.classList.remove('feedback-bad')
  }
  feedbackElement.innerHTML = text
  force ? toggleFeedback(true) : null
}
function setCellSize(s){
  document.querySelector(':root').style.setProperty('--cellSize', `${s}px`)
}
function toggleGrid(force){
  if(force){
    document.querySelector(':root').style.setProperty('--gridLine', 'rgb(67, 53, 53)')
  }else{
    document.querySelector(':root').style.setProperty('--gridLine', 'transparent')
  }
}