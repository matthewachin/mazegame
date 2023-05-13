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
function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}
document.getElementById('copyButton').addEventListener('click',()=>{
  copyTextToClipboard(document.getElementById('game-link').innerHTML)
})