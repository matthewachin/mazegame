var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mazeLabs.db');

db.run("PRAGMA foreign_keys = ON;");

const fs = require('fs');
const UserModel = require('./users_model.js'), AllModel = require('./all_model.js')

exports.writeMaze = function(id, mazeData){
  fs.writeFileSync(`data/mazes/${id}_MAZE.json`, JSON.stringify(mazeData))
}
exports.getMazeIDs = function(){
  return JSON.parse(fs.readFileSync('data/mazeList.json'))
}
exports.getMaze = function(id){
  return JSON.parse(fs.readFileSync(`data/mazes/${id}_MAZE.json`))
}

exports.createMaze = function(mazeObj){
  let MazeIDs;
  try{
    MazeIDs = JSON.parse(fs.readFileSync('data/mazeList.json'))
    const MazeID = AllModel.createMazeID(MazeIDs)
    mazeObj.id = MazeID
    fs.writeFileSync(`data/mazes/${MazeID}_MAZE.json`, JSON.stringify(mazeObj))
    MazeIDs.push(MazeID)
    fs.writeFileSync('data/mazeList.json', JSON.stringify(MazeIDs))
    return MazeID
  }catch{
    fs.writeFileSync('data/mazeList.json', JSON.stringify(MazeIDs))
    throw 'ERROR: Failed to save maze.'
  }
}

exports.deleteMaze = (id, userID, massDelete=false)=>{
  let mazeList = JSON.parse(fs.readFileSync('data/mazeList.json'))
  const ind = mazeList.indexOf(id)
  ind > -1 ? mazeList.splice(ind, 1) : null
  fs.writeFileSync(`data/mazeList.json`, JSON.stringify(mazeList))
  fs.unlinkSync(`data/mazes/${id}_MAZE.json`)
  if(!massDelete){
    let userData = UserModel.getUser(userID)
    userData.mazes.splice(userData.mazes.indexOf(mazeID), 1)
    UserModel.writeUser(userID, userData)
  }
}

