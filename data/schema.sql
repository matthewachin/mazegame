DROP TABLE IF EXISTS log;

CREATE TABLE log (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  user_id TEXT NOT NULL,
  user_type TEXT NOT NULL, 
  _time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  event_type TEXT NOT NULL DEFAULT 'click',
  current_link TEXT NOT NULL,
  event_description TEXT
);

-- DROP TABLE IF EXISTS mazes;
-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS games;
-- DROP TABLE IF EXISTS solves;

-- CREATE TABLE mazes (
--   id TEXT PRIMARY KEY,
--   totalRows INTEGER,
--   totalColumns INTEGER,
--   highestscorer TEXT,
--   highscore INTEGER,
--   title TEXT,
--   creator TEXT,
--   difficulty INTEGER,
--   grid TEXT,
--   FOREIGN KEY(creator) REFERENCES users(id) ON DELETE CASCADE
-- );

-- CREATE TABLE solves (
--   id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
--   userID TEXT,
--   mazeID TEXT,
--   score INTEGER,
--   duration REAL,
--   solveTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY(userID) REFERENCES users(id) ON DELETE CASCADE,
--   FOREIGN KEY(mazeID) REFERENCES mazes(id) ON DELETE CASCADE
-- );

-- CREATE TABLE users (
--   id TEXT PRIMARY KEY,
--   username TEXT,
--   grid_lines INTEGER DEFAULT 1,
--   cell_size INTEGER DEFAULT 15
-- );

-- CREATE TABLE games (
--   id INTEGER PRIMARY KEY AUTOINCREMENT
  
-- );