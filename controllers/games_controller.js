const express = require('express'), app = express.Router()
const MazeModel = require('../models/mazes_model.js'), UserModel = require('../models/users_model.js'), AllModel = require('../models/all_model.js'), LogModel = require('../models/log_model.js')

app.get('/games/modes', (req,res)=>{
  res.render('game/game-list',{
    nav:'complex',
    logged:true,
    user: UserModel.getUser(req.session.passport.user)
  })
})

app.get('/games/results', (req,res)=>{
  res.render('game/results',{
    nav:'complex',
    logged:true,
    user: UserModel.getUser(req.session.passport.user)
  })
})


module.exports = app