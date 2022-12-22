let MAZE_VARIABLES;

class Maze {
  constructor(totalRows, totalColumns) {
    this.totalRows = totalRows;
    this.totalColumns = totalColumns;
    this.e = document.getElementById("main-grid");
    this.grid = this.generateGrid(true);

    this.resetMazeVars();
  }
  resetTableElement(){
    document.getElementById('main-grid').remove()
    const newTable = document.createElement('table')
    newTable.setAttribute('id', 'main-grid')
    document.getElementById('main-grid-div').appendChild(newTable)
    this.e = newTable
  }
  createHTMLGrid() {
    let table = this.e;
    // let type = true;
    this.deleteAllChildren(table);
    for (let row = 0; row < this.totalRows; row++) {
      let rowElement = document.createElement("tr");
      rowElement.setAttribute("id", `row-${row}`);
      // type = !(this.totalColumns % 2) ? !type : type;
      for (let col = 0; col < this.totalColumns; col++) {
        let cell = document.createElement("td");
        cell.setAttribute("draggable", false);
        cell.classList.add("cell");
        // type ? cell.classList.add('cell1') : cell.classList.add('cell2')
        !row ? cell.classList.add("topWall", "mazeEdge"): null;
        row == this.totalRows - 1 ? cell.classList.add("bottomWall", "mazeEdge") : null;
        col == this.totalColumns - 1 ? cell.classList.add("rightWall", "mazeEdge") : null;
        !col ? cell.classList.add("leftWall", "mazeEdge") : null;

        // type = !type;
        cell.setAttribute("id", `${row}_${col}`);
        rowElement.appendChild(cell);
      }
      table.appendChild(rowElement);
    }
  }

  generateGrid(newMaze=false) {
    this.createHTMLGrid();
    const grid = [];
    for (let row = 0; row < this.totalRows; row++) {
      grid.push([]);
      for (let col = 0; col < this.totalColumns; col++) {
        const element = document.getElementById(`${row}_${col}`);
        grid[row].push(new Cell(element, row, col));
      }
    }
    if(newMaze){
      grid[0][0].e.classList.remove('topWall')
      grid[0][0].e.classList.add('entrance')
      grid[this.totalRows-1][this.totalColumns-1].e.classList.remove('bottomWall')
      grid[this.totalRows-1][this.totalColumns-1].e.classList.add('entrance')
    }
    return grid;
  }

  generateObject() {
    const object = {
      totalRows: this.totalRows,
      totalColumns: this.totalColumns,
      grid: [],
    };
    const grid = object.grid
    for (let row = 0; row < this.totalRows; row++) {
      grid.push([])
      for (let col = 0; col < this.totalColumns; col++) {
        grid[row].push({
          l: this.grid[row][col].isLeftWall(),
          // left
          r: this.grid[row][col].isRightWall(),
          // right
          b: this.grid[row][col].isBottomWall(),
          // bottom
          t: this.grid[row][col].isTopWall(),
          // top
        })
      }
    }
    return object;
  }

