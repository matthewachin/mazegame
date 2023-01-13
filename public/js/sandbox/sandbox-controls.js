// The following are for the multi-edit/drag edit feature
// A boolean if the mouse is pressed
let mouseDown = false;
// direction of edit (top, bottom, right, left)
let direction = "top";
// Starting cell when doing a multi-edit
let startCell = null;

// The following are for the hovering feature:
// The last cell that was hovered over
let lastHoverCell = null;

// This refers to drawing when drawing mode is active
// If drawing mode is active and you hold down on a wall, it will start a multi-select for erasing
let isDrawing = true


let isDrawingMode = false
let wallPlaced = false


// 
let mouseCheckInterval = null;
let intervalDelay = 50

let mouseData = {
  'x':null,
  'y':null,
  't':null,
  // t= target
}

// document.oncontextmenu = () => false



// A function that enables draw controls
function enableDrawControls() {
  disableControls()
  // Run when the mouse is clicked down:
  // Purpose: place a pending wall at the cell and prepare for multi-cell edit
  document.onmousedown = mouseDownFunc
  // The following code is run when the mouse is released:
  // Purpose: convert all of the pending walls into actual walls
  document.onmouseup = mouseUpFunc
  // The following code is run when the mouse is moved:
  // Purpose: indicates what wall is being hovered, also during multi-edit: it adjusts which cells have pending wall based on mouse's movement
  document.onmousemove = function(ev){
    mouseData.x = ev.x
    mouseData.y = ev.y
    mouseData.t = ev.target
  }
  
  mouseCheckInterval = setInterval(mouseInterval, intervalDelay)
}

function enableEraseControls(){
  disableControls()
  document.onmousedown = mouseDownFuncErase
  document.onmouseup = mouseUpFuncErase
  document.onmouseover = mouseOverFuncErase
}

// A function that indicates which wall of a cell is being selected
function showHover(mouseInfo, cell) {
  if (lastHoverCell !== null) {
    lastHoverCell.toggleClass(false, lastHoverdirection, 'hover')
  }
  if(mouseDown){
    cell.toggleClass(true, direction, 'hover')
    lastHoverCell = cell;
    lastHoverdirection = direction
  }else{
    const newdirection = getDirection(mouseInfo, cell);
    cell.toggleClass(true, newdirection, 'hover')
    lastHoverCell = cell;
    lastHoverdirection = newdirection;
  }
  // if (lastHoverCell !== null) {
  //   Array.from(
  //     document.getElementsByClassName(`${lastHoverdirection}Hover`)
  //   ).forEach(function (element) {
      
  //     maze.getCellObject(element).toggleClass(false, lastHoverdirection, 'hover')
  //   });
  // }
}

