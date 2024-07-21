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
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
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
    document.getElementById("task-input").addEventListener('keypress', (event)=>{
        if(event.key == "Enter"){
            add_task();
        }
    })
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
    if(ev.target.classList.contains("box")){
        ev.target.classList.add('dropover');
    }
}

function dragleave(ev){
    ev.preventDefault();
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
    let task1_id = task1.id.match(/\d+$/)[0];
    let task2_id = task2.id.match(/\d+$/)[0];
    db.update_task(task1_id,{"box_id":box2.id})
    db.update_task(task2_id,{"box_id":box1.id})
    box1.removeChild(task1);
    box1.appendChild(task2);
    box2.appendChild(task1);
}

function _note(id, task, done){
    return `<div done="${+done}" id="task_${id}" draggable="true" ondragstart="drag(event)" class="task fs-6 d-flex ${done?'text-secondary' : ''}">
                            <div class="flex-fill">${task}</div>
                            <div class="d-flex gap-2">
                                <div class="delete-btn mouse_hover"><i class="fa-solid fa-trash"></i></div>
                                <div class="task-status mouse_hover"><i class="fa-circle-check ${done?'text-success fa-solid' : 'fa-regular'}"></i></div>
                            </div>
                        </div>`
}

async function add_box(id){
    let task_list = document.getElementById("task_list");
    let new_box = document.createElement('div')
    new_box.id = id;
    new_box.classList.add('box');
    new_box.addEventListener("drop", (e)=>{e.stopPropagation();drop(e)})
    new_box.addEventListener("dragover", (e)=>{e.stopPropagation();dragover(e)})
    new_box.addEventListener("dragleave", (e)=>{e.stopPropagation();dragleave(e)})
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
    box.querySelector(".delete-btn").addEventListener('click', () => delete_task(`task_${task_id}`))
    box.querySelector(".task-status").addEventListener('click', () => update_task_status(`task_${task_id}`))
    return box;
}

async function add_task(){
    let task_input = document.getElementById("task-input");
    let date = document.getElementById("datepicker").value;
    let box_id = `box_${num_tasks+1}`;
    let box = add_box(box_id);
    let task_id = await add_task_db(task_input.value,false,date,box_id);
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

async function delete_task(id){
    let task = document.getElementById(id);
    let box = task.parentElement;
    let val = delete_task_display(box, task);
    db.delete_task(id.match(/\d+$/)[0],val["mapping"]);
    num_tasks-=1
}


function delete_task_display(box, task){
    let box1_id = parseInt(box.id.match(/\d+$/)[0]);
    let new_mapping = {}
    box.remove();
    for (let i = box1_id+1; i <= num_tasks; i++){
        let box = document.getElementById(`box_${i}`);
        let t = box.firstChild;
        box.id = `box_${i-1}`
        new_mapping[t.id] = box.id;
    }
    return {
        "task": task.id,
        "mapping": new_mapping
    };
}

async function update_task_status(id){
    let task = document.getElementById(id);
    let status = Boolean(parseInt(task.getAttribute("done")));
    let res = await db.update_task_status(parseInt(id.match(/\d+$/)[0]), !status);
    if(res){
        let btn = task.querySelector(".task-status").firstChild
        if(!status){
            task.classList.add("text-secondary");
            btn.classList.add("text-success" ,"fa-solid")
        }else{
            task.classList.remove("text-secondary");
            btn.classList.remove("text-success" ,"fa-solid")
            btn.classList.add('fa-regular')
        }
        task.setAttribute("done", +!status)
    }
}

window.add_task = add_task
window.dragover = dragover
window.drag = drag
window.drop = drop
window.handleDatePicker = handleDatePicker;
window.dragleave = dragleave;
