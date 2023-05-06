var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mazeLabs.db');

db.run("PRAGMA foreign_keys = ON;");

const fs = require('fs');
const MazeModel = require('./mazes_model.js'), UserModel = require('./users_model.js')
exports.isAdmin = function (req,res ,next){
  try{
    const id = req.session.passport.user
    if(UserModel.isValidUser(id, UserModel.getUsers())){
      UserModel.isAdmin(id) ? next() : res.redirect('/mazes')
    }else{
      res.redirect('/login')
      throw 'Not logged in. Access not granted.'
    }
  }catch{
    res.redirect('/login')
    throw 'Not logged in. Access not granted.'
  }
}

exports.isLogged = function(req, res, next){
  try{
    const id = req.session.passport.user
    if(UserModel.isValidUser(id, UserModel.getUsers())){
      next()
    }else{
      res.redirect('/login')
      throw 'Not logged in. Access not granted.'
    }
  }catch{
    res.redirect('/login')
    throw 'Not logged in. Access not granted.'
  }
}

exports.randomInt = function(max, min=0){
  return Math.floor(Math.random()*max) + min
}
exports.isIDExists = function(id, ids){
  return ids.includes(id)
}
exports.createMazeID = function(ids, length=8){
  const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  while(isIDExists(id, ids) || !id.length){
    id = ''
    for(let i = 0; i < length; i++){
      id += char[randomInt(62)]
    }
  }
  return id
}
function isIDExists(id, ids){
  return ids.includes(id)
}
function randomInt(max, min=0){
  return Math.floor(Math.random()*max) + min
}
exports.generateID = (length)=>{
  const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for(let i = 0; i < length; i++){
    id += char[randomInt(62)]
  }
  return id
}