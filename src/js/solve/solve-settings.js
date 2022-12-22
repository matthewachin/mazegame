document.getElementById('feedback-button').addEventListener('click', (e)=>{
  const feedbackDiv = document.getElementById('feedback-div')
  feedbackDiv.classList.contains('hidden') ? toggleFeedback(true) : toggleFeedback(false)
})

document.getElementById('hide-feedback').addEventListener('click', (e)=>{
  toggleFeedback(false)
})
function displayFeedback(text, type, force=false){
  const feedbackElement = document.getElementById('feedback-text')
  if(type == 'good'){
    feedbackElement.classList.add('feedback-good')
    feedbackElement.classList.remove('feedback-bad')
    feedbackElement.classList.remove('feedback-medium')
  }else if(type == 'bad'){
    feedbackElement.classList.add('feedback-bad')
    feedbackElement.classList.remove('feedback-good')
    feedbackElement.classList.remove('feedback-medium')
  }else{
    feedbackElement.classList.remove('feedback-good')
    feedbackElement.classList.add('feedback-medium')
    feedbackElement.classList.remove('feedback-bad')
  }
  feedbackElement.innerHTML = text
  force ? toggleFeedback(true) : null
}
function toggleFeedback(force){
  // true = show
  // false = false
  const feedbackDiv = document.getElementById('feedback-div')
  const feedbackButton = document.getElementById('feedback-button')
  if(force){
    feedbackDiv.classList.toggle('hidden', false)
    feedbackButton.innerHTML = 'Hide Feedback'
  }else{
    feedbackDiv.classList.toggle('hidden', true)
    feedbackButton.innerHTML = 'Show Feedback'
  }
}