var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mazeLabs.db');

db.run("PRAGMA foreign_keys = ON;");
const fs = require('fs');
const MazeModel = require('./mazes_model.js'), UserModel = require('./users_model.js'), AllModel = require('./all_model.js')