

const fs = require('fs');
const MazeModel = require('./mazes_model.js'), AllModel = require('./all_model.js')

exports.writeUser = function(id, userData){
  fs.writeFileSync(`data/users/${id}.json`,JSON.stringify(userData))
}
exports.getUsers = function(){
  return JSON.parse(fs.readFileSync('data/usersList.json'))
}

exports.isAdmin = function(id){
  return JSON.parse(fs.readFileSync(`data/users/${id}.json`))['admin']
}

exports.isValidUser = function(id, ids){
  return ids.includes(id)
}
exports.createUser = function(id, users){
  let newUser = {
    username : null,
    admin : true,
    mazes : [],
    solved : [],
    settings : {
      grid_lines : true,
      cell_size : 15,
    }
  }
  fs.writeFileSync(`data/users/${id}.json`, JSON.stringify(newUser))
  users.push(id)
  fs.writeFileSync(`data/usersList.json`, JSON.stringify(users))
}
exports.getUser = function(id){
  return JSON.parse(fs.readFileSync(`data/users/${id}.json`))
}

exports.deleteUser = function(id){
  let userList = JSON.parse(fs.readFileSync('data/usersList.json'))
  const ind = userList.indexOf(id)
  ind > -1 ? userList.splice(ind, 1) : null
  fs.writeFileSync(`data/usersList.json`, JSON.stringify(userList))
  let mazesOwned = JSON.parse(fs.readFileSync(`data/users/${id}.json`)).mazes
  mazesOwned.forEach((mazeID)=>{
    MazeModel.deleteMaze(mazeID, null, true)
  })
  fs.unlinkSync(`data/users/${id}.json`)
}
