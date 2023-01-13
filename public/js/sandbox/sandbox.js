const user = JSON.parse(document.getElementById('user').innerHTML)

let generateMazeCount = 0
let maze = new Maze(20, 20);


// enable/disable draw controls
enableDrawControls();
// disableControls()


// TIME_TEST(120, 3)
// maze.generatePrimMazeInstant()
// maze.aStarSolveInstant()