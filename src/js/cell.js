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
    this.e.classList.toggle("rightWall", force);
  }

  toggleLeftWall(force) {
    this.e.classList.toggle("leftWall", force);
  }

  toggleBottomWall(force) {
    this.e.classList.toggle("bottomWall", force);
  }

  toggleTopWall(force) {
    this.e.classList.toggle("topWall", force);
  }

  toggleRightPending(force) {
    this.e.classList.toggle("rightPending", force);
  }

  toggleLeftPending(force) {
    this.e.classList.toggle("leftPending", force);
  }

  toggleBottomPending(force) {
    this.e.classList.toggle("bottomPending", force);
  }

  toggleTopPending(force) {
    this.e.classList.toggle("topPending", force);
  }

  toggleRightHover(force) {
    this.e.classList.toggle("rightHover", force);
  }

  toggleLeftHover(force) {
    this.e.classList.toggle("leftHover", force);
  }

  toggleBottomHover(force) {
    this.e.classList.toggle("bottomHover", force);
  }

  toggleTopHover(force) {
    this.e.classList.toggle("topHover", force);
  }

  hasLeft() {
    return this.col > 0 && !this.isLeftWall();
  }

  hasRight() {
    return this.col < maze.totalColumns - 1 && !this.isRightWall();
  }

  hasBottom() {
    return this.row < maze.totalRows - 1 && !this.isBottomWall();
  }

  hasTop() {
    return this.row > 0 && !this.isTopWall();
  }

  getLeft() {
    return this.hasLeft() ? maze.grid[this.row][this.col - 1] : new Dummy();
  }

  getRight() {
    return this.hasRight() ? maze.grid[this.row][this.col + 1] : new Dummy();
  }

  getTop() {
    return this.hasTop() ? maze.grid[this.row - 1][this.col] : new Dummy();
  }

  getBottom() {
    return this.hasBottom() ? maze.grid[this.row + 1][this.col] : new Dummy();
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
