import taskDB from "./DB.js"

let db = null;
let num_tasks = 0
let months = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec'
}
let days = {
    0: 'Monday',
    1: 'Tuesday',
    2: 'Wednesday',
    3: "Thursday",
    4: "Friday",
    5: "Saturday",
    6: "Sunday"
}

window.onload = () =>{
    let now = new Date(Date.now());
    document.getElementById("datepicker").value = now.toISOString().substring(0,10);
    changeDate(now);
    let success = (val) =>{
        num_tasks = val;
        show_all(num_tasks);
    }
    db = new taskDB(success, document.getElementById("datepicker").value);
}

async function handleDatePicker(ev){
    let dt = new Date(ev.target.value)
    changeDate(dt)
    num_tasks = await db.count_tasks(dt.toISOString().substring(0,10))
    show_all()
}

function changeDate(dt){
    document.getElementById("datepicker_date").innerHTML = dt.getDate();
    document.getElementById("datepicker_month").innerHTML = months[dt.getMonth()];
    document.getElementById("datepicker_year").innerHTML = dt.getFullYear();
    document.getElementById("datepicker_day").innerHTML = days[dt.getDay()]
    document.getElementById("datepicker").value = dt.toISOString().substring(0,10);
}

function dragover(ev) {
    ev.preventDefault();
    ev.target.classList.add('dropover');
}

function dragleave(ev){
    ev.target.classList.remove('dropover')
}

function drag(ev) {
    ev.dataTransfer.setData("task", ev.target.id);
    ev.dataTransfer.setData("box", ev.target.parentElement.id)

}
  
function drop(ev) {
    ev.preventDefault();
    let box1 = document.getElementById(ev.dataTransfer.getData("box"))
    let task1 = document.getElementById(ev.dataTransfer.getData("task"))
    let box2 =  ev.target.closest('.box')
    let task2 = box2.firstElementChild;
    box1.removeChild(task1);
    box1.appendChild(task2);
    box2.appendChild(task1);
}

function _note(id, task, done){
    return `<div id="box_${id}" class="box p-1" ondrop="drop(event)" ondragover="dragover(event)" ondragover="dragleave(event)">
                        <div id="task_${id}" draggable="true" ondragstart="drag(event)" class="task fs-6 d-flex ${done?'text-secondary' : ''}">
                            <div class="flex-fill">${task}</div>
                            <div class="d-flex gap-2">
                                <div><i class="fa-solid fa-trash"></i></div>
                                <div><i class="fa-circle-check ${done?'text-success fa-solid' : 'fa-regular'}"></i></div>
                            </div>
                        </div>
                    </div>`
}

async function add_box(id){
    let task_list = document.getElementById("task_list");
    let new_box = document.createElement('div')
    new_box.id = id;
    task_list.appendChild(new_box);
    return new_box;
}

async function add_task_db(task, done, date, box_id){
    let data = {
        "name" : task,
        "is_done": done,
        "date": date,
        "box_id": box_id,
    }
    let res = await db.add_task(data);
    return res;
}

async function add_task_display(task, done, box_id, task_id){
    let box = document.getElementById(box_id);
    box.innerHTML = _note(task_id, task, done);
    return box;
}

async function add_task(){
    let task_input = document.getElementById("task-input");
    let date = document.getElementById("datepicker").value;
    let box_id = `box_${num_tasks+1}`;
    let box = add_box(box_id);
    let task_id = add_task_db(task_input.value,false,date,box_id);
    add_task_display(task_input.value,false,box_id,task_id);
    task_input.value = "";
    num_tasks++;
}

async function show_all(){
    document.getElementById("task_list").innerHTML = ""
    let dateinp = document.getElementById("datepicker")
    let tasks = await db.get_tasks(dateinp.value);
    for (let i = 1; i <= num_tasks; i+=1){
        add_box(`box_${i}`);
    }
    for (let i = 0; i < num_tasks; i+=1){
        add_task_display(tasks[i]["name"], tasks[i]["is_done"], tasks[i]["box_id"], tasks[i]["id"])
    }
}

window.add_task = add_task
window.dragover = dragover
window.drag = drag
window.drop = drop
window.handleDatePicker = handleDatePicker;
window.dragleave = dragleave;