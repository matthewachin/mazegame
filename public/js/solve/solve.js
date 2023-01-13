let maze = new Maze(null);
let timer = new Timer()

const user = JSON.parse(document.getElementById('user').innerHTML)

toggleGrid(false)
setCellSize(user.settings.cell_size)

timer.on(30)
// time(maze.loadTable(), savedMaze)
// time()
loadNewMaze(JSON.parse(document.getElementById('start-maze-data').innerHTML))