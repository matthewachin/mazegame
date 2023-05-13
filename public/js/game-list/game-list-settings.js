function updateValue(id){
  const label = document.getElementById(`${id}-label`)
  const inp = document.getElementById(id)
  label.innerHTML = inp.value
}
['maze','row','col','player'].forEach((str)=>{
  document.getElementById(`custom-${str}-count`).addEventListener('input', (event) =>{
    updateValue(event.target.id)
  })
})
function getValue(shorthand){
  return document.getElementById(`custom-${shorthand}-count`).value
}
document.getElementById('gamemodes-submit').addEventListener('click',()=>{
  window.location.href = `/games/play/${gameCode}?maze_count=${getValue('maze')}&row=${getValue('row')}&col=${getValue('col')}&max_players=${getValue('player')}`
})