  loadTable(object) {
    this.resetTableElement()
    this.grid = []
    this.totalRows = object.totalRows
    this.totalColumns = object.totalColumns
    for (let row = 0; row < object.totalRows; row++) {
      this.grid.push([])
      const rowElement = document.createElement('tr')
      rowElement.setAttribute('id', `row-${row}`)
      for (let col = 0; col < object.totalColumns; col++) {
        
        const id = `${row}_${col}`;
        const cell_info = object.grid[row][col]
        const cell_element = document.createElement('td')
        cell_element.classList.add("cell");
        cell_element.setAttribute('id', id)
        cell_info.l ? cell_element.classList.add('leftWall') : null
        cell_info.r ? cell_element.classList.add('rightWall') : null
        cell_info.b ? cell_element.classList.add('bottomWall') : null
        cell_info.t ? cell_element.classList.add('topWall') : null
        rowElement.appendChild(cell_element)
        this.grid[row].push(new Cell(cell_element, row, col))

      }
      this.e.appendChild(rowElement)
    }
    for(let row = 0; row < this.totalRows; row++){
      const left = this.grid[row][0]
      const right = this.grid[row][this.totalColumns-1]
      !left.isLeftWall() ? left.e.classList.add('mazeEdge', 'entrance') : left.e.classList.add('mazeEdge')
      !right.isRightWall() ? right.e.classList.add('mazeEdge', 'entrance') : right.e.classList.add('mazeEdge')
    }
    for(let col = 0; col < this.totalColumns; col++){
      const top = this.grid[0][col]
      const bottom = this.grid[this.totalRows-1][col]
      !top.isTopWall() ? top.e.classList.add('mazeEdge', 'entrance') : top.e.classList.add('mazeEdge')
      !bottom.isBottomWall() ? top.e.classList.add('mazeEdge', 'entrance') : top.e.classList.add('mazeEdge')
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

  getCellObject(element) {
    const position = element.id.split("_").map(function (cord) {
      return Number(cord);
    });
    // position[0] = row, position[1] = cord
    return this.grid[position[0]][position[1]];
  }

  editAllCells(f) {
    for (let row = 0; row < this.totalRows; row++) {
      for (let col = 0; col < this.totalColumns; col++) {
        f(this.grid[row][col]);
      }
    }
  }

  aStarSolveInstant() {
    const entranceCells = Array.from(document.getElementsByClassName('entrance'))
    this.editClassAll("solved", false);
    if(entranceCells.length !== 2){
      displayFeedback('Mazes must have 2 entrances.', 'bad', true)
      return
    }
    const startingCell = this.getCellObject(entranceCells[0])
    const endingCell = this.getCellObject(entranceCells[1])
    this.resetMazeVars();
    let notSolved = true;
    let touching = startingCell.getNeighbors();
    // this is  a priority queue made up of arrays [distanceFromStart, manhattan distance, node/cell object]
    let distanceTravelled = 1;
    let cell_data = {};
    const endRow = endingCell.getRow();
    const endCol = endingCell.getColumn();
    this.editClassAll("visited", false);
    this.editClassAll("neighbor", false);
    touching.forEach((neighbor) => neighbor.toggleNeighbor(true));
    touching.forEach(function (n) {
      cell_data[n.getID()] = {
        // d is the distance from start
        d: distanceTravelled,
        // m is the manhattan distance from this cell to end
        m: n.getManhattanDist(endRow, endCol),
        // p is the parent cell which the cell came from
        p: startingCell.getID(),
      };
    });
    touching.sort(function (a, b) {
      const aH = cell_data[a.getID()];
      const bH = cell_data[b.getID()];
      return aH.d + aH.m - bH.d - bH.m;
    });
    startingCell.toggleVisited(true);

    while (touching.length && notSolved) {
      const cell = touching.splice(0, 1)[0];
      const cellID = cell.getID();
      const cell_infomation = cell_data[cellID];
      cell.toggleNeighbor(false);
      if (cell == endingCell) {
        cell.toggleVisited(true);
        notSolved = false;
        break;
      }
      distanceTravelled = cell_infomation.d;
      const neighbors = cell
        .getNeighbors(true)
        .filter((neighbor) => !neighbor.isVisited());
      neighbors.forEach(function (neighbor) {
        const neighborID = neighbor.getID();
        const newDistance = distanceTravelled + 1;
        const manhattanDistance = neighbor.getManhattanDist(endRow, endCol);
        if (neighbor.isNeighbor()) {
          let neighborInfo = cell_data[neighborID];
          if (
            neighborInfo.d + neighborInfo.m >
            newDistance + manhattanDistance
          ) {
            cell_data[neighborID] = {
              // d is the distance from start
              d: newDistance,
              // m is the manhattan distance from this cell to end
              m: manhattanDistance,
              // p is the parent cell which the cell came from
              p: cellID,
            };
            touching.splice(touching.indexOf(neighbor), 1);
            maze.insertSorted(touching, neighbor, cell_data);
          }
          // compares heuristic values
        } else {
          cell_data[neighborID] = {
            // d is the distance from start
            d: newDistance,
            // m is the manhattan distance from this cell to end
            m: manhattanDistance,
            // p is the parent cell which the cell came from
            p: cellID,
          };
        }
      });
      neighbors
        .filter((n) => !n.isNeighbor())
        .forEach((neighbor_cell) =>
          this.insertSorted(touching, neighbor_cell, cell_data)
        );
      neighbors.forEach((neighbor) => neighbor.toggleNeighbor(true));
      cell.toggleVisited(true);
    }
    if (!notSolved) {
      endingCell.toggleSolved(true);
      let cell = endingCell;
      let lastID = endingCell.getID();
      let path = [endingCell];
      while (cell !== startingCell) {
        const newCellID = cell_data[lastID].p;
        cell = this.getCellByID(newCellID);
        cell.toggleSolved(true);
        path.push(cell);
        lastID = newCellID;
      }
    } else {
      console.log("not solvable");
    }
    this.editClassAll("visited", false);
    this.editClassAll("neighbor", false);
  }

  aStarSolve(
    delay = 0,
  ) {
    this.resetMazeVars();
    if (!delay) {
      this.aStarSolveInstant(startingCell, endingCell);
      return;
    }
    this.editClassAll("solved", false);
    const entranceCells = Array.from(document.getElementsByClassName('entrance'))
    if(entranceCells.length !== 2){
      displayFeedback('Mazes must have 2 entrances.', 'bad', true)
      return
    }
    const startingCell = this.getCellObject(entranceCells[0])
    const endingCell = this.getCellObject(entranceCells[1])
    let touching = startingCell.getNeighbors();
    // this is  a priority queue made up of arrays [distanceFromStart, manhattan distance, node/cell object]
    let distanceTravelled = 1;
    let cell_data = {};
    const endRow = endingCell.getRow();
    const endCol = endingCell.getColumn();
    this.editClassAll("visited", false);
    this.editClassAll("neighbor", false);
    this.editClassAll("solved", false);
    touching.forEach((neighbor) => neighbor.toggleNeighbor(true));
    touching.forEach(function (n) {
      cell_data[n.getID()] = {
        // d is the distance from start
        d: distanceTravelled,
        // m is the manhattan distance from this cell to end
        m: n.getManhattanDist(endRow, endCol),
        // p is the parent cell which the cell came from
        p: startingCell.getID(),
      };
    });
    touching.sort(function (a, b) {
      const aH = cell_data[a.getID()];
      const bH = cell_data[b.getID()];
      return aH.d + aH.m - bH.d - bH.m;
    });
    startingCell.toggleVisited(true);
    MAZE_VARIABLES.notSolved = true;
    let interval = setInterval(
      function (touching, cell_data, startingCell, endingCell) {
        if (!(touching.length && MAZE_VARIABLES.notSolved)) {
          clearInterval(interval);
          if (!MAZE_VARIABLES.notSolved) {
            maze.editClassAll("visited", false);
            maze.editClassAll("neighbor", false);
            endingCell.toggleSolved(true);
            MAZE_VARIABLES.solve_cell = endingCell;
            MAZE_VARIABLES.lastID = endingCell.getID();
            MAZE_VARIABLES.path = [endingCell];
            MAZE_VARIABLES.solvingPath = setInterval(
              function (startingCell, cell_data) {
                if (MAZE_VARIABLES.solve_cell == startingCell) {
                  clearInterval(MAZE_VARIABLES.solvingPath);
                } else {
                  const newCellID = cell_data[MAZE_VARIABLES.lastID].p;
                  MAZE_VARIABLES.solve_cell = maze.getCellByID(newCellID);
                  MAZE_VARIABLES.solve_cell.toggleSolved(true);
                  MAZE_VARIABLES.path.push(MAZE_VARIABLES.solve_cell);
                  MAZE_VARIABLES.lastID = newCellID;
                }
              },
              delay,
              startingCell,
              cell_data
            );
          } else {
            console.log("not solvable");
          }
        } else {
          const cell = touching.splice(0, 1)[0];
          const cellID = cell.getID();
          const cell_infomation = cell_data[cellID];
          cell.toggleNeighbor(false);
          if (cell == endingCell) {
            cell.toggleVisited(true);
            MAZE_VARIABLES.notSolved = false;
          }
          distanceTravelled = cell_infomation.d;
          const neighbors = cell
            .getNeighbors(true)
            .filter((neighbor) => !neighbor.isVisited());
          neighbors.forEach(function (neighbor) {
            const neighborID = neighbor.getID();
            const newDistance = distanceTravelled + 1;
            const manhattanDistance = neighbor.getManhattanDist(endRow, endCol);
            if (neighbor.isNeighbor()) {
              let neighborInfo = cell_data[neighborID];
              if (
                neighborInfo.d + neighborInfo.m >
                newDistance + manhattanDistance
              ) {
                cell_data[neighborID] = {
                  // d is the distance from start
                  d: newDistance,
                  // m is the manhattan distance from this cell to end
                  m: manhattanDistance,
                  // p is the parent cell which the cell came from
                  p: cellID,
                };
                touching.splice(touching.indexOf(neighbor), 1);
                maze.insertSorted(touching, neighbor, cell_data);
              }
              // compares heuristic values
            } else {
              cell_data[neighborID] = {
                // d is the distance from start
                d: newDistance,
                // m is the manhattan distance from this cell to end
                m: manhattanDistance,
                // p is the parent cell which the cell came from
                p: cellID,
              };
            }
          });
          neighbors
            .filter((n) => !n.isNeighbor())
            .forEach((neighbor_cell) =>
              maze.insertSorted(touching, neighbor_cell, cell_data)
            );
          neighbors.forEach((neighbor) => neighbor.toggleNeighbor(true));
          cell.toggleVisited(true);
        }
      },
      delay,
      touching,
      cell_data,
      startingCell,
      endingCell
    );
  }

  editClassAll(className, force) {
    Array.from(document.getElementsByClassName(className)).forEach((e) =>
      e.classList.toggle(className, force)
    );
  }

  insertSorted(mainArray, small_cell, cell_data) {
    // Binary search to insert into a sorted array
    let left = 0;
    let right = mainArray.length - 1;
    const small_data = cell_data[small_cell.getID()];
    const small_weight = small_data.d + small_data.m;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const middle_data = cell_data[mainArray[mid].getID()];
      if (middle_data.m + middle_data.d < small_weight) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    const index = left;
    mainArray.splice(index, 0, small_cell);
  }

  generatePrimMaze(delay = 1, startingCell = this.grid[Math.floor(Math.random()*this.totalRows)][Math.floor(Math.random()*this.totalColumns)]) {
    this.resetMazeVars();
    //? Implement a check that startingCell and endingCell are both touching walls

    //? ways to optimize
    // - finding direction of neighbor in getNeighbors function

    if (!delay) {
      this.generatePrimMazeInstant(startingCell);
      return;
    }
    MAZE_VARIABLES.touching = startingCell.getNeighbors();
    this.editClassAll("visited", false);
    this.editClassAll("neighbor", false);
    this.editClassAll("solved", false);
    MAZE_VARIABLES.touching.forEach((neighbor) => neighbor.toggleNeighbor(true));
    startingCell.toggleVisited(true);
    for (let i = 0; i < this.totalColumns * this.totalRows - 1; i++) {
      setTimeout(function () {
        const touchingIndex = randomIndex(MAZE_VARIABLES.touching);
        const cell = MAZE_VARIABLES.touching.splice(touchingIndex, 1)[0];
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
          .filter(
            (neighbor) => !neighbor.isVisited() && !neighbor.isNeighbor()
          );
        newNeighbors.forEach((neighbor) => neighbor.toggleNeighbor(true));
        MAZE_VARIABLES.touching = MAZE_VARIABLES.touching.concat(newNeighbors);
      }, i * delay);
    }
    setTimeout(function () {
      MAZE_VARIABLES.touching = null;
      maze.editClassAll("visited", false);
      maze.editClassAll("neighbor", false);
      setTimeout(()=>{
        showSolution ? maze.aStarSolveInstant() : null
      }, 5) 
    }, maze.totalColumns * maze.totalRows * delay + 200);
  }
  generatePrimMazeInstant(startingCell = this.grid[0][0]) {
    let touching = startingCell.getNeighbors();
    this.editClassAll("visited", false);
    this.editClassAll("neighbor", false);
    this.editClassAll("solved", false);
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
    this.editClassAll("visited", false);
    this.editClassAll("neighbor", false);
    setTimeout(()=>{
      showSolution ? maze.aStarSolveInstant() : null
    }, 3)  
  }

  getCellByID(id) {
    const row_col = id.split("_");
    return this.grid[row_col[0]][row_col[1]];
  }
  resetMazeVars() {
    MAZE_VARIABLES = {
      touching: null,
      notSolved: null,
      solvingPath: null,
      lastID: null,
      solve_cell: null,
      path: null,
      finished: false,
    };
  }
  resetMaze(){
    this.editClassAll('visited', false)
    this.editClassAll('neighbor', false)
    this.editClassAll('solved', false)
    this.editClassAll('entrance', false)
    this.editClassAll('rightWall', false)
    this.editClassAll('rightPending', false)
    this.editClassAll('rightHover', false)
    this.editClassAll('leftWall', false)
    this.editClassAll('leftPending', false)
    this.editClassAll('leftHover', false)
    this.editClassAll('topWall', false)
    this.editClassAll('topPending', false)
    this.editClassAll('topHover', false)
    this.editClassAll('bottomWall', false)
    this.editClassAll('bottomPending', false)
    this.editClassAll('bottomHover', false)
    for(let i = 0; i < this.totalRows; i++){
      this.grid[i][0].toggleLeftWall(true)
      this.grid[i][this.totalColumns-1].toggleRightWall(true)
    }
    for(let i = 0; i < this.totalColumns; i++){
      this.grid[0][i].toggleTopWall(true)
      this.grid[this.totalRows-1][i].toggleBottomWall(true)
    }
    this.grid[0][0].e.classList.remove('topWall')
    this.grid[0][0].e.classList.add('entrance')
    this.grid[this.totalRows-1][this.totalColumns-1].e.classList.remove('bottomWall')
    this.grid[this.totalRows-1][this.totalColumns-1].e.classList.add('entrance')
  }
  adjustRow(count){
    if(count == this.totalRows){return}
    for(let i =0; i<this.totalColumns; i++){
      const cell = this.grid[this.totalRows-1][i]
      cell.toggleBottomWall(false)
      cell.toggleMazeEdge(false)
      if(cell.isEntrance()){
        i == this.totalColumns-1 && cell.isRightWall() ? null : cell.toggleEntrance(false)
      }
    }
    if(count > this.totalRows){
      const change = count-this.totalRows
      for(let i = 0; i < change; i++){
        let newRow = document.createElement("tr");
        newRow.setAttribute("id", `row-${this.totalRows}`);
        let newRowArray = []
        for(let col = 0; col < this.totalColumns; col++){
          let cell = document.createElement('td')
          cell.setAttribute("draggable", false);
          cell.classList.add("cell");
          cell.setAttribute('id', `${this.totalRows}_${col}`)
          this.totalRows == count - 1 ? cell.classList.add("bottomWall", "mazeEdge") : null;
          col == this.totalColumns - 1 ? cell.classList.add("rightWall", "mazeEdge") : null;
          !col ? cell.classList.add("leftWall", "mazeEdge") : null;
          newRow.appendChild(cell)
          newRowArray.push(new Cell(cell, this.totalRows, col))
        }
        this.e.appendChild(newRow)
        this.grid.push(newRowArray)
        this.totalRows++
      }
    }else{
      const change = this.totalRows-count
      for(let i = 0; i < change; i++){
        this.totalRows--
        this.e.deleteRow(this.totalRows)
        this.grid.pop()
      }
      for(let col= 0; col < this.totalColumns; col++){
        this.grid[this.totalRows-1][col].toggleBottomWall(true)
      }
    }
  }
  adjustColumn(count){
    if(count == this.totalColumns){return}
    for(let i = 0; i < this.totalRows; i++){
      const cell = this.grid[i][this.totalColumns-1]
      cell.toggleRightWall(false)
      cell.toggleMazeEdge(false)
      if(cell.isEntrance()){
        i == this.totalRows-1 && cell.isBottomWall() ? null : cell.toggleEntrance(false)
      }
    }
    if(count > this.totalColumns){
      const change = count-this.totalColumns
      for(let i = 0; i < change; i++){
        for(let row = 0; row< this.totalRows; row++){
          const cell = document.createElement('td')
          cell.setAttribute("draggable", false);
          cell.classList.add("cell");
          cell.setAttribute('id', `${row}_${this.totalColumns}`)
          !row ? cell.classList.add("topWall", "mazeEdge") : null;
          row == this.totalRows - 1 ? cell.classList.add("bottomWall", "mazeEdge") : null;
          this.totalColumns == count-1 ? cell.classList.add("rightWall", "mazeEdge") : null;
          document.getElementById(`row-${row}`).appendChild(cell)
          this.grid[row].push(new Cell(cell, row, this.totalColumns))
        }
        this.totalColumns++
      }
    }else{
      const change = this.totalColumns-count
      for(let i = 0; i < change; i++){
        this.totalColumns--
        for(let row =0; row < this.totalRows; row++){
          const cell = this.grid[row].pop()
          cell.e.remove()
        }
      }
      for(let row= 0; row < this.totalRows; row++){
        this.grid[row][this.totalColumns-1].toggleRightWall(true)
      }
    }
  }
}
function randomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}