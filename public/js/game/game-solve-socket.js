let mazeSolvedCount = 0;
let settings;
let mazes;


const socket = io(window.location.href.slice(window.location.href.length-20));
console.log(window.location.href.slice(window.location.href.length-20)); //the default namespace

socket.emit("connectionEvent", { 
  userID: user.id,
  gameCode: getCode()
});

socket.on('sendGameInfo', (data) => {
  settings = data.settings
  mazes = data.mazes
})

socket.on('awaitReady', (data)=>{
  document.getElementById('game-card-title').innerHTML = "Game is Full"
  document.getElementById('login-disclaimer').innerHTML = "Click Ready to indicate that you are ready."
  document.getElementById('ready-button').classList.remove('hidden')
  document.getElementById('game-link-div').classList.add('hidden')

})

document.getElementById('ready-button').addEventListener("click", ()=>{
  socket.emit('readyPlayer', {
    userID: user.id,
    gameCode: getCode()
  })
  document.getElementById('ready-button').classList.add('hidden')
  document.getElementById('login-disclaimer').innerHTML = "Waiting for other players to ready..."
  maze.loadTable(mazes[0])
})

socket.on('gameFull', (data)=>{
  window.location.href = "/games/modes"
})

socket.on('playerJoined', (data)=>{
  document.getElementById('login-disclaimer').innerHTML = `${data.username} joined the game.`
})

socket.on('solveAnnounce', (data)=>{
  
  if(data.mazeSolved > mazeSolvedCount &&data.userID !== user.id){
    mazeSolvedCount = data.mazeSolved
    const val = Math.round(mazeSolvedCount/settings.count)
    document.getElementById('opponent-progress') = val
    document.getElementById('opponent-progress-bar').style.width = `${val}%`
  }
  
})

socket.on('gameStart', (data)=>{
  document.getElementById('game-body').classList.add('reveal')
  document.getElementById('main-grid-div').classList.remove('hidden')
  enableDrawControls()
})

socket.on('gameComplete', (data)=>{
  disableDrawControls()
  document.getElementById('game-body').classList.remove('reveal')
  document.getElementById('main-grid-div').classList.add('hidden')
  document.getElementById('game-card-title').innerHTML = "Game Over"
  document.getElementById('login-disclaimer').innerHTML = "Return back to the menu to select a new game"
  // INSERT LOGIC AND CARD TO SHOW RESULTS
})

function getCode(){
  return window.location.href.slice(window.location.href.length-8)
}