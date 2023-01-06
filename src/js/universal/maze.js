let MAZE_VARIABLES;

class Maze {
  constructor(totalRows, totalColumns) {
    if (!(totalRows == null)) {
      this.totalRows = totalRows;
      this.totalColumns = totalColumns;
      this.e = document.getElementById("main-grid");
      this.grid = this.generateGrid(true);
      this.solution;
      this.turns;
      this.highestscorer = '';
      this.highscore = 0;
      this.title = "Anonymous Maze";
      this.creator = user.username || 'Anonymouse User'; //TODO: user.username
      this.solves = 0;
      this.difficulty = null;
      this.wallcount;
      this.resetMazeVars();
      setTimeout(() => maze.aStarSolveInstant(false), 5);
    } else {
      this.e = document.getElementById("main-grid");
      this.totalRows;
      this.totalColumns;
      this.grid;
      this.solution;
      this.turns;
      this.highestscorer;
      this.highscore;
      this.title;
      this.creator;
      this.solves;
      this.difficulty;
      this.wallcount;
    }
  }
  resetTableElement() {
    document.getElementById("main-grid").remove();
    const newTable = document.createElement("table");
    newTable.setAttribute("id", "main-grid");
    document.getElementById("main-grid-div").appendChild(newTable);
    this.e = newTable;
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
        !row ? cell.classList.add("topWall", "mazeEdge") : null;
        row == this.totalRows - 1
          ? cell.classList.add("bottomWall", "mazeEdge")
          : null;
        col == this.totalColumns - 1
          ? cell.classList.add("rightWall", "mazeEdge")
          : null;
        !col ? cell.classList.add("leftWall", "mazeEdge") : null;

        // type = !type;
        cell.setAttribute("id", `${row}_${col}`);
        rowElement.appendChild(cell);
      }
      table.appendChild(rowElement);
    }
  }

  generateGrid(newMaze = false) {
    this.createHTMLGrid();
    const grid = [];
    for (let row = 0; row < this.totalRows; row++) {
      grid.push([]);
      for (let col = 0; col < this.totalColumns; col++) {
        const element = document.getElementById(`${row}_${col}`);
        grid[row].push(new Cell(element, row, col));
      }
    }
    if (newMaze) {
      grid[0][0].e.classList.remove("topWall");
      grid[0][0].e.classList.add("entrance");
      grid[this.totalRows - 1][this.totalColumns - 1].e.classList.remove(
        "bottomWall"
      );
      grid[this.totalRows - 1][this.totalColumns - 1].e.classList.add(
        "entrance"
      );
    }
    return grid;
  }

  generateObject() {
    // if(!Array.from(document.getElementsByClassName('entrance')).length == 2){
    //   displayFeedback('Failed to save. Mazes must have only two entrances.', 'bad', true)
    //   return null
    // }else if(!(this.totalRows > 3 && this.totalColumns > 3)){
    //   displayFeedback('Failed to save. Mazes must have at least three rows and three columns', 'bad', true)
    //   return null
    // }
    const solution = this.aStarSolveInstant(false, true);
    const turns = this.turns;

    let object = {
      totalRows: this.totalRows,
      totalColumns: this.totalColumns,
      highestscorer: this.highestscorer,
      highscore: this.highscore,
      title: this.title,
      creator: this.creator,
      solves: this.solves,
      turns: turns,
      wallcount: null,
      difficulty: null,
      solution: solution,
      grid: [],
    };
    let wallCount = 0;
    const grid = object.grid;
    for (let row = 0; row < this.totalRows; row++) {
      grid.push([]);
      for (let col = 0; col < this.totalColumns; col++) {
        let cell_info = [];
        const cell = this.grid[row][col];
        if (cell.isTopWall()) {
          cell_info.push(0);
          wallCount++;
        }
        if (cell.isRightWall()) {
          cell_info.push(1);
          wallCount++;
        }
        if (cell.isBottomWall()) {
          cell_info.push(2);
          wallCount++;
        }
        if (cell.isLeftWall()) {
          cell_info.push(3);
          wallCount++;
        }
        // 1 denotes top wall, 2 right wall, 3 bottom wall, 4 left wall
        grid[row].push(cell_info);
      }
    }
    object.wallcount = Math.floor(wallCount/2);
    const solutionWeight = 0.05;
    const turnWeight = 0.2;
    const turnScale = .7;
    const solutionScale = 1.5;
    const wallScale = 1;
    const sizeWeight = 0.55;
    const wallWeight = 0.2;
    const size = object.totalRows * object.totalColumns;
    const proportional_size = Math.sqrt(size)
    const sizeDiff = size/10000;
    const turnDiff = (turns * turnScale) / proportional_size;
    const solutionDiff = Math.max(((object.solution.length - (object.totalRows + object.totalColumns-2))/proportional_size)*solutionScale);
    const wallsDiff = Math.max(((object.wallcount-object.totalRows*2-object.totalColumns*2+2) * wallScale) / size, 0);
    // console.log(
    //   "size",
    //   Math.min(sizeDiff * sizeWeight, sizeWeight),
    //   sizeWeight
    // );
    // console.log(
    //   "solution",
    //   Math.min(solutionWeight * solutionDiff, solutionWeight),
    //   solutionWeight
    // );
    // console.log(
    //   "turn",
    //   Math.min(turnDiff * turnWeight, turnWeight),
    //   turnWeight
    // );
    // console.log(
    //   "wall",
    //   Math.min(wallsDiff * wallWeight, wallWeight),
    //   wallWeight
    // );
    object.difficulty = Math.floor(
      (Math.min(sizeDiff * sizeWeight, sizeWeight) +
        Math.min(solutionWeight * solutionDiff, solutionWeight) +
        Math.min(turnDiff * turnWeight, turnWeight) +
        Math.min(wallsDiff * wallWeight, wallWeight)) * 100
    );
    // console.log("Difficulty: ", object.difficulty);
    return object;
  }

  loadTable(object) {
    this.grid = [];
    this.totalRows = object.totalRows;
    this.totalColumns = object.totalColumns;
    this.solution = object.solution;
    this.id = object.id
    this.highestscorer = object.highestscorer
    this.highscore = object.highscore
    this.title = object.title
    this.solves = object.solves
    this.turns=object.turns
    this.creator = object.creator
    this.wallcount = object.wallCount
    this.difficulty = object.difficulty
    for (let row = 0; row < object.totalRows; row++) {
      this.grid.push([]);
      const rowElement = document.createElement("tr");
      rowElement.setAttribute("id", `row-${row}`);
      for (let col = 0; col < object.totalColumns; col++) {
        const id = `${row}_${col}`;
        const cell_info = object.grid[row][col].map((info) => {
          return !info
            ? "top"
            : info == 1
            ? "right"
            : info == 2
            ? "bottom"
            : info == 3
            ? "left"
            : null;
        });
        const cell_element = document.createElement("td");
        cell_info.forEach((e) => {
          cell_element.classList.add(`${e}Wall`);
        });
        cell_element.classList.add("cell");
        cell_element.setAttribute("id", id);
        rowElement.appendChild(cell_element);
        this.grid[row].push(new Cell(cell_element, row, col));
      }
      this.e.appendChild(rowElement);
    }

    for (let row = 0; row < this.totalRows; row++) {
      const left = this.grid[row][0];
      const right = this.grid[row][this.totalColumns - 1];

      !left.isLeftWall()
        ? left.e.classList.add("mazeEdge", "entrance")
        : left.e.classList.add("mazeEdge");
      !right.isRightWall()
        ? right.e.classList.add("mazeEdge", "entrance")
        : right.e.classList.add("mazeEdge");
    }
    for (let col = 0; col < this.totalColumns; col++) {
      const top = this.grid[0][col];
      const bottom = this.grid[this.totalRows - 1][col];

      !top.isTopWall()
        ? top.e.classList.add("mazeEdge", "entrance")
        : top.e.classList.add("mazeEdge");
      !bottom.isBottomWall()
        ? bottom.e.classList.add("mazeEdge", "entrance")
        : bottom.e.classList.add("mazeEdge");
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

  aStarSolveInstant(showPath = false, isFinal = true) {
    const entranceCells = Array.from(
      document.getElementsByClassName("entrance")
    );
    this.editClassAll("solved", false);
    if (entranceCells.length !== 2) {
      displayFeedback("Mazes must have 2 entrances.", "bad");
      return;
    }
    const startingCell = this.getCellObject(entranceCells[0]);
    const endingCell = this.getCellObject(entranceCells[1]);
    let notSolved = true;
    let touching = startingCell.getNeighbors(true).reverse();
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
    this.editClassAll("visited", false);
    this.editClassAll("neighbor", false);
    if (!notSolved) {
      showPath ? endingCell.toggleSolved(true) : null;
      let cell = endingCell;
      let lastID = endingCell.getID();
      let lastPOS = lastID.split("_").map((n) => {
        return Number(n);
      });
      let lastChange = [0, 0];
      let path = [lastID];
      let turns = 0;
      while (cell !== startingCell) {
        const newCellID = cell_data[lastID].p;
        if (isFinal) {
          const cellPOS = newCellID.split("_").map((n) => {
            return Number(n);
          });
          const rowChange = cellPOS[0] - lastPOS[0];
          const colChange = cellPOS[1] - lastPOS[1];
          if (!(rowChange == lastChange[0] && colChange == lastChange[1])) {
            turns++;
          }
          lastPOS = cellPOS;
          lastChange = [rowChange, colChange];
        }
        cell = this.getCellByID(newCellID);
        showPath ? cell.toggleSolved(true) : null;
        path.push(newCellID);
        lastID = newCellID;
      }
      this.solution = path.reverse();
      isFinal ? (this.turns = turns) : null;
      return this.solution;
    } else {
      displayFeedback("No valid solution.", "bad");
      return false;
    }
  }
  revealSolution(path = this.solution, delay = 0) {
    if (delay) {
      for (let i = 0; i < path.length; i++) {
        setTimeout(
          (e) => {
            e.toggleSolved(true);
          },
          i * delay,
          this.getCellByID(path[i])
        );
      }
      return;
    }
    path.forEach((e) => {
      this.getCellByID(e).toggleSolved(true);
    });
  }
  hideSolution() {
    this.editClassAll("solved", false);
  }
  aStarSolve(delay = 0) {
    this.resetMazeVars();
    if (!delay) {
      this.aStarSolveInstant(true);
      return;
    }
    this.editClassAll("solved", false);
    const entranceCells = Array.from(
      document.getElementsByClassName("entrance")
    );
    if (entranceCells.length !== 2) {
      displayFeedback("Mazes must have 2 entrances.", "bad");
      return;
    }
    const startingCell = this.getCellObject(entranceCells[0]);
    const endingCell = this.getCellObject(entranceCells[1]);
    let touching = startingCell.getNeighbors(true).reverse();
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
            MAZE_VARIABLES.path = [MAZE_VARIABLES.lastID];
            MAZE_VARIABLES.solvingPath = setInterval(
              function (startingCell, cell_data) {
                if (MAZE_VARIABLES.solve_cell == startingCell) {
                  clearInterval(MAZE_VARIABLES.solvingPath);
                  maze.solution = MAZE_VARIABLES.path.reverse();
                } else {
                  const newCellID = cell_data[MAZE_VARIABLES.lastID].p;
                  MAZE_VARIABLES.solve_cell = maze.getCellByID(newCellID);
                  MAZE_VARIABLES.solve_cell.toggleSolved(true);
                  MAZE_VARIABLES.path.push(newCellID);
                  MAZE_VARIABLES.lastID = newCellID;
                }
              },
              delay,
              startingCell,
              cell_data
            );
          } else {
            displayFeedback("No solution found. Maze is not solvable.", "bad");
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

  generatePrimMaze(
    delay = 1,
    startingCell = this.grid[Math.floor(Math.random() * this.totalRows)][
      Math.floor(Math.random() * this.totalColumns)
    ]
  ) {
    this.resetMazeVars();
    //? Implement a check that startingCell and endingCell are both touching walls

    //? ways to optimize
    // - finding direction of neighbor in getNeighbors function

    if (!delay) {
      this.generatePrimMazeInstant(startingCell);
      return;
    }
    MAZE_VARIABLES.touching = startingCell.getNeighbors(true);
    this.editClassAll("visited", false);
    this.editClassAll("neighbor", false);
    this.editClassAll("solved", false);
    MAZE_VARIABLES.touching.forEach((neighbor) =>
      neighbor.toggleNeighbor(true)
    );
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
      setTimeout(() => {
        try {
          maze.aStarSolveInstant(showSolution);
        } catch {
          maze.aStarSolveInstant(false);
        }
      }, 5);
    }, maze.totalColumns * maze.totalRows * delay + 200);
  }
  generatePrimMazeInstant(startingCell = this.grid[0][0]) {
    let touching = startingCell.getNeighbors(true);
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
    try {
      maze.aStarSolveInstant(showSolution);
    } catch {
      maze.aStarSolveInstant(false);
    }
    // setTimeout(()=>{
    //   try{
    //     maze.aStarSolveInstant(showSolution)
    //   }catch{
    //     maze.aStarSolveInstant(false)
    //   }
    // }, 1)
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
  resetMaze() {
    this.editClassAll("visited", false);
    this.editClassAll("neighbor", false);
    this.editClassAll("solved", false);
    this.editClassAll("entrance", false);
    this.editClassAll("rightWall", false);
    this.editClassAll("rightPending", false);
    this.editClassAll("rightHover", false);
    this.editClassAll("leftWall", false);
    this.editClassAll("leftPending", false);
    this.editClassAll("leftHover", false);
    this.editClassAll("topWall", false);
    this.editClassAll("topPending", false);
    this.editClassAll("topHover", false);
    this.editClassAll("bottomWall", false);
    this.editClassAll("bottomPending", false);
    this.editClassAll("bottomHover", false);
    for (let i = 0; i < this.totalRows; i++) {
      this.grid[i][0].toggleLeftWall(true);
      this.grid[i][this.totalColumns - 1].toggleRightWall(true);
    }
    for (let i = 0; i < this.totalColumns; i++) {
      this.grid[0][i].toggleTopWall(true);
      this.grid[this.totalRows - 1][i].toggleBottomWall(true);
    }
    this.grid[0][0].e.classList.remove("topWall");
    this.grid[0][0].e.classList.add("entrance");
    this.grid[this.totalRows - 1][this.totalColumns - 1].e.classList.remove(
      "bottomWall"
    );
    this.grid[this.totalRows - 1][this.totalColumns - 1].e.classList.add(
      "entrance"
    );
  }
  adjustRow(count) {
    if (count == this.totalRows) {
      return;
    }
    for (let i = 1; i < this.totalColumns - 1; i++) {
      const cell = this.grid[this.totalRows - 1][i];
      cell.toggleBottomWall(false);
      cell.toggleMazeEdge(false);
      if (cell.isEntrance()) {
        i == this.totalColumns - 1 && cell.isRightWall()
          ? null
          : cell.toggleEntrance(false);
      }
    }
    this.grid[this.totalRows - 1][0].toggleBottomWall(false);
    this.grid[this.totalRows - 1][this.totalColumns - 1].toggleBottomWall(
      false
    );
    if (count > this.totalRows) {
      const change = count - this.totalRows;
      for (let i = 0; i < change; i++) {
        let newRow = document.createElement("tr");
        newRow.setAttribute("id", `row-${this.totalRows}`);
        let newRowArray = [];
        for (let col = 0; col < this.totalColumns; col++) {
          let cell = document.createElement("td");
          cell.setAttribute("draggable", false);
          cell.classList.add("cell");
          cell.setAttribute("id", `${this.totalRows}_${col}`);
          this.totalRows == count - 1
            ? cell.classList.add("bottomWall", "mazeEdge")
            : null;
          col == this.totalColumns - 1
            ? cell.classList.add("rightWall", "mazeEdge")
            : null;
          !col ? cell.classList.add("leftWall", "mazeEdge") : null;
          newRow.appendChild(cell);
          newRowArray.push(new Cell(cell, this.totalRows, col));
        }
        this.e.appendChild(newRow);
        this.grid.push(newRowArray);
        this.totalRows++;
      }
    } else {
      const change = this.totalRows - count;
      for (let i = 0; i < change; i++) {
        this.totalRows--;
        this.e.deleteRow(this.totalRows);
        this.grid.pop();
      }
      for (let col = 0; col < this.totalColumns; col++) {
        this.grid[this.totalRows - 1][col].toggleBottomWall(true);
      }
    }
  }
  adjustColumn(count) {
    if (count == this.totalColumns) {
      return;
    }
    for (let i = 1; i < this.totalRows - 1; i++) {
      const cell = this.grid[i][this.totalColumns - 1];
      cell.toggleRightWall(false);
      cell.toggleMazeEdge(false);
      if (cell.isEntrance()) {
        i == this.totalRows - 1 && cell.isBottomWall()
          ? null
          : cell.toggleEntrance(false);
      }
    }
    this.grid[0][this.totalColumns - 1].toggleRightWall(false);
    this.grid[this.totalRows - 1][this.totalColumns - 1].toggleRightWall(false);
    if (count > this.totalColumns) {
      const change = count - this.totalColumns;
      for (let i = 0; i < change; i++) {
        for (let row = 0; row < this.totalRows; row++) {
          const cell = document.createElement("td");
          cell.setAttribute("draggable", false);
          cell.classList.add("cell");
          cell.setAttribute("id", `${row}_${this.totalColumns}`);
          !row ? cell.classList.add("topWall", "mazeEdge") : null;
          row == this.totalRows - 1
            ? cell.classList.add("bottomWall", "mazeEdge")
            : null;
          this.totalColumns == count - 1
            ? cell.classList.add("rightWall", "mazeEdge")
            : null;
          document.getElementById(`row-${row}`).appendChild(cell);
          this.grid[row].push(new Cell(cell, row, this.totalColumns));
        }
        this.totalColumns++;
      }
    } else {
      const change = this.totalColumns - count;
      for (let i = 0; i < change; i++) {
        this.totalColumns--;
        for (let row = 0; row < this.totalRows; row++) {
          const cell = this.grid[row].pop();
          cell.e.remove();
        }
      }
      for (let row = 0; row < this.totalRows; row++) {
        this.grid[row][this.totalColumns - 1].toggleRightWall(true);
      }
    }
    this.solution = this.aStarSolveInstant(false);
  }
  calculateScore(solution) {}
}
function randomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
