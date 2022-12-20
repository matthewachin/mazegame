// The following are for the multi-edit/drag edit feature
// A boolean if the mouse is pressed
let mouseDown = false;
// Mode of edit (top, bottom, right, left)
let mode = "top";
// Starting cell when doing a multi-edit
let startCell = null;

// The following are for the hovering feature:
// The last cell that was hovered over
let lastHoverCell = null;
// The last hover mode
let lastHoverMode = null;

// enable/disable draw controls
enableDrawControls();
disableDrawControls()
// A function that enables draw controls
function enableDrawControls() {
  // Run when the mouse is clicked down:
  // Purpose: place a pending wall at the cell and prepare for multi-cell edit
  document.onmousedown = function (ev) {
    mouseDown = true;
    const element = ev.target;
    if (element.classList.contains("cell")) {
      // checks if the element that was clicked on is a cell
      const click = {
        x: ev.pageX,
        y: ev.pageY,
      };
      startCell = maze.getCellObject(element);
      mode = getMode(click, startCell);
      startCell.toggleClass(true, mode, 'pending')
    }
  };
  // The following code is run when the mouse is released:
  // Purpose: convert all of the pending walls into actual walls
  document.onmouseup = function () {
    mouseDown = false;
    Array.from(document.getElementsByClassName(`${mode}Pending`)).forEach(
      function (element) {
        const cell = maze.getCellObject(element);
        cell.toggleClass(false, mode, 'pending')
        cell.toggleClass(true, mode, 'wall')
      }
    );
  };
  // The following code is run when the mouse is moved:
  // Purpose: indicates what wall is being hovered, also during multi-edit: it adjusts which cells have pending wall based on mouse's movement
  document.onmousemove = function (ev) {
    const element = ev.target;
    if (element.classList.contains("cell")) {
      const click = {
        x: ev.pageX,
        y: ev.pageY,
      };
      const cell = maze.getCellObject(element);
      if (mouseDown) {
        if (lastHoverCell !== cell) {
          const rowChange = lastHoverCell.getRow() - cell.getRow();
          const colChange = lastHoverCell.getColumn() - cell.getColumn();
          const startRow = startCell.getRow();
          const startCol = startCell.getColumn();
          if (rowChange) {
            const isAdding =
              rowChange > 0
                ? startRow < cell.getRow()
                  ? false
                  : true
                : startRow > cell.getRow()
                ? false
                : true;
            updatePending(
              startRow,
              startCol,
              cell.getRow(),
              cell.getColumn(),
              mode,
              isAdding
            );
          } else {
            const isAdding =
              colChange > 0
                ? startCol < cell.getColumn()
                  ? false
                  : true
                : startCol > cell.getColumn()
                ? false
                : true;
            updatePending(
              startRow,
              startCol,
              cell.getRow(),
              cell.getColumn(),
              mode,
              isAdding
            );
          }
        }
      }
      showHover(click, cell);
    }
  };
}

// A function that indicates which wall of a cell is being selected
function showHover(mouseInfo, cell) {
  if (lastHoverCell !== null) {
    
    lastHoverCell.toggleClass(false, lastHoverMode, 'hover')
  }
  // if (lastHoverCell !== null) {
  //   Array.from(
  //     document.getElementsByClassName(`${lastHoverMode}Hover`)
  //   ).forEach(function (element) {
      
  //     maze.getCellObject(element).toggleClass(false, lastHoverMode, 'hover')
  //   });
  // }
  const newMode = getMode(mouseInfo, cell);
  cell.toggleClass(true, newMode, 'hover')
  lastHoverCell = cell;
  lastHoverMode = newMode;
}

function getMode(mouseInfo, cell) {
  const elementInfo = cell.e.getBoundingClientRect();
  const isTopLeft =
    mouseInfo.x - elementInfo.left + mouseInfo.y - elementInfo.top <
    elementInfo.width;
  const isTopRight =
    mouseInfo.y - elementInfo.top + elementInfo.right - mouseInfo.x <
    elementInfo.width;
  return isTopLeft
    ? isTopRight
      ? "top"
      : "left"
    : isTopRight
    ? "right"
    : "bottom";
}

function updatePending(row1, col1, row2, col2, mode, isAdding) {
  // type defines whether a wall should be added or deleted
  if(!isAdding){
    Array.from(document.getElementsByClassName(`${mode}Pending`)).forEach(function(element){
      maze.getCellObject(element).toggleClass(false, mode, 'pending')
    })
  }
  const startRow = row1 > row2 ? row2 : row1;
  const startCol = col1 > col2 ? col2 : col1;
  const endRow = row1 < row2 ? row2 : row1;
  const endCol = col1 < col2 ? col2 : col1;
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      maze.grid[row][col].toggleClass(true, mode, 'pending')
    }
  }
}

function disableDrawControls(){
  document.onmousedown = null
  document.onmouseup = null
  document.onmousemove = null
}