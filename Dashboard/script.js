import Quote from './../Quotes app/script.js'
import calender from '../Calender/script.js'
import taskDB from "../to-do list/DB.js"

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
        window.date_obj = today;
        window.month = today.getMonth();
        window.year = today.getFullYear();
        window.date = today.getDate();
        window.day = today.getDay();
        let calenderObj = new calender(calenderTable, window.year, window.month, window.date, window.day);
        calenderObj.load_calender();
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
    lapPage = 0

    clearlaps(){
        this.laps = []
        let temp = new Date()
        temp.setHours(0,0,0)
        this.laps.push([temp,temp])
    }

    constructor(){
        this.clearlaps()
        document.getElementById('stopwatchPlay').addEventListener('click', ()=>{
            this.play()
        })
        document.getElementById('stopwatchReset').addEventListener('click',()=>{
            this.reset()
        })
        document.getElementById('stopwatchLap').addEventListener('click', ()=>{
            this.lap()
        })
        document.getElementById("lapTable_prev").addEventListener('click', ()=>{
            this.prev()
        })
        document.getElementById("lapTable_next").addEventListener('click', ()=>{
            this.next()
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
        this.lapsTable.innerHTML = `
        <tr>
            <td class="p-1 colorBlue">
                0
            </td>
            <td class="p-1">
                0 : 0 : 0
            </td>
            <td class="p-1">
                0 : 0 : 0
            </td>
        </tr>`
        this.clearlaps()
    }

    lap(){
        let curDate = new Date();
        curDate.setHours(this.curHour,this.curMin,this.curSec);
        let lastDate = this.laps[this.laps.length-1][0];
        let lapTime = Math.abs(curDate - lastDate);
        const diffSeconds = Math.floor(lapTime / 1000);
        const hours = Math.floor(diffSeconds / 3600);
        const minutes = Math.floor((diffSeconds % 3600) / 60);
        const seconds = diffSeconds % 60;
        lapTime = new Date();
        let overAlltime = new Date()
        lapTime.setHours(hours,minutes,seconds);
        overAlltime.setHours(this.curHour,this.curMin,this.curSec)
        this.laps.push([lapTime,overAlltime ])

        if((this.laps.length - 2) % 3 == 0){
            if(this.laps.length > 2) this.lapPage += 1;
            this.lapsTable.innerHTML = '';
        }
        this.displayLap(this.laps.length-1,lapTime,overAlltime);
    }

    displayLap(index,lapTime,overAlltime){
        this.lapsTable.innerHTML += `
        <tr>
            <td class="p-1 colorBlue">
                ${index}
            </td>
            <td class="p-1">
                ${lapTime.getHours()} : ${lapTime.getMinutes()} : ${lapTime.getSeconds()}
            </td>
            <td class="p-1">
                ${overAlltime.getHours()} : ${overAlltime.getMinutes()} : ${overAlltime.getSeconds()}
            </td>
        </tr>`
    }

    next(){
        if (this.lapPage >= parseInt((this.laps.length - 2) / 3)){
            return
        }
        this.lapPage += 1;
        this.lapsTable.innerHTML = "";
        for(let i = 0; i < 3; i++){
            let index = this.lapPage*3 + 1 + i
            if(index < this.laps.length){
                let lapTime = this.laps[index][0];
                let overAlltime = this.laps[index][1];
                this.displayLap(index,lapTime,overAlltime)
            }
        }
    }

    prev(){
        if (this.lapPage <= 0){
            return
        }
        this.lapPage -= 1;
        this.lapsTable.innerHTML = "";
        for(let i = 0; i < 3; i++){
            let index = this.lapPage*3 + 1 + i;
            if(index < this.laps.length - 1){
                let lapTime = this.laps[index][0];
                let overAlltime = this.laps[index][1];
                this.displayLap(index,lapTime,overAlltime)
            }
        }
    }

}

class taskBlock{
    constructor(){
        this.taskList = document.querySelector(".taskList");
        let success = (val) => {
            show_all(val);
        }
        this.taskdb = new taskDB(success, this.convertDate(window.date_obj));
    }

    convertDate(date){
        return date.toISOString().substring(0,10);
    }

    async show_all(){
        this.taskList.innerHTML = "";
        let tasks = await this.taskdb.get_tasks(this.convertDate(window.date_obj));
        for (let i = 0; i < num_tasks; i+=1){
            let task_div = document.createElement('div');
            task_div.innerHTML = _task(tasks[i]["id"], tasks[i]["name"], tasks[i]["is_done"]);
            task_div.querySelector(".task-delete").addEventListener('click', () => delete_task(`task_${task_id}`))
            task_div.querySelector(".task-status").addEventListener('click', () => update_task_status(`task_${task_id}`))
        }
    }

    _task(id, task, done){
        return `
            <div done="${+done}" id="task_${id}" class="task-delete d-flex justify-content-between py-2 px-2 align-items-center">
                <span class="${done? 'colorBGrey' : ''}" ><span>01 &nbsp;&nbsp;</span>${task}</span>
                <i class="task-status ${done? 'fa-regular fa-circle' : 'fa-solid fa-circle-check colorGreen'}"></i>
            </div>
        `
    }

    delete_task(id){
       let task = document.getElementById(id);
    }
}