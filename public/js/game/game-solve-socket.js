let mazeSolvedCount = -1;
let settings;
let mazes;

let initGameSettings = {
  row: 20,
  col: 20, 
  maze_count: 5,
  max_players: 2
}
const href = window.location.href 
let queryStr = href.split('?')
if(queryStr.length > 1){
  queryStr = queryStr[1]
  queryStr = queryStr.split('&')
  queryStr.forEach((s)=>{
    let vals = s.split('=')
    initGameSettings[vals[0]] = Number(vals[1])
  })
}
const socket = io('/');

socket.emit("connectionEvent", { 
  userID: userID,
  row: initGameSettings.row,
  col: initGameSettings.col,
  maze_count: initGameSettings.maze_count,
  max_players: initGameSettings.max_players,
  gameCode: getCode(),
});
console.log('CONNECTION EVENT EMITTED')

socket.on('awaitReady', (data)=>{
  document.getElementById('game-card-title').innerHTML = "Game is Full"
  document.getElementById('login-disclaimer').innerHTML = "Click Ready to indicate that you are ready."
  document.getElementById('ready-button').classList.remove('hidden')
  document.getElementById('game-link-div').classList.add('hidden')
  settings = data.settings
  mazes = data.mazes
  console.log('AWAIT READY RECEIVED')

})

document.getElementById('ready-button').addEventListener("click", ()=>{
  socket.emit('readyPlayer', {
    userID: userID,
    gameCode: getCode()
  })
  console.log('USER READY EMITTED')
  document.getElementById('ready-button').classList.add('hidden')
  document.getElementById('login-disclaimer').innerHTML = "Waiting for other players to ready..."
  maze.loadTable(mazes[0])
})

socket.on('gameFull', (data)=>{
  window.location.href = "/games/modes"
  console.log('GAME FULL RECEIVED')
})

socket.on('playerJoined', (data)=>{
  document.getElementById('login-disclaimer').innerHTML = `${data.username} joined the game.`
  console.log("PLAYER JOINED")
})

socket.on('solveAnnounce', (data)=>{
  
  if(data.mazeSolved > mazeSolvedCount && data.userID !== userID){
    console.log(userID, data.userID)
    mazeSolvedCount = data.mazeSolved
    const val = Math.round((mazeSolvedCount+1)*100/settings.maze_count)
    document.getElementById('opponent-progress').innerHTML = val
    document.getElementById('opponent-progress-bar').style.width = `${val}%`
  }
  
  console.log('SOLVE ANNOUNCED RECEIVED')
})

socket.on('gameStart', (data)=>{
  document.getElementById('game-body').classList.add('reveal')
  document.getElementById('main-grid-div').classList.remove('hidden')
  lastHoverCell = null
  isDrawing = true
  solveControls_entrances = Array.from(document.getElementsByClassName('entrance'))
  solveControls_entrances.forEach((e)=>e.classList.add('userPath'))
  userPathForward = [maze.getCellObject(solveControls_entrances[0])]
  userPathBackwards = [maze.getCellObject(solveControls_entrances[1])]
  userSolution = []
  mouseDown = false
  enableControls()
  console.log('GAME START RECEIVED')
})

socket.on('gameComplete', (data)=>{
  disableControls()
  document.getElementById('game-body').classList.remove('reveal')
  document.getElementById('main-grid-div').classList.add('hidden')
  document.getElementById('game-card-title').innerHTML = "Game Over"

  document.getElementById('login-disclaimer').innerHTML = `${data.winner} won the game! Return to the game menu start a new game.`
  document.getElementById('home-button').classList.remove('hidden')
  document.getElementById('home-button').addEventListener('click',()=>{
    window.location.href = '/games/menu'
  })
  // INSERT LOGIC AND CARD TO SHOW RESULTS
  console.log('GAME COMPLETE RECEIVED')
})

function getCode(){
  return window.location.pathname.slice(window.location.pathname.length-8)
}