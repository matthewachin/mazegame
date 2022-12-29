let maze = new Maze(null);
let timer = new Timer()
const user = {username: 'Matthew Chin'}
timer.on(30)
// time(maze.loadTable(), savedMaze)
// time()
loadNewMaze(JSON.parse(document.getElementById('start-maze-data').innerHTML))