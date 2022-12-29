function checkLogged(userRequired=false){
  const user = window.localStorage.user 
  if(user === undefined){
    return userRequired ? window.location.href='/login':{
      username : 'Guest',
      password : null,
    }
  }else{
    return JSON.parse(user)
  }
}
function logout(){
  window.localStorage.removeItem('user')
  window.location.href = '/'
}