const express = require('express'), app = express.Router()
const session = require('express-session');
const passport = require('passport');
const { json } = require('express');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys =require('../config/keys.json')
const GOOGLE_CLIENT_ID = keys.GOOGLE_CLIENT_ID , GOOGLE_CLIENT_SECRET = keys.GOOGLE_CLIENT_SECRET
const MazeModel = require('../models/mazes_model.js'), UserModel = require('../models/users_model.js'), AllModel = require('../models/all_model.js')


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
    let users = UserModel.getUsers()
    const id = req.session.passport.user
    if(UserModel.isValidUser(id, users)){
      res.redirect('/mazes')
    }else{
      UserModel.createUser(id, users)
      res.redirect('/users/new')
    } 
  });

module.exports = app