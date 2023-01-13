Array.from(document.getElementsByClassName('mazes-row')).forEach((e)=>{
  e.addEventListener('click', (e)=>{
    const path = e.path
    let index = 0
    while(path[index].classList.contains('mazes-row')){
      index++
    }
    const id = Array.from(path[index+1].children)[0].getAttribute('id')
    window.location.href = `/solve/${id}`
  })
})
// document.getElementById('create-button').addEventListener('click', (e)=>{
//   window.location.href = '/sandbox'
// })

document.getElementById('header-row').addEventListener('click',(e)=>{
  document.getElementById('').submit()
})