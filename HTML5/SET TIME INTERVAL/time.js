let number = 0
let timer = setInterval(()=> {
    number++
    if(number >= 5){
        clearInterval(timer)
    }

    console.log("the current number is --> " + number);
    
},2000)


// ========================
// countdown
var countdown = 0
const countEl = document.querySelector(".countdown")
const startBtn = document.getElementById('start')
const stopBtn = document.getElementById('stop')
const resetBtn = document.getElementById('reset')

let countInterval;
function start(){
    countInterval = setInterval(()=>{
    countEl.textContent = countdown


    if(countdown == 1000){
        clearInterval(countInterval)
        // countEl.textContent = "time Out"
        // countEl.style.color = "red"
        // countEl.style.textShadow = "0 0 15px red"
    }else{
        countdown++
    }
},50)
}

function stop(){
    if (countInterval) {
        clearInterval(countInterval)
        countInterval = false
    }
}

function reset(){
    stop()
    countdown = 0
    countEl.textContent = '0'
    countEl.style.color = 'white'
}
// ==================
// timer

function updateclock(){
    const now = new Date()
    let hour = now.getHours()
    let minutes = now.getMinutes()
    let seconds = now.getSeconds()

    hour = hour < 10 ? `0${hour}` : hour
    minutes = minutes < 10 ? `0${minutes}` : minutes
    seconds = seconds < 10 ? `0${seconds}` : seconds

    const stringValuesOfDate  = `${hour} : ${minutes} : ${seconds}`
    document.querySelector(".clock").innerHTML = stringValuesOfDate
}
setInterval(updateclock,1000)
updateclock()