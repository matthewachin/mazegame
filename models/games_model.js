const fs = require('fs');
const MazeModel = require('./mazes_model.js'), UserModel = require('./users_model.js'), AllModel = require('./all_model.js')

exports.isExists = (gameCode)=>{
  return fs.existsSync(`data/games/${gameCode}.json`)
}

exports.isInGame = (userID, gameCode)=>{
  const gameInfo = getGame(gameCode).players
  return gameInfo.some((player)=>{
    player.id = userID
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
  let gameInfo = getGame(gameCode)
  let players = gameInfo.players
  for(let i = 0; i < players.length; i++){
    if(players[i].id == userID){
      players[i].ready = true
    }
  }
  writeGame(gameInfo, gameCode)
}
exports.isAllReady = (gameCode)=>{
  return getGame(gameCode).players.every((player)=>{
    return player.ready
  })
}
exports.isSolvedAllMazes = (userID, gameCode, count)=>{
  return getGame(gameCode).players.filter((player)=>{
    return player.id == userID
  })[0].solved == count
  // Not bug proof
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

function getGame(gameCode){
  return JSON.parse(fs.readFileSync(`data/games/${gameCode}.json`))
}

function writeGame(gameCode, gameData){
  fs.writeFileSync(`data/games/${gameCode}.json`,JSON.stringify(gameData))
  return 
}