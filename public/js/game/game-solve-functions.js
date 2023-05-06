let myMazeSolve;
function mazeSolved(userPath){
  disableControls()
  socket.emit('solvedMaze', {
    userID: user.id,
    gameCode: getCode(),
    mazeSolved: myMazeSolve
  })
  if(myMazeSolve !== mazes.length-1){
    maze.resetTableElement()
    loadNewMaze(mazes[myMazeSolve+1])
  }
  myMazeSolve++
  const val = Math.round((myMazeSolve)/settings.count)
  document.getElementById('player-progress') = val
  document.getElementById('player-progress-bar').style.width = `${val}%`
  // INSERT LOGIC TO GRAB NEW MAZE, LOAD IT, & UPDATE SCORE BAR
}

function loadNewMaze(maze_object){
  maze.loadTable(maze_object)
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

