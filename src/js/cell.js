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

  hasLeft() {
    return this.col > 0
  }

  hasRight() {
    return this.col < maze.totalColumns - 1
  }

  hasBottom() {
    return this.row < maze.totalRows - 1
  }

  hasTop() {
    return this.row > 0
  }

  getLeft() {
    return this.hasLeft() ? maze.grid[this.row][this.col - 1] : null;
  }

  getRight() {
    return this.hasRight() ? maze.grid[this.row][this.col + 1] : null;
  }

  getTop() {
    return this.hasTop() ? maze.grid[this.row - 1][this.col] : null; 
  }

  getBottom() {
    return this.hasBottom() ? maze.grid[this.row + 1][this.col] : null;
  }

  getNeighbors() {
    return [
      this.getLeft(),
      this.getRight(),
      this.getTop(),
      this.getBottom(),
    ].filter((neighbor) => !neighbor instanceof Dummy);
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
}
