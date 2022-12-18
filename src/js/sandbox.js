let cellSize = 15

let maze = new Maze(30, 30);

function setCellSize(size){
  cellSize = size;
  document.querySelectorAll('.cell').forEach(function(e){
    e.style.padding = cellSize + 'px'; 
  })
}
maze.generatePrimMaze()