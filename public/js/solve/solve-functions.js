function mazeSolved(userPath){
  console.log('SOLVE DETECTED!')
  timer.off()
  results = true
  firstSolutionClick = false
  const solutionLength = userPath.length
  const secondsPassed = Math.floor(timer.getElapsedTime(false)/1000)
  const shortestPath = maze.solution.length
  const score = Math.floor(Math.max(1000-secondsPassed, 20)*Math.max((1-((solutionLength-shortestPath)/shortestPath)), .2))
  document.getElementById('results-time').innerHTML = timer.getElapsedTime()
  document.getElementById('results-path').innerHTML = userPath.length
  document.getElementById('results-score').innerHTML = String(score)
  maze.solves += 1 
  Array.from(document.getElementsByClassName('maze-solves')).forEach((e)=>{
    e.innerHTML = String(maze.solves)
  })
  if(score > maze.highscore){
    maze.highscore = score
    maze.highestscorer = user.username
    const highscore_elements = Array.from(document.getElementsByClassName('maze-high-score'))
    highscore_elements.forEach((e)=>{
      e.innerHTML = maze.highscore
    })
    Array.from(document.getElementsByClassName('maze-highest-scorer')).forEach((e)=>{
      e.innerHTML = maze.highestscorer
    })
  }
  console.log(JSON.stringify({
    id:maze.id,
    highscore:maze.highscore,
    highestscorer:maze.highestscorer,
    solves:maze.solves,
  }))
  const response = fetch('/solve', {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify({
      id:maze.id,
      highscore:maze.highscore,
      highestscorer:maze.highestscorer,
      solves:maze.solves,
    }),
  })
  .then((response)=>response.json())
  .then((data) => {
    console.log('SERVER RESPONSE:', data);
  })
  .catch((error) => {
    console.error('SERVER RESPONSE (ERROR):', error);
  });
  
  document.getElementById('solution-button').innerHTML = 'Hide Solution'
  document.getElementById('results-button').classList.remove('hidden')
  document.getElementById('random-button').classList.remove('hidden')
  resultsModal.show()
  maze.revealSolution()
  disableControls()
}

function loadNewMaze(maze_object){
  firstSolutionClick = true
  maze.hideSolution()
  results = false
  maze.loadTable(maze_object)
  resultsModal.hide()
  failedModal.hide()
  document.getElementById('maze-title').innerHTML = maze_object.title
  document.getElementById('solution-button').classList.remove('hidden')
  document.getElementById('results-button').classList.add('hidden')
  document.getElementById('random-button').classList.add('hidden')
  document.getElementById('solution-button').innerHTML = 'Show Solution'
  Array.from(document.getElementsByClassName('maze-high-score')).forEach((e)=>{
    e.innerHTML = String(maze_object.highscore)
  })
  Array.from(document.getElementsByClassName('maze-highest-scorer')).forEach((e)=>{
    e.innerHTML = String(maze_object.highestscorer)
  })
  Array.from(document.getElementsByClassName('maze-title')).forEach((e)=>{
    e.innerHTML = String(maze_object.title)
  })
  Array.from(document.getElementsByClassName('maze-path-min')).forEach((e)=>{
    e.innerHTML = String(maze_object.solution.length)
  })
  Array.from(document.getElementsByClassName('maze-solves')).forEach((e)=>{
    e.innerHTML = String(maze_object.solves)
  })
  Array.from(document.getElementsByClassName('maze-creator')).forEach((e)=>{
    e.innerHTML = String(maze_object.creator)
  })
  lastHoverCell = null
  isDrawing = true
  solveControls_entrances = Array.from(document.getElementsByClassName('entrance'))
  solveControls_entrances.forEach((e)=>e.classList.add('userPath'))
  userPathForward = [maze.getCellObject(solveControls_entrances[0])]
  userPathBackwards = [maze.getCellObject(solveControls_entrances[1])]
  userSolution = []
  enableControls()
  enableButtons()
  mouseDown = false
}