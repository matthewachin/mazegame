const express = require('express'), app = express.Router()
const MazeModel = require('../models/mazes_model.js'), UserModel = require('../models/users_model.js'), AllModel = require('../models/all_model.js'), LogModel = require('../models/log_model.js')
const ServerMaze = require('../src/server-maze.js')
app.get('/games/modes', AllModel.isLogged, (req,res)=>{
  LogModel.writeLog(req.session.passport.user, "GET", "/games/modes")
  res.render('game/game-list',{
    nav:'complex',
    logged:true,
    user: UserModel.getUser(req.session.passport.user),
    gameCode: AllModel.generateID(8),
  })
})

app.get('/games/play/:gameCode', AllModel.isLogged, (req,res)=>{
  LogModel.writeLog(req.session.passport.user, "GET", `/games/play/${req.params.gameCode}`)
  res.render("maze/solve", {
    nav:'complex',
    logged:true,
    user: UserModel.getUser(req.session.passport.user),
    game:true,
    mazeinfo: ServerMaze.generateMaze(20,20),
    gameCode: req.params.gameCode,
    userID: req.session.passport.user
  })
})

app.get('/games/results', AllModel.isLogged, (req,res)=>{
  LogModel.writeLog(req.session.passport.user, "GET", `/games/results`)
  res.render('game/results',{
    nav:'complex',
    logged:true,
    user: UserModel.getUser(req.session.passport.user)
  })
})

app.get('/play/:gameCode', (req,res)=>{
  try{
    LogModel.writeLog(req.session.passport.user, "GET",  `/games/play/${req.params.gameCode}`)
  }catch{}
  res.redirect(`/games/play/${req.params.gameCode}`)
})

module.exports = app