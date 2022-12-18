
function switchMode(colorMode){
  // true = darkMode
  // false = lightMode
  console.log('switching colormodes')
  
  if(colorMode){
    const darkMode = {
      '--mainText' :' white',
      '--wall': 'rgb(61, 152, 227)',
      '--pending': 'rgb(0, 255, 119)',
      '--hover': 'rgb(255, 0, 72)',
      '--start': 'greenyellow',
      '--end': 'darkred',
      '--gridLine': 'rgb(67, 53, 53)',
      '--background': 'rgb(40, 40, 40)',
      '--borderSize': '2.5px',
      '--cellSize': '15px',
      '--visited': 'rgb(61, 49, 119)',
      '--neighbor': 'rgb(153, 54, 54)',
    }
    for(variable in darkMode){
      document.querySelector(':root').style.setProperty(variable, darkMode[variable])
    }
  }else{
    const lightMode = {
      '--wall': 'black',
      '--pending': 'orange',
      '--hover': 'red',
      '--start': 'greenyellow',
      '--end': 'darkred',
      '--gridLine': 'lightgrey',
      '--background' : 'white',
      '--borderSize': '2.5px',
      '--cellSize': '15px',
      '--visited': 'rgb(61, 49, 119)',
      '--neighbor': 'rgb(153, 54, 54)',
    }
    for(variable in lightMode){
      console.log(variable)
      document.querySelector(':root').style.setProperty(variable, lightMode[variable])
    }
  }
}