class Cell {
  constructor(e, row, col) {
    // e = element
    this.e = e;
    this.row = row;
    this.col = col;
  }

  // These methods assume that maze variable is a Maze object
  
  isPath() {
    return this.e.classList.contains("path");
  }
  
  isStart() {
    return this.e.classList.contains("start");
  }

  isEnd() {
    return this.e.classList.contains("end");
  }
  
  isRightWall() {
    return this.e.classList.contains("rightWall");
  }

  isLeftWall() {
    return this.e.classList.contains("leftWall");
  }

  isBottomWall() {
    return this.e.classList.contains("bottomWall");
  }

  isTopWall() {
    return this.e.classList.contains("topWall");
  }

  isVisited() {
    return this.e.classList.contains("visited");
  }

  isNeighbor() {
    return this.e.classList.contains('neighbor')
  }

  isSolved() {
    return this.e.classList.contains("solved");
  }
  togglePath(force) {
    this.e.classList.toggle("path", force);
  }

  toggleStart(force) {
    this.e.classList.toggle("start", force);
  }

  toggleEnd(force) {
    this.e.classList.toggle("end", force);
  }

  toggleVisited(force){
    this.e.classList.toggle("visited", force);
  }

  toggleNeighbor(force){
    this.e.classList.toggle('neighbor', force)
  }

  toggleSolved(force){
    this.e.classList.toggle('solved', force)
  }

  toggleRightWall(force) {
    const neighbor = this.getRight()
    neighbor ? neighbor.e.classList.toggle('leftWall', force) : null
    this.e.classList.toggle("rightWall", force);
  }

  toggleLeftWall(force) {
    const neighbor = this.getLeft()
    neighbor ? neighbor.e.classList.toggle('rightWall', force) : null
    this.e.classList.toggle("leftWall", force);
  }

  toggleBottomWall(force) {
    const neighbor = this.getBottom()
    neighbor ? neighbor.e.classList.toggle('topWall', force) : null
    this.e.classList.toggle("bottomWall", force);
  }

  toggleTopWall(force) {
    const neighbor = this.getTop()
    neighbor ? neighbor.e.classList.toggle('bottomWall', force) : null
    this.e.classList.toggle("topWall", force);
  }

  toggleRightPending(force) {
    const neighbor = this.getRight()
    neighbor ? neighbor.e.classList.toggle('leftPending', force) : null
    this.e.classList.toggle("rightPending", force);
  }

  toggleLeftPending(force) {
    const neighbor = this.getLeft()
    neighbor ? neighbor.e.classList.toggle('rightPending', force) : null
    this.e.classList.toggle("leftPending", force);
  }

  toggleBottomPending(force) {
    const neighbor = this.getBottom()
    neighbor ? neighbor.e.classList.toggle('topPending', force) : null
    this.e.classList.toggle("bottomPending", force);
  }

  toggleTopPending(force) {
    const neighbor = this.getTop()
    neighbor ? neighbor.e.classList.toggle('bottomPending', force) : null
    this.e.classList.toggle("topPending", force);
  }

  toggleRightHover(force) {
    const neighbor = this.getRight()
    neighbor ? neighbor.e.classList.toggle('leftHover', force) : null
    this.e.classList.toggle("rightHover", force);
  }

  toggleLeftHover(force) {
    const neighbor = this.getLeft()
    neighbor ? neighbor.e.classList.toggle('rightHover', force) : null
    this.e.classList.toggle("leftHover", force);
  }

  toggleBottomHover(force) {
    const neighbor = this.getBottom()
    neighbor ? neighbor.e.classList.toggle('topHover', force) : null
    this.e.classList.toggle("bottomHover", force);
  }

  toggleTopHover(force) {
    const neighbor = this.getTop()
    neighbor ? neighbor.e.classList.toggle('bottomHover', force) : null
    this.e.classList.toggle("topHover", force);
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
    return isWallValid ? this.col < maze.totalColumns - 1 && !this.isRightWall() : this.col < maze.totalColumns - 1
  }

  hasBottom(isWallValid=false) {
    return isWallValid ? this.row < maze.totalRows - 1 && !this.isBottomWall() : this.row < maze.totalRows - 1
  }

  hasTop(isWallValid=false) {
    return isWallValid ? this.row > 0 && !this.isTopWall() : this.row > 0
  }

  getLeft(isWallValid=false) {
    return this.hasLeft(isWallValid) ? maze.grid[this.row][this.col - 1] : null;
  }

  getRight(isWallValid=false) {
    return this.hasRight(isWallValid) ? maze.grid[this.row][this.col + 1] : null;
  }

  getTop(isWallValid=false) {
    return this.hasTop(isWallValid) ? maze.grid[this.row - 1][this.col] : null; 
  }

  getBottom(isWallValid=false) {
    return this.hasBottom(isWallValid) ? maze.grid[this.row + 1][this.col] : null;
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

  getElement() {
    return this.e;
  }
  getManhattanDist(endRow, endCol){
    return Math.abs(endRow-this.row) + Math.abs(endCol-this.col)
  }
  getID(){
    return `${this.row}_${this.col}`
  }
}
