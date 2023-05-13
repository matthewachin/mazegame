const express = require('express'), app = express.Router()
const MazeModel = require('../models/mazes_model.js'), UserModel = require('../models/users_model.js'), AllModel = require('../models/all_model.js'), LogModel = require('../models/log_model.js')

app.get('/log', AllModel.isAdmin, async (req,res)=>{
  try{
    LogModel.writeLog(req.session.passport.user, "GET",  `/log`)
  }catch{}
  try{
    console.log('called')
    let _time = false, user_id = false, event_type = false, current_link = false, limit = false;
    if('query' in req){
      _time = 'date' in req.query ? req.query.date : false
      user_id = 'user_id' in req.query ? req.query.user_id : false
      event_type = 'event_type' in req.query ? req.query.event_type : false
      current_link = 'current_link' in req.query ? req.query.current_link : false
      limit = 'limit' in req.query ? req.query.limit : 100
    }
    let data0 = await LogModel.getAllLogs(_time, user_id, event_type, current_link, limit)
    res.render('admin', {
      data: data0.reverse(),
      nav:'complex',
      user:UserModel.getUser(req.session.passport.user),
      logged:true,
      _time: _time,
      user_id: user_id,
      event_type: event_type,
      current_link: current_link,
      limit: limit,
    })  
  }catch(err){
    res.render('error', {
      nav:'simple',
      logged: false,
    })
  }
})
app.post('/log/update', AllModel.isLogged, (req,res ) =>{
  try{
    LogModel.writeLog(req.session.passport.user, "POST",  `/log/update`)
  }catch{}
  
  try{
    LogModel.writeLog(req.session.passport.user, req.body.type, req.body.current_link, req.body.description)
  }catch(err){
    console.log(err)
  }
  res.send('"Success"')
})

module.exports = app
