class Maze {
  constructor(totalRows, totalColumns) {
    this.totalRows = totalRows;
    this.totalColumns = totalColumns;
    this.e = document.getElementById("main-grid");
    this.grid = this.generateGrid();
    this.touching;
  }

  createHTMLGrid() {
    let table = this.e;
    let type = true;
    this.deleteAllChildren(table);
    for (let row = 0; row < this.totalRows; row++) {
      let rowElement = document.createElement("tr");
      rowElement.setAttribute("id", `row-${row}`);
      type = !(this.totalColumns % 2) ? !type : type;
      for (let col = 0; col < this.totalColumns; col++) {
        let cell = document.createElement("td");
        cell.setAttribute('draggable', false)
        cell.classList.add("cell", "path", 'darkmode');
        // type ? cell.classList.add('cell1') : cell.classList.add('cell2')
        !row ? cell.classList.add("topWall") : null;
        row == this.totalRows - 1 ? cell.classList.add("bottomWall") : null;
        col == this.totalColumns - 1 ? cell.classList.add("rightWall") : null;
        !col ? cell.classList.add("leftWall") : null;

        type = !type;
        cell.setAttribute("id", `${row}_${col}`);
        rowElement.appendChild(cell);
      }
      table.appendChild(rowElement);
    }
  }

  generateGrid() {
    this.createHTMLGrid();
    const grid = [];
    for (let row = 0; row < this.totalRows; row++) {
      grid.push([]);
      for (let col = 0; col < this.totalColumns; col++) {
        const element = document.getElementById(`${row}_${col}`);
        grid[row].push(new Cell(element, row, col));
      }
    }
    return grid;
  }

  generateObject() {
    const object = {
      totalRows: this.totalRows,
      totalColumns: this.totalColumns,
      grid: {},
    };
    for (let row = 0; row < this.totalRows; row++) {
      for (let col = 0; col < this.totalColumns; col++) {
        const id = `${row}_${col}`;
        object.grid[id] = {
          path: this.grid[row][col].isPath(),
          start: this.grid[row][col].isStart(),
          end: this.grid[row][col].isEnd(),
          leftWall: this.grid[row][col].isLeftWall(),
          rightWall: this.grid[row][col].isRightWall(),
          bottomWall: this.grid[row][col].isBottomWall(),
          topWall: this.grid[row][col].isTopWall(),
        };
      }
    }
    return object;
  }

  updateTable(object) {
    for (let row = 0; row < object.totalRows; row++) {
      for (let col = 0; col < object.totalColumns; col++) {
        const id = `${row}_${col}`;
        const element = this.grid[row][col].e;
        const classList = object.grid[id];

        element.className = "";
        this.grid[row][col].togglePath(classList.path);
        this.grid[row][col].toggleStart(classList.start);
        this.grid[row][col].toggleEnd(classList.end);
        this.grid[row][col].toggleLeftWall(classList.leftWall);
        this.grid[row][col].toggleRightWall(classList.rightWall);
        this.grid[row][col].toggleBottomWall(classList.bottomWall);
        this.grid[row][col].toggleTopWall(classList.topWall);
      }
    }
  }

  getTotalRows() {
    return this.totalRows;
  }

  getTotalColumns() {
    return this.totalColumns;
  }

  getGrid() {
    return this.grid;
  }