function getDirection(mouseInfo, cell) {
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

function updatePending(row1, col1, row2, col2, direction) {
  // type defines whether a wall should be added or deleted
  
  Array.from(document.getElementsByClassName(`${direction}Pending`)).forEach(function(element){
    maze.getCellObject(element).toggleClass(false, direction, 'pending')
  })
  if(direction == 'top' || direction == 'bottom'){
    const row = row1
    const startCol = Math.min(col1, col2)
    const endCol = Math.max(col1, col2)
    for (let col = startCol; col <= endCol; col++) {
      maze.grid[row][col].toggleClass(true, direction, 'pending')
    }
  }else{
    const startRow = Math.min(row1, row2)
    const col = col1
    const endRow = Math.max(row1, row2)
    for (let row = startRow; row <= endRow; row++) {
      maze.grid[row][col].toggleClass(true, direction, 'pending')
    }
  }
}

function disableControls(){
  mouseDown = false
  lastHoverCell = null
  startCell = null
  direction = 'top'
  document.onmousedown = null
  document.onmouseup = null
  document.onmousemove = null
  document.onmouseover = null
  removeClassAll('topHover')
  removeClassAll('bottomHover')
  removeClassAll('leftHover')
  removeClassAll('rightHover')
  removeClassAll('topPending')
  removeClassAll('bottomPending')
  removeClassAll('leftPending')
  removeClassAll('rightPending')
  removeClassAll('hoverCell')
  removeClassAll('pendingCell')
  clearInterval(mouseCheckInterval)
}

// function removeClassAll(){

// }

function editInterval(ms){
  mouseCheckInterval = setInterval(mouseInterval, ms)
}
function mouseInterval(){
  const element = mouseData.t;
  const click = {
    x: mouseData.x,
    y: mouseData.y,
  };
  try{
    const cell = maze.getCellObject(element);
    if (mouseDown) {
      if (lastHoverCell !== cell) {
        updatePending(startCell.getRow(), startCell.getColumn(), cell.getRow(), cell.getColumn(), direction)
      }
    }
    showHover(click, cell);
  }catch{
    return
  }
  
}
function capitalize(str){
  return str.length < 2 ? str : str[0].toUpperCase() + str.slice(1)
}

function mouseUpFunc(){
  mouseDown = false;
  editInterval(50)
  
  Array.from(document.getElementsByClassName(`${direction}Pending`)).forEach(
    function (element) {
      const cell = maze.getCellObject(element);
      cell.toggleClass(false, direction, 'pending')
      isDrawing ? cell.toggleClass(true, direction, 'wall') : cell.toggleClass(false, direction, 'wall')
      wallPlaced = true
      if(cell.isMazeEdge()){
        console.log('true')
        const cell_row = cell.row
        const cell_col = cell.col
        cell.toggleEntrance(false)
        !cell_row && !cell.isTopWall() ? cell.toggleEntrance(true) : null
        !cell_col && !cell.isLeftWall() ? cell.toggleEntrance(true) : null
        cell_row == maze.totalRows-1 && !cell.isBottomWall() ? cell.toggleEntrance(true) : null
        cell_col == maze.totalColumns-1 && !cell.isRightWall() ? cell.toggleEntrance(true) : null
      }
    }
  );
  wallPlaced ? maze.aStarSolveInstant(showSolution) : null
  wallPlaced = false
  // showSolution ? visualizeAlg ? maze.aStarSolve(algDelay) : maze.aStarSolveInstant() : null
};

function mouseDownFunc(ev){
  mouseDown = true;
  const element = ev.target;
  if (element.classList.contains("cell")) {
    // checks if the element that was clicked on is a cell
    const click = {
      x: ev.x,
      y: ev.y,
    };
    editInterval(25)
    startCell = maze.getCellObject(element);
    direction = getDirection(click, startCell);
    if(element.classList.contains(`${direction}Wall`)){
      startCell.toggleClass(true, direction, 'pending')
      isDrawing = false
    }else{
      startCell.toggleClass(true, direction, 'pending')
      isDrawing = true
    }
  }
};


function mouseOverFuncErase(ev){
  const element = ev.target
  if(element.classList.contains('cell')){
    const cell = maze.getCellObject(element)
    cell.toggleHoverCell(true)
    if(lastHoverCell !== null){
      lastHoverCell.toggleHoverCell(false)
    }
    if(mouseDown){
      const minRow = Math.min(startCell.getRow(), cell.getRow())
      const maxRow =Math.max(startCell.getRow(), cell.getRow())
      const minCol = Math.min(startCell.getColumn(), cell.getColumn())
      const maxCol = Math.max(startCell.getColumn(), cell.getColumn())
      Array.from(document.getElementsByClassName('pendingCell')).forEach((e)=>{
        e.classList.remove('pendingCell')
      })
      for(let row=minRow; row <= maxRow; row++){
        for(let col =minCol; col <= maxCol; col++){
          maze.grid[row][col].togglePendingCell(true)
        }
      }
    }
    lastHoverCell = cell
  }
}
function mouseUpFuncErase(){
  mouseDown = false
  Array.from(document.getElementsByClassName('pendingCell')).forEach((e)=>{
    const cell = maze.getCellObject(e)
    cell.togglePendingCell(false)
    cell.reset()
    wallPlaced = true
    if(cell.isMazeEdge()){
      const cell_row = cell.row
      const cell_col = cell.col
      cell.toggleEntrance(false)
      !cell_row && !cell.isTopWall() ? cell.toggleEntrance(true) : null
      !cell_col && !cell.isLeftWall() ? cell.toggleEntrance(true) : null
      cell_row == maze.totalRows-1 && !cell.isBottomWall() ? cell.toggleEntrance(true) : null
      cell_col == maze.totalColumns-1 && !cell.isRightWall() ? cell.toggleEntrance(true) : null
    }
  })
  wallPlaced ? maze.aStarSolveInstant(showSolution) : null
  wallPlaced = false
}
function mouseDownFuncErase(ev){
  mouseDown = true
  const element = ev.target
  if(element.classList.contains('cell')){
    startCell = maze.getCellObject(element);
    startCell.togglePendingCell(true)
    lastHoverCell = startCell
  }
}
function removeClassAll(className) {
  Array.from(document.getElementsByClassName(className)).forEach((e) =>
    e.classList.toggle(className)
  );
}