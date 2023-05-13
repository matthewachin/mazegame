class Cell {
  constructor(row, col, maze, totalRows, totalColumns) {
    // e = element
    this.row = row;
    this.col = col;
    this.maze = maze
    this.totalRows = totalRows
    this.totalColumns = totalColumns
    this.entrance = false;
    this.userPath = false
    this.mazeEdge = false
    this.rightWall = false;
    this.leftWall = false
    this.bottomWall = false
    this.topWall = false
    this.visited = false
    this.neighbor = false
    this.solved = false
    this.rightPending = false;
    this.leftPending = false
    this.bottomPending = false
    this.topPending = false
    this.rightHover = false;
    this.leftHover = false
    this.bottomHover = false
    this.topHover = false
  }

  // These methods assume that maze variable is a Maze object
  
  isEntrance() {
    return this.entrance
  }

  isUserPath(){
    return this.userPath
  }

  isMazeEdge(){
    return this.mazeEdge
  }
  
  isRightWall() {
    return this.rightWall
  }

  isLeftWall() {
    return this.leftWall
  }

  isBottomWall() {
    return this.bottomWall
  }

  isTopWall() {
    return this.topWall
  }

  isVisited() {
    return this.visited
  }

  isNeighbor() {
    return this.neighbor
  }

  isSolved() {
    return this.solved
  }

  toggleEntrance(force) {
    this.entrance = force
  }

  toggleUserPath(force){
   this.userPath = force
  }

  toggleMazeEdge(force) {
    this.mazeEdge = force
  }

  toggleVisited(force){
    this.visited = force
  }

  toggleNeighbor(force){
    this.neighbor = force
  }

  toggleSolved(force){
    this.solved = force
  }

  toggleRightWall(force) {
    const neighbor = this.getRight()
    neighbor ? neighbor.leftWall= force: null
    this.rightWall = force
  }

  toggleLeftWall(force) {
    const neighbor = this.getLeft()
    neighbor ? neighbor.rightWall= force: null
    this.leftWall = force
  }

  toggleBottomWall(force) {
    const neighbor = this.getBottom()
    neighbor ? neighbor.topWall= force: null
    this.bottomWall = force
  }

  toggleTopWall(force) {
    const neighbor = this.getTop()
    neighbor ? neighbor.bottomWall= force: null
    this.topWall = force
  }

  toggleRightPending(force) {
    const neighbor = this.getRight()
    neighbor ? neighbor.leftPending= force: null
    this.rightPending = force
  }

  toggleLeftPending(force) {
    const neighbor = this.getLeft()
    neighbor ? neighbor.rightPending= force: null
    this.leftPending = force
  }

  toggleBottomPending(force) {
    const neighbor = this.getBottom()
    neighbor ? neighbor.topPending= force: null
    this.bottomPending = force
  }

  toggleTopPending(force) {
    const neighbor = this.getTop()
    neighbor ? neighbor.bottomPending= force: null
    this.topPending = force
  }

  togglePendingCell(force){
    this.pendingCell = force
  }

  toggleRightHover(force) {
    const neighbor = this.getRight()
    neighbor ? neighbor.leftHover= force: null
    this.rightHover = force
  }

  toggleLeftHover(force) {
    const neighbor = this.getLeft()
    neighbor ? neighbor.rightHover= force: null
    this.leftHover = force
  }

  toggleBottomHover(force) {
    const neighbor = this.getBottom()
    neighbor ? neighbor.topHover= force: null
    this.bottomHover = force
  }

  toggleTopHover(force) {
    const neighbor = this.getTop()
    neighbor ? neighbor.bottomHover= force: null
    this.topHover = force
  }

  toggleHoverCell(force){
    this.hoverCell = force
  }

  toggleClass(force, mode, type){
    if(type == 'hover'){
      if(mode == 'top'){
        this.toggleTopHover(force)
      }else if(mode == 'right'){
        this.toggleRightHover(force)
      }else if(mode == 'left'){
        this.toggleLeftHover(force)
      }else if(mode == 'bottom'){
        this.toggleBottomHover(force)
      }
    }else if(type == 'pending'){
      if(mode == 'top'){
        this.toggleTopPending(force)
      }else if(mode == 'right'){
        this.toggleRightPending(force)
      }else if(mode == 'left'){
        this.toggleLeftPending(force)
      }else if(mode == 'bottom'){
        this.toggleBottomPending(force)
      }
    }else if(type == 'wall'){
      if(mode == 'top'){
        this.toggleTopWall(force)
      }else if(mode == 'right'){
        this.toggleRightWall(force)
      }else if(mode == 'left'){
        this.toggleLeftWall(force)
      }else if(mode == 'bottom'){
        this.toggleBottomWall(force)
      }
    }
  }

  hasLeft(isWallValid=false) {
    return isWallValid ? this.col > 0 && !this.isLeftWall() : this.col > 0
  }

  hasRight(isWallValid=false) {
    return isWallValid ? this.col < this.totalColumns - 1 && !this.isRightWall() : this.col < this.totalColumns - 1
  }

  hasBottom(isWallValid=false) {
    return isWallValid ? this.row < this.totalRows - 1 && !this.isBottomWall() : this.row < this.totalRows - 1
  }

  hasTop(isWallValid=false) {
    return isWallValid ? this.row > 0 && !this.isTopWall() : this.row > 0
  }

  getLeft(isWallValid=false) {
    return this.hasLeft(isWallValid) ? this.maze[this.row][this.col - 1] : null;
  }

  getRight(isWallValid=false) {
    return this.hasRight(isWallValid) ? this.maze[this.row][this.col + 1] : null;
  }

  getTop(isWallValid=false) {
    return this.hasTop(isWallValid) ? this.maze[this.row - 1][this.col] : null; 
  }

  getBottom(isWallValid=false) {
    return this.hasBottom(isWallValid) ? this.maze[this.row + 1][this.col] : null;
  }

  isTopNeighbor(row, col){
    return this.row-1 == row && this.col == col
  }

  isBottomNeighbor(row, col){
    return this.row+1 == row && this.col == col
  }

  isRightNeighbor(row, col){
    return this.row == row && this.col+1 == col
  }
  
  isLeftNeighbor(row, col){
    return this.row == row && this.col-1 == col
  }

  getNeighbors(isWallValid=false, withDireciton=false) {
    return withDireciton ? [
      [this.getLeft(isWallValid), 'W'],
      [this.getRight(isWallValid), 'E'],
      [this.getTop(isWallValid), 'N'],
      [this.getBottom(isWallValid), 'S'],
    ].filter((neighbor) => neighbor[0] !== null) : [
      this.getTop(isWallValid),
      this.getLeft(isWallValid),
      this.getRight(isWallValid),
      this.getBottom(isWallValid),
    ].filter((neighbor) => neighbor !== null)
  }

  getRow() {
    return this.row;
  }

  getColumn() {
    return this.col;
  }
  getManhattanDist(endRow, endCol){
    return Math.abs(endRow-this.row) + Math.abs(endCol-this.col)
  }
  getID(){
    return `${this.row}_${this.col}`
  }
  reset(){
    this.toggleTopWall(false)
    this.toggleLeftWall(false)
    this.toggleRightWall(false)
    this.toggleBottomWall(false)
  }
}


