const fs = require('fs');
const MazeModel = require('./mazes_model.js'), UserModel = require('./users_model.js'), AllModel = require('./all_model.js')

exports.isExists = (gameCode)=>{
  return fs.existsSync(`data/games/${gameCode}.json`)
}

exports.isInGame = (userID, gameCode)=>{
  const gameInfo = getGame(gameCode).players
  return gameInfo.some((player)=>{
    return player.id == userID
  })
}

exports.isGameFull = (gameCode)=>{
  const gameInfo = getGame(gameCode)
  return gameInfo.players.length >= gameInfo.max_players
};

exports.joinGame = (userID, gameCode )=>{
  let gameInfo = getGame(gameCode)
  gameInfo.players.push({
    id: userID,
    solved: 0,
    ready: false,
    name: UserModel.getUser(userID).username
  })
  writeGame(gameCode, gameInfo)
}

exports.getName = (userID) =>{
  return UserModel.getUser(userID).username
}
exports.nowReady = (userID, gameCode) =>{
  console.log(userID, gameCode)
  let gameInfo = getGame(gameCode)
  let players = gameInfo.players
  console.log(players)
  for(let i = 0; i < players.length; i++){
    if(players[i].id == userID){
      players[i].ready = true
    }
  }
  console.log(players)
  console.log(gameInfo)
  writeGame(gameCode, gameInfo)
}
exports.isAllReady = (gameCode)=>{
  return getGame(gameCode).players.every((player)=>{
    return player.ready
  })
}
exports.isSolvedAllMazes = (gameCode, count)=>{
  return count == getGame(gameCode).mazes.length-1
  // Not bug proof
}

exports.newGame = (gameInfo, gameCode)=>{
  writeGame(gameCode, gameInfo)
}

exports.updateMazesSolved = (userID, gameCode, count ) =>{
  let gameInfo = getGame(gameCode)
  let players = gameInfo.players
  for(let i = 0 ; i < players.length; i++){
    if(players[i].id == userID){
      players[i].solved = count
    }
  }
  writeGame(gameCode, gameInfo)

}

exports.deleteGame = (gameCode) =>{
  fs.unlinkSync(`data/games/${gameCode}.json`)
  return
}

exports.getGame = (gameCode)=>{
  return JSON.parse(fs.readFileSync(`data/games/${gameCode}.json`))
}

function getGame(gameCode){
  return JSON.parse(fs.readFileSync(`data/games/${gameCode}.json`))
}

function writeGame(gameCode, gameData){
  fs.writeFileSync(`data/games/${gameCode}.json`,JSON.stringify(gameData))
  return 
}