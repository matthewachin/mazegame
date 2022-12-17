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

// Enables draw controls
enableDrawControls();

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
      editWall(mode, startCell);
    }
  };
  // The following code is run when the mouse is released:
  // Purpose: convert all of the pending walls into actual walls
  document.onmouseup = function (ev) {
    mouseDown = false;
    Array.from(document.getElementsByClassName(`${mode}Pending`)).forEach(
      function (element) {
        const cell = maze.getCellObject(element);

        editWall(mode, cell, false, true);
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
            const adjustment = isAdding ? 0 : colChange > 0 ? -1 : 1;
            editMultiWall(
              lastHoverCell.getRow(),
              startCol,
              cell.getRow() - adjustment,
              cell.getColumn() - adjustment,
              mode,
              true,
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
            const adjustment = isAdding ? 0 : rowChange > 0 ? -1 : 1;
            editMultiWall(
              startRow,
              lastHoverCell.getColumn(),
              cell.getRow() - adjustment,
              cell.getColumn() - adjustment,
              mode,
              true,
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
    Array.from(
      document.getElementsByClassName(`${lastHoverMode}Hover`)
    ).forEach(function (element) {
      element.classList.remove(`${lastHoverMode}Hover`);
    });
  }
  const newMode = getMode(mouseInfo, cell);
  if (newMode == "top") {
    cell.toggleTopHover(true);
  } else if (newMode == "bottom") {
    cell.toggleBottomHover(true);
  } else if (newMode == "left") {
    cell.toggleLeftHover(true);
  } else if (newMode == "right") {
    cell.toggleRightHover(true);
  }
  lastHoverCell = cell;
  lastHoverMode = newMode;
}


// Edit one wall
// mode = top, bottom, left, right
// cell = cell object
// isPending indicates whether it should only be made to be pending
// isAdding indicates whether it should add walls
function editWall(mode, cell, isPending = true, isAdding = true) {
  // cell = cell object
  if (isPending) {
    if (mode == "top") {
      cell.getTop().toggleBottomPending(isAdding);
      cell.toggleTopPending(isAdding);
    } else if (mode == "left") {
      cell.getLeft().toggleRightPending(isAdding);
      cell.toggleLeftPending(isAdding);
    } else if (mode == "right") {
      cell.getRight().toggleLeftPending(isAdding);
      cell.toggleRightPending(isAdding);
    } else if (mode == "bottom") {
      cell.getBottom().toggleTopPending(isAdding);
      cell.toggleBottomPending(isAdding);
    }
  } else {
    if (mode == "top") {
      cell.getTop().toggleBottomWall(isAdding);
      cell.getTop().toggleBottomPending(!isAdding);
      cell.toggleTopWall(isAdding);
      cell.toggleTopPending(!isAdding);
    } else if (mode == "left") {
      cell.getLeft().toggleRightWall(isAdding);
      cell.getLeft().toggleRightPending(!isAdding);
      cell.toggleLeftWall(isAdding);
      cell.toggleLeftPending(!isAdding);
    } else if (mode == "right") {
      cell.getRight().toggleLeftWall(isAdding);
      cell.getRight().toggleLeftPending(!isAdding);
      cell.toggleRightWall(isAdding);
      cell.toggleRightPending(!isAdding);
    } else if (mode == "bottom") {
      cell.getBottom().toggleTopWall(isAdding);
      cell.getBottom().toggleTopPending(!isAdding);
      cell.toggleBottomWall(isAdding);
      cell.toggleBottomPending(!isAdding);
    }
  }
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

function editMultiWall(row1, col1, row2, col2, mode, isPending, isAdding) {
  // type defines whether a wall should be added or deleted
  const startRow = row1 > row2 ? row2 : row1;
  const startCol = col1 > col2 ? col2 : col1;
  const endRow = row1 < row2 ? row2 : row1;
  const endCol = col1 < col2 ? col2 : col1;
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      editWall(mode, maze.grid[row][col], isPending, isAdding);
    }
  }
}