const io = require( "socket.io" )();
console.log(io)
const socketapi = {
    io: io
};
console.log('created')

const MazeModel = require('../models/mazes_model.js'), UserModel = require('../models/users_model.js'), AllModel = require('../models/all_model.js'), LogModel = require('../models/log_model.js')
const GameModel = require('../models/games_model.js')

io.on('connection', function(socket){
  console.log('Hello world')
  socket.on('connectionEvent', (data)=>{
    console.log('connected --- - -')
    console.log('connected' , data)
    const userID = data.userID, gameCode = data.gameCode, settings = {
      row: 20,
      col: 20,
      maze_count: 5,
      max_players: 2,
    }
    if(GameModel.isExists(gameCode)){
      if(GameModel.isInGame(userID, gameCode)){
        socket.join(gameCode);
        if(GameModel.isGameFull(gameCode)){
          io.to(gameCode).emit('awaitReady')
        }
      }else{
        if(GameModel.isGameFull(gameCode)){
          io.to(socket.id).emit('gameFull')
          // Client should redirect to new link
        }else{
          GameModel.joinGame(userID, gameCode)
          socket.join(gameCode)
          if(GameModel.isGameFull(gameCode)){
            io.to(gameCode).emit('awaitReady')
          }else{
            io.to(gameCode).emit('playerJoined', {
              username: GameModel.getName(userID)
            })
          }
        }
      }
    }else{
      let mazes = Array(maze_count).map(()=>{
        return ServerMaze.generateMaze(row,col)
      })
      GameModel.newGame({
        players: [
          {
            id: userID,
            solved: 0,
            ready: false,
            name: UserModel.getUser(userID).username
          }
        ],
        mazes: mazes,
        max_players: max_players,
      }, gameCode);
    }
    console.log('success')
  })
  socket.on('readyPlayer', (data)=>{
    const userID = data.userID, gameCode = data.gameCode
    GameModel.nowReady(userID, gameCode)
    if(GameModel.isAllReady(gameCode)){
      io.to(gameCode).emit('gameStart')
    }
  })
  socket.on('solvedMaze', (data)=>{
    const userID = data.userID, gameCode = data.gameCode, mazeSolved = data.mazeSolved
    if(GameModel.isSolvedAllMazes(userID,gameCode, mazeSolved)){
      io.to(gameCode).emit('gameComplete', {
        winner: userID
      })
      io.to(gameCode).emit('solveAnnounce', {
        mazeSolved: mazeSolved,
        userID: userID,
      })
    }else{
      GameModel.updateMazesSolved(userID, gameCode, mazeSolved)
      io.to(gameCode).emit('solveAnnounce', {
        mazeSolved: mazeSolved,
        userID: userID,
      })
    }
  })
});

module.exports = socketapi;