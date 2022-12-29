let cursorShown = false
let currentLetter = 0
let nextLetter = 0
const letterDelay = 250
const cursorDelay = 400

const onAnimation = true

let cursor;

const letters = Array.from(document.getElementsByClassName('title-letter'))

if(onAnimation){
  setTimeout(()=>{
    document.getElementById('logo').classList.add('index-logo')
    setTimeout(()=>{
      document.getElementById('main-title').classList.remove('hidden')
      cursor = setInterval(()=>{letters[currentLetter].classList.toggle('currentLetter')}, cursorDelay)
      setTimeout(()=>{
        startTyping()
        clearInterval(cursor)
        setTimeout(()=>{
          letters[currentLetter].classList.remove('currentLetter')
          cursor = setInterval(()=>{letters[currentLetter].classList.toggle('currentLetter')}, cursorDelay)
          toggleCreationTag()
          setTimeout(()=>{
            clearInterval(cursor)
          }, cursorDelay*10)
        },8*letterDelay+cursorDelay)
      }, 2000)
    }, 1200)
  }, 500)
}else{
  letters[currentLetter].classList.remove('currentLetter')
  letters.forEach((e)=>{
    e.classList.toggle('letterShow', true)
  })
  document.getElementById('main-title').classList.remove('hidden')
  document.getElementById('logo').classList.add('index-logo')
  document.getElementById('scroll-down').classList.remove('hidden')
  document.getElementById('creation-tag-div').classList.remove('hiddenSpace')
  document.getElementById('typing-desc').classList.add('fadeUp')
}


function startTyping(){
  for(let i = 0; i < 8; i++){
    
    setTimeout(()=>{
      letters[currentLetter].classList.toggle('currentLetter', false)
      currentLetter++ 
      letters[currentLetter].classList.add('currentLetter')
      letters[currentLetter].classList.add('letterShow')

    },letterDelay*i)
  }
}

function toggleCreationTag(){
  document.getElementById('creation-tag-div').classList.remove('hiddenSpace')
  document.getElementById('scroll-down').classList.remove('hidden')
  document.getElementById('typing-desc').classList.add('fadeUp')
  document.getElementById('login-button').classList.add('fadeUp')
}