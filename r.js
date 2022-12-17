const rows = 20
const columns = 40

for(let i = 0; i < rows;i++){
  console.log(`<tr id='row-${i}'>`)
  for(let q = 0; q < columns; q++){
    console.log(`<td class='box' id='${i}_${q}'></td>`)
  }
  console.log('</tr>')
}

let adjacencyList = []

for(let i = 0; i < rows; i++){
  let arr = []
  adjacencyList.push(arr)
  for(let q=0; q< columns; q++){
    let arr2 = []
    if(i > 0){
      
      if(i < rows){

      }
    }
    if(q > 0){
      if(q < columns){

      }
    }
  }
}