  deleteAllChildren(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  getCellObject(element){
    const position = element.id.split('_').map(function(cord){
      return Number(cord)
    })
    // position[0] = row, position[1] = cord
    return maze.grid[position[0]][position[1]]
  }

  generatePrimMaze(startingCell=this.grid[0][0], delay=0){
    //? Implement a check that startingCell and endingCell are both touching walls
    if(!delay){
      let touching = startingCell.getNeighbors()
      touching.forEach((neighbor) => neighbor.toggleNeighbor(true))
      this.editAllCells(function(cell){
        cell.toggleVisited(false)
      })
      startingCell.toggleVisited(true)
      while (touching.length){
        const touchingIndex = this.randomIndex(touching)
        const cell = touching.splice(touchingIndex, 1)[0]
        const neighbors = cell.getNeighbors(true).filter((neighbor) => neighbor.isVisited())
        let neighborCount = neighbors.length
        while (neighborCount > 1){
          const wallNeighbor = neighbors[this.randomIndex(neighbors)]
          const neighborRow = wallNeighbor.getRow()
          const neighborCol = wallNeighbor.getColumn()
          if(cell.isRightNeighbor(neighborRow, neighborCol)){
            cell.toggleRightWall(true)
          }else if(cell.isLeftNeighbor(neighborRow, neighborCol)){
            cell.toggleLeftWall(true)
          }else if(cell.isTopNeighbor(neighborRow, neighborCol)){
            cell.toggleTopWall(true)
          }else if(cell.isBottomNeighbor(neighborRow, neighborCol)){
            cell.toggleBottomWall(true)
          }
          neighborCount--
        }
        cell.toggleVisited(true)
        cell.toggleNeighbor(false)
        const newNeighbors = cell.getNeighbors(true).filter((neighbor) => !neighbor.isVisited() && !neighbor.isNeighbor())
        newNeighbors.forEach((neighbor) => neighbor.toggleNeighbor(true))
        touching = touching.concat(newNeighbors)
      }
      this.editAllCells(function(cell){
        cell.toggleVisited(false)
        cell.toggleNeighbor(false)
      })
    }else{
      this.touching = startingCell.getNeighbors()
      this.touching.forEach((neighbor) => neighbor.toggleNeighbor(true))
      this.editAllCells(function(cell){
        cell.toggleVisited(false)
      })
      startingCell.toggleVisited(true)
      for(let i = 0; i < this.totalColumns*this.totalRows-1; i++){
        setTimeout(function(){
          const touchingIndex = maze.randomIndex(maze.touching)
          const cell = maze.touching.splice(touchingIndex, 1)[0]
          const neighbors = cell.getNeighbors(true).filter((neighbor) => neighbor.isVisited())
          let neighborCount = neighbors.length
          while (neighborCount > 1){
            const wallNeighbor = neighbors[maze.randomIndex(neighbors)]
            const neighborRow = wallNeighbor.getRow()
            const neighborCol = wallNeighbor.getColumn()
            if(cell.isRightNeighbor(neighborRow, neighborCol)){
              cell.toggleRightWall(true)
            }else if(cell.isLeftNeighbor(neighborRow, neighborCol)){
              cell.toggleLeftWall(true)
            }else if(cell.isTopNeighbor(neighborRow, neighborCol)){
              cell.toggleTopWall(true)
            }else if(cell.isBottomNeighbor(neighborRow, neighborCol)){
              cell.toggleBottomWall(true)
            }
            neighborCount--
          }
          cell.toggleVisited(true)
          cell.toggleNeighbor(false)
          const newNeighbors = cell.getNeighbors(true).filter((neighbor) => !neighbor.isVisited() && !neighbor.isNeighbor())
          newNeighbors.forEach((neighbor) => neighbor.toggleNeighbor(true))
          maze.touching = maze.touching.concat(newNeighbors)
        }, i*delay)
      }
      setTimeout(function(){
        maze.touching = null
        maze.editAllCells(function(cell){
          cell.toggleVisited(false)
          cell.toggleNeighbor(false)
        })
      }, maze.totalColumns*maze.totalRows*delay+200)
    }
  }

  randomIndex(array){
    return Math.floor(Math.random()*array.length)
  }
  
  editAllCells(f){
    for(let row = 0; row < this.totalRows; row++){
      for(let col = 0; col < this.totalColumns; col++){
        f(this.grid[row][col])
      }
    }
  }
  
  aStarSolve(startingCell=this.grid[0][0], endingCell=this.grid[this.totalRows-1][this.totalColumns-1]){
    let notSolved = true
    let touching = startingCell.getNeighbors()
    // this is  a priority queue made up of arrays [distanceFromStart, manhattan distance, node/cell object]
    let distanceTravelled = 1
    const endRow = endingCell.getRow()
    const endCol = endingCell.getColumn()
    this.editAllCells(function(cell){
      cell.toggleVisited(false) 
      cell.toggleNeighbor(false)
    })
    touching.forEach((neighbor) => neighbor.toggleNeighbor(true))
    touching = touching.map((neighbor) => [1, neighbor.getManhattanDist(endRow, endCol), neighbor])
    touching.sort((a, b) => a[0] - b[0])
    console.log(touching)
    startingCell.toggleVisited(true)
    while (touching.length && notSolved){ 
      const cell_infomation = touching.splice(0,1)[0]
      console.log(2, cell_infomation)
      const cell = cell_infomation[2]
      cell.e.innerHTML = cell_infomation[0]+cell_infomation[1]
      cell.toggleNeighbor(false)
      console.log(3, cell)
      if(cell == endingCell){
        console.log('found')
        cell.toggleVisited(true)
        break
      }
      distanceTravelled = cell_infomation[0]
      const neighbors = cell.getNeighbors(true).filter((neighbor) => !neighbor.isVisited())
      neighbors.forEach((neighbor)=> neighbor.toggleNeighbor(true))
      const neighborsHeuristics = neighbors.map((neighbor)=>[distanceTravelled+1, neighbor.getManhattanDist(endRow, endCol), neighbor])
      neighborsHeuristics.forEach(function(neighborArray){
        neighborArray[2].e.innerHTML = neighborArray[0]+neighborArray[1]
      })
      neighborsHeuristics.forEach((neighborHeuristic)=> this.insertSorted(touching, neighborHeuristic))
      console.log(2, touching)
      cell.toggleVisited(true)
    }
    for(const cell of touching){
      console.log(cell)
    }
  }

  insertSorted(mainArray, smallArray) {
    // Binary search to insert into a sorted array
    let left = 0;
    let right = mainArray.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (mainArray[mid][0]+mainArray[mid][1]< smallArray[0]+smallArray[1]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    const index = left;
    mainArray.splice(index, 0, smallArray);
  }
}
