let cellSize = 15;

let maze = new Maze(23, 44);

function setCellSize(size) {
  cellSize = size;
  document.querySelectorAll(".cell").forEach(function (e) {
    e.style.padding = cellSize + "px";
  });
}

// TIME_TEST(120, 3)
maze.generatePrimMazeInstant()
maze.aStarSolveInstant()


function createMaze(s){
  maze = new Maze(s, s)
}

const sum = (array) => array.reduce((a, b) => {
  return a + b;
});
