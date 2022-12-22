// Variables displaying user choice

let showSolution = false
let algDelay = 1
let visualizeAlg = true


document.getElementById('feedback-button').addEventListener('click', (e)=>{
  const feedbackDiv = document.getElementById('feedback-div')
  feedbackDiv.classList.contains('hidden') ? toggleFeedback(true) : toggleFeedback(false)
})

document.getElementById('hide-feedback').addEventListener('click', (e)=>{
  toggleFeedback(false)
})

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


document.getElementById('try-button').addEventListener('click', (e)=>{
  window.location.href = ''
  
  // TODO: IMPLEMENT NEW LINK TO PAGE
  // possibly save to local storage and send data that way?

})

document.getElementById('save-button').addEventListener('click', (e)=>{
  // RETURN FEEDBACK!
  // save on server when complete/update if exists
  
})

document.getElementById('publish-button').addEventListener('click', (e)=>{
  // RETURN FEEDBACK!
  // save on server to published mazes when complete/update if exists
})

function delay_change(value){
  algDelay = value
  document.getElementById('algorithm-speed-label').innerHTML = `${String(value)} ms`
}

document.getElementById('clear-maze-button').addEventListener('click', (e)=>{
  maze.resetMaze()
})

document.getElementById('generate-maze-button').addEventListener('click', (e)=>{
  visualizeAlg ? maze.generatePrimMaze(algDelay) : maze.generatePrimMazeInstant()
  displayFeedback('Refrain from continously running generate maze. It may make your maze unsolvable.', 'medium')
  generateMazeCount++
})


document.getElementById('submit-dimensions-button').addEventListener('click', (e)=>{
  maze.adjustColumn(Number(document.getElementById('column-size').value))
  maze.adjustRow(Number(document.getElementById('row-size').value))
})
//TODO: Code needs to be implemented to show solution on user change

function toggleClass(id, className, force){
  document.getElementById(id).classList.toggle(className, force)
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

const group1 = new ButtonGroup(1)
const group2 = new ButtonGroup(2)
const group3 = new ButtonGroup(3)
const group4 = new ButtonGroup(4)
const group5 = new ButtonGroup(5)


// Switch between settings tabs
group1.addClick(0, (e)=>{
  group1.newSelection(e.target)
  toggleClass('maze-settings', 'hidden', false)
  toggleClass('algs-settings', 'hidden', true)
  toggleClass('editor-settings', 'hidden', true)
})

group1.addClick(1, (e)=>{
  group1.newSelection(e.target)
  toggleClass('maze-settings', 'hidden', true)
  toggleClass('algs-settings', 'hidden', false)
  toggleClass('editor-settings', 'hidden', true)
})

group1.addClick(2, (e)=>{
  group1.newSelection(e.target)
  toggleClass('maze-settings', 'hidden', true)
  toggleClass('algs-settings', 'hidden', true)
  toggleClass('editor-settings', 'hidden', false)
})


// Switch between draw and erase modes
group2.addClick(0, (e)=>{
  group2.newSelection(e.target)
  enableDrawControls()

})
group2.addClick(1, (e)=>{
  group2.newSelection(e.target)
  enableEraseControls()

})

// Show/hide grid lines
group3.addClick(0, (e)=>{
  group3.newSelection(e.target)
  document.querySelector(':root').style.setProperty('--gridLine', 'rgb(67, 53, 53)')
})
group3.addClick(1, (e)=>{
  group3.newSelection(e.target)
  document.querySelector(':root').style.setProperty('--gridLine', 'transparent')
})

// Solve maze on/off
group4.addClick(0, (e)=>{
  group4.newSelection(e.target)
  showSolution = true
  visualizeAlg ? maze.aStarSolve(algDelay) : maze.aStarSolveInstant()
})
group4.addClick(1, (e)=>{
  group4.newSelection(e.target)
  showSolution = false
  maze.editClassAll('solved', false)
})

// Visualize Algs on/off
group5.addClick(0, (e)=>{
  group5.newSelection(e.target)
  visualizeAlg = true
})
group5.addClick(1, (e)=>{
  group5.newSelection(e.target)
  visualizeAlg = false
})