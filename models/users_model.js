var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mazeLabs.db');

db.run("PRAGMA foreign_keys = ON;");

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
    admin : false,
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

