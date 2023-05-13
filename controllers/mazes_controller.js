const express = require('express'), app = express.Router()
const MazeModel = require('../models/mazes_model.js'), UserModel = require('../models/users_model.js'), AllModel = require('../models/all_model.js'), LogModel = require('../models/log_model.js')
const fs = require('fs')

app.get('/mazes/new', AllModel.isLogged, (req, res)=>{
  try{
    LogModel.writeLog(req.session.passport.user, "GET",  `/mazes/new`)
  }catch{}
  res.status(200)
  res.setHeader('Content-Type', 'text/html')
  const id = req.session.passport.user
  
  res.render('maze/sandbox', {
    user: UserModel.getUser(id),
    nav: 'complex',
    logged: true,
  })
})

app.post('/mazes/new', (req, res) => {
  try{
    LogModel.writeLog(req.session.passport.user, "POST",  `/mazes/new`)
  }catch{}
  try{
    const userID = req.session.passport.user
    let userData = UserModel.getUser(userID)
    let requestData = req.body
    const MazeID = MazeModel.createMaze(requestData)
    userData.mazes.push(MazeID)
    UserModel.writeUser(userID, userData)
    res.status(200)
    res.send(JSON.stringify(`Successfully saved Maze with ID: ${MazeID}`))
  }catch(e){
    res.send(JSON.stringify(e))
  }
})

app.get('/mazes/play/:mazeID', AllModel.isLogged, (req, res)=>{
  try{
    LogModel.writeLog(req.session.passport.user, "GET",  `/mazes/play/${req.params.mazeID}`)
  }catch{}
  try{
    const mazeID = req.params.mazeID
    res.status(200)
    res.setHeader('Content-Type', 'text/html')
    const id = req.session.passport.user
    const user = UserModel.getUser(id)
    res.render('maze/solve', {
      mazeinfo: MazeModel.getMaze(mazeID),
      user: user,
      nav: 'complex',
      logged: true,
      game: false,
    })
  }catch{
    res.redirect('/mazes')
  }
})

app.post('/mazes/play', AllModel.isLogged, (req, res)=>{
  try{
    LogModel.writeLog(req.session.passport.user, "POST",  `/mazes/play`)
  }catch{}
  try{
    const userID = req.session.passport.user
    const requestData = req.body
    const MazeID = requestData.id
    let mazeSavedData = MazeModel.getMaze(MazeID)
    for(property in requestData){
      mazeSavedData[property] = requestData[property]
    }
    MazeModel.writeMaze(MazeID, mazeSavedData)
    let userInfo = UserModel.getUser(userID)
    userInfo.solved.push(MazeID)
    UserModel.writeUser(userID, userInfo)
    res.send(JSON.stringify(`Successfully saved changes to Maze with ID: ${MazeID}`))
  }catch{
    res.send(JSON.stringify('Failed to upload.'))
  }

})

app.get('/mazes', AllModel.isLogged, (req, res)=>{
  try{
    LogModel.writeLog(req.session.passport.user, "GET",  `/mazes`)
  }catch{}
  let count = req.query.count == null ? 25 : req.query.count
  try{
    let mazeIds = MazeModel.getMazeIDs()
    const mazeCount = Math.min(mazeIds.length, count)
    let loadingMazes = []
    for(let i = 0; i < mazeCount; i++){
      const index = AllModel.randomInt(mazeIds.length)
      loadingMazes.push(mazeIds[index])
      mazeIds.splice(index, 1)
    }
    loadingMazes = loadingMazes.map((mazeID)=>{
      const mazeData = MazeModel.getMaze(mazeID)
      return {
        id :mazeID, 
        title : mazeData.title,
        totalRows : mazeData.totalRows,
        totalColumns : mazeData.totalColumns,
        difficulty : mazeData.difficulty,
        solves : mazeData.solves,
        creator : mazeData.creator,
      }
    })
    res.render('maze/maze-list', {
      data: loadingMazes, 
      user: UserModel.getUser(req.session.passport.user),
      nav: 'complex',
      count : count,
      logged:true,
    })
  }catch{
    res.render("error", {
      "errorCode" : '404', 
      nav: 'simple',
      logged:true,
      // TODO: Adjust error code
    })
  }
})

app.post('/mazes/delete', (req,res)=>{
  try{
    LogModel.writeLog(req.session.passport.user, "POST",  `/mazes/delete`)
  }catch{}
  try{
    console.log('received')
    const mazeID = req.body.id
    const userID = req.session.passport.user
    let userData = UserModel.getUser(userID)
    
    if(userData.mazes.includes(mazeID)){
      
      MazeModel.deleteMaze(mazeID,userID, false)
      res.status(200)
    
      res.send(JSON.stringify('success'))
    }else{
      res.status(400)
      res.send(JSON.stringify('Failed, user does not own the maze.'))
    }
  }catch{
    res.status(400)
    res.send(JSON.stringify('failed to delete maze'))
  }
})
module.exports = app