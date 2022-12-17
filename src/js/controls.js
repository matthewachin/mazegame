// // Global variables

// let mouseDown = false;

// document.querySelectorAll(".cell").forEach(function (e) {
//   e.addEventListener("mouseover", function (e) {
//     if (mouseDown) {
//       const cell_element = e.target;

//       cell_element.classList.toggle(mode, true);
//     }
//   });
// });
// document.onmousedown = function (ev) {
//   mouseDown = true;
//   const cell_element = ev.path[0];
//   if (cell_element.classList.contains("cell")) {
//     cell_element.classList.toggle(mode, "true");
//   }
//   console.log(ev);
// };
// document.onmouseup = function (ev) {
//   mouseDown = false;
// };

let first = false
function enableDrawControls() {
  document.querySelectorAll(".cell").forEach(function (cellElement) {
    cellElement.addEventListener('mouseover', function(event){
      if(!first){
        console.log(event)
        console.log(event.target.getBoundingClientRect())
        first = true 
      }
      

    })
    // const pos = e.getAttribute("id").split("_").forEach(function(str){
    //   Number(str)
    // })
    // const row = pos[0], col = pos[1]

  });
}

enableDrawControls()