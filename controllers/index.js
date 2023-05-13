const express = require('express'), app = express.Router()
const MazeModel = require('../models/mazes_model.js'), UserModel = require('../models/users_model.js'), AllModel = require('../models/all_model.js'), LogModel = require('../models/log_model.js')

app.get('/', (req, res)=> {
  try{
    LogModel.writeLog(req.session.passport.user, "GET",  `/`)
  }catch{}
  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render("index", {
    nav: 'simple',
    logged : false,
  });
});

app.get('/login', (req, res)=>{
  try{
    LogModel.writeLog(req.session.passport.user, "GET",  `/login`)
  }catch{}
  try{
    const id = req.session.passport.user
    res.redirect('/mazes')
  }catch{
res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render("login", {
    nav: 'simple',
    logged : false,
  });
  }
})

app.get('/logout', (req, res)=>{
  try{
    LogModel.writeLog(req.session.passport.user, "GET",  `/logout`)
  }catch{}
  try{
    req.session.destroy()
    res.render("logout", {
      nav: 'simple',
      logged:false,
    })
  }catch{
    res.redirect('/')
  }
})
module.exports = app