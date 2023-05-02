const fs = require('fs');
const MazeModel = require('./mazes_model.js'), UserModel = require('./users_model.js');
const { Module } = require('module');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data/log.db');

db.run("PRAGMA foreign_keys = ON;")

exports.getAllLogs = async (date=false, user_id=false, event_type=false)=>{
  try{
    const res = await new Promise((resolve, reject) => {
      let where;
      if(date || user_id || event_type){
        where = [[date, '_time'], [user_id, 'user_id'], [event_type, 'event_type']];
        where.filter((l)=>{return l[0];})
        let where2 = where[0][1] == '_time' ? ` WHERE date(${where[0][1]}) = ${where[0][0]}` :  ` WHERE ${where[0][1]} = ${where[0][0]}`
        for(let i = 1; i < where.length; i++){
          where2 += ` AND ${where[i][1]} = ${where[i][0]}`
        }
        where = where2
      }else{
        where = ''
      }
      db.all(`SELECT * FROM log${where}`, function(err, result){
        err ? reject(err) : resolve(result)
        
      })
    })
    return res
  }catch (err){
    console.log(err)
  }
}
exports.getUniqueUsers = async ()=>{
  try{
    const res = await new Promise((resolve, reject) => {
      db.all(`SELECT DISTINCT user_id FROM log`, function(err, result){
        if(err){
          reject(err)
        }else{
          resolve(result)
        }
      })
    })
    return res
  }catch (err){
    console.log(err)
  }
}

exports.writeLog = (user_id, event_type, current_link) =>{
  const type = UserModel.getUser(user_id)['admin'] ? 'admin' : 'user'
  console.log(user_id, type, event_type, current_link)
  db.run(`INSERT INTO log (user_id, user_type, event_type, current_link) VALUES (?,?,?,?)`, 
    user_id, type, event_type, current_link,
  )
}