function generatePrimMazeInstant(row, col) {
  console.log(row, col,)
  let grid = generateGrid(row, col)
  // console.log(grid)
  let startingCell = grid[0][0]
  let touching = startingCell.getNeighbors(true);
  
  touching.forEach((neighbor) => neighbor.toggleNeighbor(true));
  startingCell.toggleVisited(true);
 
  while (touching.length) {
    const touchingIndex = randomIndex(touching);
    const cell = touching.splice(touchingIndex, 1)[0];
    let neighbors = cell
      .getNeighbors(true)
      .filter((neighbor) => neighbor.isVisited());
    let neighborCount = neighbors.length;
    while (neighborCount > 1) {
      const wallNeighbor = neighbors.splice(randomIndex(neighbors), 1)[0];
      const neighborRow = wallNeighbor.getRow();
      const neighborCol = wallNeighbor.getColumn();
      if (cell.isRightNeighbor(neighborRow, neighborCol)) {
        cell.toggleRightWall(true);
      } else if (cell.isLeftNeighbor(neighborRow, neighborCol)) {
        cell.toggleLeftWall(true);
      } else if (cell.isTopNeighbor(neighborRow, neighborCol)) {
        cell.toggleTopWall(true);
      } else if (cell.isBottomNeighbor(neighborRow, neighborCol)) {
        cell.toggleBottomWall(true);
      }
      neighborCount--;
    }

    cell.toggleVisited(true);
    cell.toggleNeighbor(false);
    const newNeighbors = cell
      .getNeighbors(true)
      .filter((neighbor) => !neighbor.isVisited() && !neighbor.isNeighbor());
    newNeighbors.forEach((neighbor) => neighbor.toggleNeighbor(true));
    touching = touching.concat(newNeighbors);
  }
  return grid
  // setTimeout(()=>{
  //   try{
  //     maze.aStarSolveInstant(showSolution)
  //   }catch{
  //     maze.aStarSolveInstant(false)
  //   }
  // }, 1)
}

function generateGrid(row, col){
  let grid = []
  for(let i = 0; i < row; i++){
    let r = []
    for(let q =0; q< col; q++){
      r.push(new Cell(i, q,grid, row, col))
    }
    grid.push(r)
  }
  for(let i = 0; i < row; i++){
    grid[i][0].toggleLeftWall(true)
    grid[i][0].toggleMazeEdge(true)
    grid[i][col-1].toggleRightWall(true)
    grid[i][col-1].toggleMazeEdge(true)
  }
  for(let q = 0; q< col; q++){
    grid[0][q].toggleTopWall(true)
    grid[0][q].toggleMazeEdge(true)
    grid[row-1][q].toggleBottomWall(true)
    grid[row-1][q].toggleMazeEdge(true)
  }
  grid[0][0].toggleMazeEdge(false)
  grid[0][0].toggleLeftWall(false)
  grid[row-1][col-1].toggleMazeEdge(false)
  grid[row-1][col-1].toggleRightWall(false)
  
  return grid
}
function randomIndex(array) {
  return Math.floor(Math.random() * array.length);
}
function generateObject(maze){
  let object = {
    totalRows: maze.length,
    totalColumns: maze[0].length,
    grid: maze.map((row)=>{
      return row.map((cell)=>{
        let cell_info = []
        if (cell.isTopWall()) {
          cell_info.push(0);
        }
        if (cell.isRightWall()) {
          cell_info.push(1);
        }
        if (cell.isBottomWall()) {
          cell_info.push(2);
        }
        if (cell.isLeftWall()) {
          cell_info.push(3);
        }
        return cell_info;
      })
    }),
  };
  return object;
}


exports.generateMaze = (row, col) =>{
  return generateObject(generatePrimMazeInstant(row,col))
}