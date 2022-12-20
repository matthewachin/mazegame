let MAZE_VARIABLES;

class Maze {
  constructor(totalRows, totalColumns) {
    this.totalRows = totalRows;
    this.totalColumns = totalColumns;
    this.e = document.getElementById("main-grid");
    this.grid = this.generateGrid();

    this.resetMazeVars();
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
        cell.setAttribute("draggable", false);
        cell.classList.add("cell", "path", "darkmode");
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

  aStarSolveInstant(
    startingCell = this.grid[0][0],
    endingCell = this.grid[this.totalRows - 1][this.totalColumns - 1]
  ) {
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
    delay = 1,
    startingCell = this.grid[0][0],
    endingCell = this.grid[this.totalRows - 1][this.totalColumns - 1],
  ) {
    this.resetMazeVars();
    if (!delay) {
      this.aStarSolveInstant(startingCell, endingCell);
      return;
    }
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
              delay*10,
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
    }, maze.totalColumns * maze.totalRows * delay + 200);
  }
  generatePrimMazeInstant(startingCell = this.grid[0][0]) {
    let touching = startingCell.getNeighbors();
    this.editClassAll("visited", false);
    this.editClassAll("neighbor", false);
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
    };
  }
  resetMaze(){
    this.editClassAll('visited', false)
    this.editClassAll('neighbor', false)
    this.editClassAll('solved', false)
    this.editClassAll('start', false)
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
  }
  adjustRow(count){
    if(count == this.totalRows){return}
    for(let i =0; i<this.totalColumns; i++){
      this.grid[i][this.totalColumns-1].toggleRightWall(false)
    }
    if(count > this.totalRows){
      const change = this.totalRows-count
      let rowNum = this.totalRows
      for(let i = 0; i < change; i++){
        for(let q = 0; q < this.totalRows; q++ ){
          this.grid[q].push(new Cell())
        }
      }
    }else{
      
    }
  }
  adjustColumn(count){
    if(count > this.totalColumns){

    }else if(count < this.totalColumns){
      
    }
  }
}
function randomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}