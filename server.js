//..............Include Express..................................//
const express = require('express');
const fs = require('fs');
const ejs = require('ejs');

const GOOGLE_CLIENT_ID = '652680169371-2pl6q3s84k8bso2remo02uchdbmorjtu.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'
const session = require('express-session');
const passport = require('passport');
const { json } = require('express');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const cookie_secret = createMazeID([], 64)

//..............Create an Express server object..................//
const app = express();

//..............Apply Express middleware to the server object....//
app.use(express.json()); //Used to parse JSON bodies (needed for POST reqs)
app.use(express.urlencoded());
app.use(express.static('src')); //specify location of static assests
app.set('views', __dirname + '/views'); //specify location of templates
app.set('view engine', 'ejs'); //specify templating library

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: cookie_secret,
  cookie: {
    maxAge : 1000 * 60 * 60 * 24 * 3 // 3 days duration
  } 
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/', (req, res)=> {
  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render("index", {
    nav: 'simple',
  });
});

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile.id);
}
));
passport.serializeUser(function(userID, done) {
  done(null, userID);
});

passport.deserializeUser(function(userID, done) {
  done(null, userID)
});
app.get('/auth/google', passport.authenticate('google', { scope : ['profile'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    let users = getUsers()
    const id = req.session.passport.user
    if(isValidUser(id, users)){
      res.redirect('/maze-list')
    }else{
      createUser(id, users)
      res.redirect('/create')
    } 
  });

app.get('/login', (req, res)=>{
  try{
    const id = req.session.passport.user
    res.redirect('/maze-list')
  }catch{
res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render("login", {
    nav: 'simple',
  });
  }
})
app.get('/create', isLogged, (req, res)=>{
  res.setHeader('Content-Type', 'text/html')
  res.render("create", {
    nav: 'simple',
  });
})
app.post('/create', (req, res)=>{
  const username = req.body.username
  const id = req.session.passport.user
  let userData = getUser(id)
  userData.username = username
  writeUser(id, userData)
  res.send({
    'type' : 'success',
    'nav' : 'simple',
  })
})
// app.post('/login', (req, res)=>{
//   try{
//     let users = getUsers()
//     const data = req.body
//     const user = userExists(data, users) 
//     if(user){
//       if(user.password == data.password){
//         res.send({
//           type: 'success',
//           reason: 'success',
//           user: user,
//         })
//         console.log('success')
//         res.status(200)
//       }else{
//         res.status(200)
//         res.send({
//           type : 'failed',
//           reason : 'Incorrect username or password.'
//         })
//       }
//     }else{
//       res.send({
//         type : 'failed',
//         reason : 'Incorrect username or password.'
//       })
//       res.status(200)
//     }
//   }catch{
//     res.send({
//       type : 'failed',
//       reason : 'Internal Server Error.'
//     })
//   }
 
// })

// app.get('/create', (req, res)=>{
//   res.status(200);
//   res.setHeader('Content-Type', 'text/html')
//   res.render("createuser");
// })
// app.post('/create', (req, res)=>{
//   try{
//     let users = getUsers()
//     const data = req.body
//     if(!userExists(data, users)){
//       users.push(data)
//       fs.writeFileSync('data/users.json', JSON.stringify(users))
//       res.send({
//         type: 'success',
//         reason: 'success',
//         user: data
//       })
//     }else{
//       res.send({
//         type: 'failed',
//         reason: 'User already exists',
//       })
//     }
//   }catch{
//     res.send({
//       type: 'failed',
//       reason: 'Internal Server Error.'
//     })
//   }
// })

app.get('/sandbox', isLogged, (req, res)=>{
  res.status(200)
  res.setHeader('Content-Type', 'text/html')
  const id = req.session.passport.user
  const user = getUser(id)
  res.render('sandbox', {
    user: JSON.stringify(user),
    nav: 'complex',
  })
})
app.post('/sandbox', (req, res) => {
  try{
    const userID = req.session.passport.user
    let userData = getUser(userID)
    let requestData = req.body
    const MazeID = createMaze(requestData)
    userData.mazes.push(MazeID)
    writeUser(userID, userData)
    res.status(200)
    res.send(JSON.stringify(`Successfully saved Maze with ID: ${MazeID}`))
  }catch(e){
    res.send(JSON.stringify(e))
  }
})
// app.post('/deleteMaze', (req, res)=>{
//   try{
//     const requestData = req.body
//     deleteMaze(requestData.userID, requestData.mazeID)
//     res.status(200)
//     res.send(JSON.stringify(`Successfully deleted Maze with ID: ${requestData.mazeID}`))
//   }catch(e){
//     res.send(JSON.stringify(e))
//   }
// })
app.get('/solve/:mazeID', isLogged, (req, res)=>{
  try{
    const mazeID = req.params.mazeID
    res.status(200)
    res.setHeader('Content-Type', 'text/html')
    const id = req.session.passport.user
    const user = getUser(id)
    res.render('solve', {
      mazeinfo: JSON.stringify(getMaze(mazeID)),
      user: JSON.stringify(user),
      nav: 'complex',
    })
  }catch{
    res.redirect('/maze-list')
  }
})
app.get('/solve' ,isLogged, (req,res)=>{
  res.redirect('/maze-list')
})
app.post('/solve', isLogged, (req, res)=>{
  // res.redirect('/maze-list')
  try{
    const requestData = req.body
    const MazeID = requestData.id
    let mazeSavedData = getMaze(MazeID)
    for(property in requestData){
      mazeSavedData[property] = requestData[property]
    }
    fs.writeFileSync(`data/mazes/${MazeID}_MAZE.json`, JSON.stringify(mazeSavedData))
    res.send(JSON.stringify(`Successfully saved changes to Maze with ID: ${MazeID}`))
  }catch{
    res.send(JSON.stringify('Failed to upload.'))
  }

})
app.get('/maze-list', isLogged, (req, res)=>{
  try{
    let mazeIds = getMazeIDs()
    const mazeCount = Math.min(mazeIds.length, 20)
    let loadingMazes = []
    for(let i = 0; i < mazeCount; i++){
      const index = randomInt(mazeIds.length)
      loadingMazes.push(mazeIds[index])
      mazeIds.splice(index, 1)
    }
    loadingMazes = loadingMazes.map((mazeID)=>{
      const mazeData = getMaze(mazeID)
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
    res.render('maze-list', {
      data: loadingMazes, 
      user: JSON.stringify(getUser(req.session.passport.user)),
      nav: 'complex',
    })
  }catch{
    res.render("error", {
      "errorCode" : '404', 
      nav: 'simple',
      // TODO: Adjust error code
    })
  }
})

app.get('/profile', isLogged, (req, res)=>{
  const userID = req.session.passport.user
  const userData = getUser(userID)
  let mazes = userData.mazes
  mazes = mazes.map((id)=>{
    const mazeData = getMaze(id)
    return {
      id :id, 
      title : mazeData.title,
      totalRows : mazeData.totalRows,
      totalColumns : mazeData.totalColumns,
      difficulty : mazeData.difficulty,
      solves : mazeData.solves,
    }
  })
  res.render('profile', {
    user:JSON.stringify(getUser(req.session.passport.user)),
    data: mazes,
    nav: 'complex',
  })
})

app.get('/logout', isLogged, (req, res)=>{
  req.session.destroy()
  res.render("logout", {
    nav: 'simple',
  })
})

app.post('/profile', (req, res)=>{
  try{
    const changes = req.body
    const userID = req.session.passport.user
    let userData = getUser(userID)
    userData.settings.grid_lines = changes.grid_lines
    userData.settings.cell_size = changes.cell_size
    if('username' in changes){
      userData.username = changes.username
      const username = userData.username
      userData.mazes.forEach((mazeID)=>{
        let mazeData = getMaze(mazeID)
        mazeData.creator = username
        writeMaze(mazeID, mazeData)
      })
    }
    writeUser(userID, userData)
    res.status(200)
    res.send(JSON.stringify('Success'))
  }catch{
    res.send(JSON.stringify('Failed to update user info.'))
    res.status(400)
  }
})

app.post('/deleteMaze', (req,res)=>{
  try{
    const mazeID = req.body.id
    const userID = req.session.passport.user
    let userData = getUser(userID)
    if(userData.mazes.includes(mazeID)){
      let MazeIDs = JSON.parse(fs.readFileSync('data/mazeList.json'))
      MazeIDs.splice(MazeIDs.indexOf(mazeID), 1)
      userData.mazes.splice(userData.mazes.indexOf(mazeID), 1)
      fs.writeFileSync('data/mazeList.json', JSON.stringify(MazeIDs))
      fs.unlinkSync(`data/mazes/${mazeID}_MAZE.json`)
      writeUser(userID, userData)
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

// Because routes/middleware are applied in order,
// this will act as a default error route in case of
// a req fot an invalid route
app.use("", (req, res)=>{
  res.status(404);
  res.setHeader('Content-Type', 'text/html')
  res.render("error", {
    "errorCode":"404",
    nav: 'simple',
  });
});

//..............Start the server...............................//
const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Server started at http://localhost:'+port+'.')
});


function createMaze(mazeObj){
  let MazeIDs;
  try{
    MazeIDs = JSON.parse(fs.readFileSync('data/mazeList.json'))
    const MazeID = createMazeID(MazeIDs)
    mazeObj.id = MazeID
    fs.writeFileSync(`data/mazes/${MazeID}_MAZE.json`, JSON.stringify(mazeObj))
    MazeIDs.push(MazeID)
    fs.writeFileSync('data/mazeList.json', JSON.stringify(MazeIDs))
    return MazeID
  }catch{
    fs.writeFileSync('data/mazeList.json', JSON.stringify(MazeIDs))
    throw 'ERROR: Failed to save maze.'
  }
}

function createMazeID(ids, length=8){
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
function isValidUser(id, ids){
  return ids.includes(id)
}
function getMaze(id){
  return JSON.parse(fs.readFileSync(`data/mazes/${id}_MAZE.json`))
}
function getUser(id){
  return JSON.parse(fs.readFileSync(`data/users/${id}.json`))
}
function getMazeIDs(){
  return JSON.parse(fs.readFileSync('data/mazeList.json'))
}
function getUsers(){
  return JSON.parse(fs.readFileSync('data/usersList.json'))
}

function createUser(id, users){
  let newUser = {
    username : null,
    mazes : [],
    solved : {
      // mazeID : score
    },
    settings : {
      grid_lines : true,
      cell_size : 15,
    }
  }
  fs.writeFileSync(`data/users/${id}.json`, JSON.stringify(newUser))
  users.push(id)
  fs.writeFileSync(`data/usersList.json`, JSON.stringify(users))
}
function writeUser(id, userData){
  fs.writeFileSync(`data/users/${id}.json`,JSON.stringify(userData))
}
function writeMaze(id, mazeData){
  fs.writeFileSync(`data/mazes/${id}_MAZE.json`, JSON.stringify(mazeData))
}
function isLogged(req, res, next){
  try{
    const id = req.session.passport.user
    if(isValidUser(id, getUsers())){
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
function usernameChange(username){

}