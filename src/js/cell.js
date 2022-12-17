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

  isDownWall() {
    return this.e.classList.contains("downWall");
  }

  isUpWall() {
    return this.e.classList.contains("upWall");
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

  toggleDownWall(force) {
    this.e.classList.toggle("downWall", force);
  }

  toggleUpWall(force) {
    this.e.classList.toggle("upWall", force);
  }

  hasLeft() {
    return this.col > 0 && !this.isLeftWall();
  }

  hasRight() {
    return this.col < maze.totalColumns - 1 && !this.isRightWall();
  }

  hasDown() {
    return this.row < maze.totalRows - 1 && !this.isDownWall();
  }

  hasUp() {
    return this.row > 0 && !this.isUpWall();
  }

  getLeft() {
    return this.hasLeft() ? maze.grid[this.row][this.col - 1] : null;
  }

  getRight() {
    return this.hasRight() ? maze.grid[this.row][this.col + 1] : null;
  }

  getUp() {
    return this.hasUp() ? maze.grid[this.row - 1][this.col] : null;
  }

  getDown() {
    return this.hasDown() ? maze.grid[this.row + 1][this.col] : null;
  }

  getNeighbors() {
    return [
      this.getLeft(),
      this.getRight(),
      this.getUp(),
      this.getDown(),
    ].filter((neighbor) => neighbor !== null);
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
