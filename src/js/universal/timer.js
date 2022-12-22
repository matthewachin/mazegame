class Timer{
  constructor(id='timer', countdown= false, startTime=0){
    this.e = document.getElementById(id)
    this.start = Date.now()
    this.interval = null
  }
  resetTimer(){
    this.start = Date.now()
  }
  getElapsedTime(readable=true){
    return readable ? this.msReadable(Date.now() - this.start) : Date.now() - this.start
  }
  getCurrentTime(){
    return Date.now()
  }
  msReadable(ms){
    const milliseconds = Math.floor(ms%100)
    const seconds=Math.floor((ms/1000)%60)
    const minutes=Math.floor((ms/(1000*60))%60)
    const hours=Math.floor((ms/(3600000))%24)
    if(hours){
      return `${String(hours)}:${this.cleanify(minutes)}:${this.cleanify(seconds)}`
    }
    if(minutes){
      return `${String(minutes)}:${this.cleanify(seconds)}:${this.cleanify(milliseconds)}`
    }
    return `${String(seconds)}:${this.cleanify(milliseconds)}`
  }
  cleanify(n){
    return n < 10 ?`0${String(n)}` : String(n)
  }
  update(){
    this.e.innerHTML = this.getElapsedTime()
  }
  on(ms){
    this.interval = setInterval((obj)=>{
      obj.update()
    }, ms, this)
  }
  off(){
    clearInterval(this.interval)
  }
}