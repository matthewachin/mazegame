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
}