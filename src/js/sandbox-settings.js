// Variables displaying user choice

let showSolution = false
let algDelay = 1
let visualizeAlg = true

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

console.log(group1)

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
group2.addClick(0, (e)=>{
  group2.newSelection(e.target)


  //TODO TURN OFF ERASE MODE
  //TODO TURN ON DRAW MODE


})
group2.addClick(1, (e)=>{
  group2.newSelection(e.target)


  //TODO TURN ON ERASE MODE
  //TODO TURN OFF DRAW MODE


})
group3.addClick(0, (e)=>{
  group3.newSelection(e.target)
  document.querySelector(':root').style.setProperty('--gridLine', 'rgb(67, 53, 53)')
})
group3.addClick(1, (e)=>{
  group3.newSelection(e.target)
  document.querySelector(':root').style.setProperty('--gridLine', 'transparent')
})
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
group5.addClick(0, (e)=>{
  group5.newSelection(e.target)
  visualizeAlg = true
})
group5.addClick(1, (e)=>{
  group5.newSelection(e.target)
  visualizeAlg = false
})