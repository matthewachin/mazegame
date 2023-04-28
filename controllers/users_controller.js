const express = require('express'), app = express.Router()
const MazeModel = require('../models/mazes_model.js'), UserModel = require('../models/users_model.js'), AllModel = require('../models/all_model.js')

app.get('/users/new', AllModel.isLogged, (req, res)=>{
  res.setHeader('Content-Type', 'text/html')
  res.render("user/create", {
    nav: 'simple',
    logged:true,
  });
})
app.post('/users/new', (req, res)=>{
  const username = req.body.username
  const id = req.session.passport.user
  let userData = UserModel.getUser(id)
  userData.username = username
  UserModel.writeUser(id, userData)
  res.send({
    'type' : 'success',
    'nav' : 'simple',
  })
})

app.get('/users/me', AllModel.isLogged, (req, res)=>{
  const userID = req.session.passport.user
  const userData = UserModel.getUser(userID)
  let mazes = userData.mazes
  mazes = mazes.map((id)=>{
    const mazeData = MazeModel.getMaze(id)
    return {
      id :id, 
      title : mazeData.title,
      totalRows : mazeData.totalRows,
      totalColumns : mazeData.totalColumns,
      difficulty : mazeData.difficulty,
      solves : mazeData.solves,
    }
  })
  res.render('user/profile', {
    user:JSON.stringify(UserModel.getUser(req.session.passport.user)),
    data: mazes,
    nav: 'complex',
    logged: true,
  })
})



app.post('/users/me', (req, res)=>{
  try{
    const changes = req.body
    const userID = req.session.passport.user
    let userData = UserModel.getUser(userID)
    userData.settings.grid_lines = changes.grid_lines
    userData.settings.cell_size = changes.cell_size
    if('username' in changes){
      userData.username = changes.username
      const username = userData.username
      userData.mazes.forEach((mazeID)=>{
        let mazeData = MazeModel.getMaze(mazeID)
        mazeData.creator = username
        MazeModel.writeMaze(mazeID, mazeData)
      })
    }
    UserModel.writeUser(userID, userData)
    res.status(200)
    res.send(JSON.stringify('Successfully updated user info.'))
  }catch{
    res.send(JSON.stringify('Failed to update user info.'))
    res.status(400)
  }
})

module.exports = app