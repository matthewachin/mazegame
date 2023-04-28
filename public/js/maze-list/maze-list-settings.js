// Array.from(document.getElementsByClassName('mazes-row')).forEach((e)=>{
//   e.addEventListener('click', (e)=>{
//     const path = e.path
//     console.log(e)
//     let index = 0
//     while(path[index].classList.contains('mazes-row')){
//       index++
//     }
//     const id = Array.from(path[index+1].children)[0].getAttribute('id')
//     window.location.href = `/mazes/play/${id}`
//   })
// })
// // document.getElementById('create-button').addEventListener('click', (e)=>{
// //   window.location.href = '/sandbox'
// // })