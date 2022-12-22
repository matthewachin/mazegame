let mouseDown = false
let lastHoverCell = null
let isDrawing = true

let userPaths = []

enableControls()

function mouseDownFunc(ev){
  mouseDown = true
  const element = ev.target
  if(element.classList.contains('cell')){
    const cell = maze.getCellObject(element)
    if(cell.isUserPath()){
      cell.toggleUserPath(false)
      isDrawing = false
    }else{
      cell.toggleUserPath(true)
      isDrawing = true
    }
  }
}
function mouseUpFunc(ev){
  mouseDown = false
}
function mouseOverFunc(ev){
  const element = ev.target
  if(element.classList.contains('cell')){
    lastHoverCell !== null ? lastHoverCell.toggleHoverCell(false) : null
    const cell = maze.getCellObject(element)
    cell.toggleHoverCell(true)
    lastHoverCell = cell
    if(mouseDown){
      if(cell.isUserPath()){
        cell.toggleUserPath(isDrawing)
      }else{
        cell.toggleUserPath(isDrawing)
      }
    }
  }
}

function enableControls(){
  document.onmousedown = mouseDownFunc
  document.onmouseup = mouseUpFunc
  document.onmouseover = mouseOverFunc

}

function disableControls(){

}