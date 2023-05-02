function mazeSolved(userPath){
  disableControls()
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

