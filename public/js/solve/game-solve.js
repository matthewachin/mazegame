let maze = new Maze(null);

const user = JSON.parse(document.getElementById('user').innerHTML)

toggleGrid(false)
setCellSize(user.settings.cell_size)

// loadNewMaze(JSON.parse(document.getElementById('start-maze-data').innerHTML))