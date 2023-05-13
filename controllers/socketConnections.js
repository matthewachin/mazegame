const io = require( "socket.io" )();
// console.log(io)
const socketapi = {
    io: io
};

const MazeModel = require('../models/mazes_model.js'), UserModel = require('../models/users_model.js'), AllModel = require('../models/all_model.js'), LogModel = require('../models/log_model.js')
const GameModel = require('../models/games_model.js')
const ServerMaze = require('../src/server-maze.js')
io.on('connection', function(socket){
  
  socket.on('connectionEvent', (data)=>{
    const userID = data.userID, gameCode = data.gameCode, settings = {
      row: data.row,
      col: data.col,
      maze_count: data.maze_count,
      max_players: data.max_players,
    }
    console.log(userID, gameCode, settings)
    if(GameModel.isExists(gameCode)){
      if(GameModel.isInGame(userID, gameCode)){
        socket.join(gameCode);
        if(GameModel.isGameFull(gameCode)){
          io.to(gameCode).emit('awaitReady')
          console.log('emitted 1 ')
        }
      }else{
        if(GameModel.isGameFull(gameCode)){
          io.to(socket.id).emit('gameFull')
          console.log('emitted 2 ')
          // Client should redirect to new link
        }else{
          GameModel.joinGame(userID, gameCode)
          socket.join(gameCode)
          if(GameModel.isGameFull(gameCode)){
            let gameData = GameModel.getGame(gameCode)
            io.to(gameCode).emit('awaitReady', {
              mazes: gameData.mazes,
              settings: {
                row: gameData.mazes[0].totalRows,
                col: gameData.mazes[0].totalColumns,
                maze_count: gameData.mazes.length,
                max_players: gameData.max_players
              }
            })
            console.log('emitted 3 ')
          }else{
            io.to(gameCode).emit('playerJoined', {
              username: GameModel.getName(userID)
            })
            console.log('emitted 4 ')
          }
        }
      }
    }else{
      
      let mazes = Array(settings.maze_count).fill(0).map(()=>{
        console.log('running once')
        return ServerMaze.generateMaze(settings.row,settings.col)
      })
      console.log('Hello')
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
        max_players: settings.max_players,
      }, gameCode);
      socket.join(gameCode);
    }
    console.log('success')
    console.log('emitted 5')
  })
  socket.on('readyPlayer', (data)=>{
    const userID = data.userID, gameCode = data.gameCode
    GameModel.nowReady(userID, gameCode)
    if(GameModel.isAllReady(gameCode)){
      io.to(gameCode).emit('gameStart')
      console.log('emitted 6')
    }
  })
  socket.on('solvedMaze', (data)=>{
    const userID = data.userID, gameCode = data.gameCode, mazeSolved = data.mazeSolved
    if(GameModel.isSolvedAllMazes(gameCode, mazeSolved)){
      io.to(gameCode).emit('gameComplete', {
        winner: GameModel.getName(userID)
      })
      io.to(gameCode).emit('solveAnnounce', {
        mazeSolved: mazeSolved,
        userID: userID,
      })
      console.log('emitted 7 & 8')
    }else{
      GameModel.updateMazesSolved(userID, gameCode, mazeSolved)
      io.to(gameCode).emit('solveAnnounce', {
        mazeSolved: mazeSolved,
        userID: userID,
      })
      console.log('emitted 9')
    }
  })
});

module.exports = socketapi;