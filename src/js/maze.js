class Maze {
  constructor(totalRows, totalColumns) {
    this.totalRows = totalRows;
    this.totalColumns = totalColumns;
    this.e = document.getElementById("main-grid");
    this.grid = this.generateGrid();
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
        cell.classList.add("cell", "path");
        // type ? cell.classList.add('cell1') : cell.classList.add('cell2')
        !row ? cell.classList.add("upWall") : null;
        row == this.totalRows - 1 ? cell.classList.add("downWall") : null;
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
          downWall: this.grid[row][col].isDownWall(),
          upWall: this.grid[row][col].isUpWall(),
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
        this.grid[row][col].toggleDownWall(classList.downWall);
        this.grid[row][col].toggleUpWall(classList.upWall);
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
}
