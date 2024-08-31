import Quote from './../Quotes app/script.js'
import calender from '../Calender/script.js'

window.onload = async() => {
    let quoteGen = new QuoteBlock()
    quoteGen.loadQuote()
    let calenderObj = new calenderBlock()
    calenderObj.loadCalender()
    let stopwatchObj = new stopwatchBlock()
}

class QuoteBlock{
    async loadQuote(){
        let quoteGen = new Quote()
        let quote = await quoteGen.fetch_quote()
        debugger;
        let quoteblock = document.querySelector(".quote")
        quoteblock.querySelector('.quoteTxt').innerHTML = quote['text']
        quoteblock.querySelector('.author').innerHTML = "-" + quote['author'].split(",")[0]
    }    
}

class calenderBlock{
    async loadCalender(){
        let calenderTable = document.getElementById("calender_table_body");
        let today = new Date(Date.now());
        window.month = today.getMonth();
        window.year = today.getFullYear();
        window.date = today.getDate();
        window.day = today.getDay();
        let calenderObj = new calender(calenderTable, window.year, window.month, window.date, window.day);
        await calenderObj.load_calender();
        let nextMonthCall = () => {
            if (window.month == 11) {
                window.year += 1
            }
            window.month = (window.month+1)%12;
            calenderObj.month = window.month;
            calenderObj.load_calender();
            document.getElementById("nextmonth").addEventListener('click', nextMonthCall)
            document.getElementById("prevmonth").addEventListener('click', prevMonthCall)
        }
        
        let prevMonthCall = () => {
            if(window.month == 0) {
                window.year -= 1
                window.month = 11
            }else{
                window.month -= 1
            }
            calenderObj.month = window.month;
            calenderObj.load_calender();
            document.getElementById("prevmonth").addEventListener('click', prevMonthCall)
            document.getElementById("nextmonth").addEventListener('click', nextMonthCall)
        }
        document.getElementById("nextmonth").addEventListener('click', nextMonthCall)
        document.getElementById("prevmonth").addEventListener('click', prevMonthCall)
    }
}

class stopwatchBlock{
    nodeSec = document.querySelector("#sec");
    nodeMin = document.querySelector("#min");
    nodeHour = document.querySelector("#hour");
    lapsTable = document.querySelector(".stopwatchLapsBody");
    laps = []
    curSec = 0;
    curHour = 0
    curMin = 0;
    curState = false;
    interval = undefined;

    constructor(){
        let temp = new Date()
        temp.setHours(0,0,0)
        this.laps.push(temp)
        document.getElementById('stopwatchPlay').addEventListener('click', ()=>{
            this.play()
        })
        document.getElementById('stopwatchReset').addEventListener('click',()=>{
            this.reset()
        })
        document.getElementById('stopwatchLap').addEventListener('click', ()=>{
            this.lap()
        })
    }

    play(){
        if(!this.curState){
            this.curState = true;
            this.interval = setInterval(()=>{
                if(this.curSec == 59){
                    this.curMin = (this.curMin + 1) % 60
                    this.nodeMin = this.curMin
                    if(this.curMin == 59){
                        this.curHour += 1
                        this.nodeHour.innerHTML = this.curHour
                    }
                }
                this.curSec = (this.curSec + 1) % 60;
                this.nodeSec.innerHTML = this.curSec;
            },1000)
        }else{
            this.curState = false;
            clearInterval(this.interval);
        }
    }

    reset(){
        if(this.curState){
            this.curState = false;
            clearInterval(this.interval);
        }
        this.nodeHour.innerHTML = 0;
        this.nodeMin.innerHTML = 0;
        this.nodeSec.innerHTML = 0;
    }

    lap(){
        let curDate = new Date();
        curDate.setHours(this.curHour,this.curMin,this.curSec);
        let lastDate = this.laps[this.laps.length-1];
        let lapTime = Math.abs(curDate - lastDate);
        const diffSeconds = Math.floor(lapTime / 1000);
        const hours = Math.floor(diffSeconds / 3600);
        const minutes = Math.floor((diffSeconds % 3600) / 60);
        const seconds = diffSeconds % 60;
        lapTime = new Date();
        lapTime.setHours(hours,minutes,seconds);
        this.laps.push(lapTime)
        this.lapsTable.innerHTML += `
        <tr>
            <td class="p-1 colorBlue">
                ${this.laps.length}
            </td>
            <td class="p-1">
                ${lapTime.getHours()} : ${lapTime.getMinutes()} : ${lapTime.getSeconds()}
            </td>
            <td class="p-1">
                ${this.curHour} : ${this.curMin} : ${this.curSec}
            </td>
        </tr>`
    }

}