const express = require('express'), app = express.Router()
const MazeModel = require('../models/mazes_model.js'), UserModel = require('../models/users_model.js'), AllModel = require('../models/all_model.js')

app.get('/', (req, res)=> {
  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render("index", {
    nav: 'simple',
    logged : false,
  });
});

app.get('/login', (req, res)=>{
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

app.get('/logout', AllModel.isLogged, (req, res)=>{
  req.session.destroy()
  res.render("logout", {
    nav: 'simple',
    logged:false,
  })
})
module.exports = app