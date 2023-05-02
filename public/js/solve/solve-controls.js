let mouseDown;
let lastHoverCell;
let isDrawing;
let solveControls_entrances;
let userPathForward;
let userPathBackwards;
let userSolution;

// function mouseDownFunc(ev){
//   const element = ev.target
//   if(element.classList.contains('cell')){
//     const cell = maze.getCellObject(element)
//     mouseDown = true
//     if(!cell.isUserPath()){
//       addUserPath(cell)
//     }else{
//       deleteUserPath(cell)
//     }
//   }
// }

// function mouseUpFunc(ev){
//   mouseDown = false
// }
function mouseOverFunc(ev){
  const element = ev.target
  if(element.classList.contains('cell')){
    lastHoverCell !== null ? lastHoverCell.toggleHoverCell(false) : null
    const cell = maze.getCellObject(element)
    cell.toggleHoverCell(true)
    lastHoverCell = cell
    if(true){ // used to be if mouseDown
      if(!cell.isUserPath()){
        addUserPath(cell)
      }
      // }else{
      //   deleteUserPath(cell)
      // }
    }
  }
}

function enableControls(){
  // document.onmousedown = mouseDownFunc
  // document.onmouseup = mouseUpFunc
  document.onmouseover = mouseOverFunc
  document.ontouchmove = mouseOverFunc
}

function disableControls(){
  document.onmousedown = null
  document.onmouseup = null
  document.onmouseover = null
  document.ontouchmove = null
  mouseDown = false
  lastHoverCell = null
  isDrawing = true
  userPathForward = []
  userPathBackwards = []
}


function addUserPath(cell){
  const neighbors = cell.getNeighbors(true, false).filter((n) => n.isUserPath())
  const neighborCount = neighbors.length
  if(neighborCount){
    const nIndFor = Math.min(...(neighbors.map((neighbor_cell)=>{
      const fIndex = userPathForward.indexOf(neighbor_cell)
      return fIndex == -1 ? Infinity : fIndex
    })))
    const nIndBack = Math.min(...(neighbors.map((neighbor_cell)=>{
      const fIndex = userPathBackwards.lastIndexOf(neighbor_cell)
      return fIndex == -1 ? Infinity : fIndex
    })))
    let isEndOfFront = false
    if(nIndFor !== Infinity){
      if( nIndFor !== userPathForward.length-1){
        let newUserPathFor = userPathForward.slice(0, nIndFor+1)
        for(let i = nIndFor+1; i < userPathForward.length; i++){
          userPathForward[i].toggleUserPath(false)
        }
        userPathForward = newUserPathFor
        cell.toggleUserPath(true)
        userPathForward.push(cell)
        isEndOfFront = true
      }else{
        cell.toggleUserPath(true)
        userPathForward.push(cell)
        isEndOfFront = true
      }
    }
    if(nIndBack !== Infinity){
      if(nIndBack !== 0){
        let newUserPathFor = userPathBackwards.slice(nIndBack)
        for(let i = 0; i < nIndBack; i++){
          userPathBackwards[i].toggleUserPath(false)
        }
        userPathBackwards = newUserPathFor
        cell.toggleUserPath(true)
        userPathBackwards.unshift(cell)
      }else{
        cell.toggleUserPath(true)
        userPathBackwards.unshift(cell)
      }
      if(isEndOfFront){
        userPathForward.pop()
        userSolution = userPathForward.concat(userPathBackwards)
        console.log(userSolution)
        mazeSolved(userSolution)
      }
    }
  }
}
function deleteUserPath(cell){
  if(!cell.isEntrance()){
    cell.toggleUserPath(false)
    const fIndex = userPathForward.indexOf(cell)
    const bIndex = userPathBackwards.lastIndexOf(cell)
    if(fIndex !== -1){
      for(let i = fIndex; i < userPathForward.length; i++){
        userPathForward[i].toggleUserPath(false)
      }
      userPathForward = userPathForward.slice(0, fIndex)
  
    }else if(bIndex !== -1){
      for(let i = 0; i < bIndex+1; i++){
        userPathBackwards[i].toggleUserPath(false)
      }
      userPathBackwards = userPathBackwards.slice(bIndex+1)
    }
  }
}