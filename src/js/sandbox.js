let cellSize = 15

let maze = new Maze(20, 20);
console.log(maze.grid[0][19].e.getBoundingClientRect());
console.log(maze.grid);

function setCellSize(size){
  cellSize = size;
  document.querySelectorAll('.cell').forEach(function(e){
    e.style.padding = cellSize + 'px'; 
  })
}