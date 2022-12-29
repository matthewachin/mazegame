let results = false
let firstSolutionClick = true

const resultsModal = new bootstrap.Modal(document.getElementById('solved-maze-modal'), {
  keyboard: true,
  focus: true,
  backdrop: true,
})
const failedModal = new bootstrap.Modal(document.getElementById('failed-maze-modal'), {
  keyboard: true,
  focus: true,
  backdrop: true,
})

function enableButtons(){
  document.getElementById('editor-settings-button').addEventListener('click', (e)=>{
    const editorSettings = document.getElementById('editor-settings')
    if(editorSettings.classList.contains('hidden')){
      editorSettings.classList.remove('hidden')
      e.target.innerHTML = 'Hide Settings'
    }else{
      editorSettings.classList.add('hidden')
      e.target.innerHTML = 'Show Settings'
    }
  })
  document.getElementById('solution-button').addEventListener('click', (e)=>{
    if(firstSolutionClick){
      document.getElementById('results-button').classList.remove('hidden')
      document.getElementById('random-button').classList.remove('hidden')
      maze.revealSolution()
      failedModal.show()
      timer.off()
      e.target.innerHTML = 'Hide Solution'
      results = false
      firstSolutionClick=false
      disableControls()
    }else{
      if(e.target.innerHTML.slice(0,4) == 'Show'){
        maze.revealSolution()
        e.target.innerHTML = 'Hide Solution'
      }else{
        maze.hideSolution()
        e.target.innerHTML = 'Show Solution'
      }
    }
  })
  document.getElementById('results-button').addEventListener('click', (e)=>{
    if(results){
      resultsModal.show()
    }else{
      failedModal.show()
    }
  })
  Array.from(document.getElementsByClassName('toggleMazeList')).forEach((e)=>e.addEventListener('click', (e)=>{
    window.location.href = '/maze-list'
  }))
  Array.from(document.getElementsByClassName('toggleRandomMaze')).forEach((e)=>e.addEventListener('click', (e)=>{
    // TODO: INSERT LOGIC FOR GRABBING NEW MAZE & LOADING IT
  }))
}