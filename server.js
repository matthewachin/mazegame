//..............Include Express..................................//
const express = require('express');
// const fs = require('fs');
const ejs = require('ejs');

// const GOOGLE_CLIENT_ID = '652680169371-2pl6q3s84k8bso2remo02uchdbmorjtu.apps.googleusercontent.com'
// const GOOGLE_CLIENT_SECRET = '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'
const session = require('express-session');
const passport = require('passport');
const { json } = require('express');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// const MazeModel = require('./models/mazes_model.js'), UserModel = require('./models/users_model.js'), AllModel = require('./models/all_model.js')
// const cookie_secret = AllModel.createMazeID([], 64)

//..............Create an Express server object..................//
const app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);

//..............Apply Express middleware to the server object....//
app.use(express.json()); //Used to parse JSON bodies (needed for POST reqs)
app.use(express.urlencoded());
app.use(express.static('public')); //specify location of static assests
app.set('views', __dirname + '/views'); //specify location of templates
app.set('view engine', 'ejs'); //specify templating library



// app.use(session({
//   resave: false,
//   saveUninitialized: true,
//   secret: cookie_secret,
//   cookie: {
//     maxAge : 1000 * 60 * 60 * 24 * 3 // 3 days duration
//   } 
// }));
// app.use(passport.initialize());
// app.use(passport.session());

app.set('view engine', 'ejs');

// app.use(require('./controllers/index'));
// app.use(require('./controllers/auth'));
// app.use(require('./controllers/mazes_controller'));
// app.use(require('./controllers/users_controller'));
// app.use(require('./controllers/games_controller'));
// app.use(require('./controllers/log_controller'));

const port = process.env.PORT || 3000;
app.set('port', port)

let socketapi =require('./controllers/socketConnections');
socketapi.io.attach(server);

// app.use("", (req, res)=>{
//   res.status(404);
//   res.setHeader('Content-Type', 'text/html')
//   res.render("error", {
//     "errorCode":"404",
//     nav: 'simple',
//     logged:false,
//   });
// });

//..............Start the server...............................//
// const port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log('Server started at http://localhost:'+port+'.')
});