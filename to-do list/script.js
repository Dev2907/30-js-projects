let drag_task_list = [];
import taskDB from "./DB.js"

let db = null
let num_tasks = null;
window.onload = function(){
    let success = async (val) =>{
        num_tasks = val
        await displaytask()
        drag_task_list = document.querySelectorAll('.item')
        let box = document.querySelectorAll('.box')
        drag_task_list.forEach((element)=>{
            add_dragabble_event(element);
        });
        box.forEach((element)=>{
            add_box_event(element);
        });
        let input = document.getElementById("task");
        input.addEventListener('keypress',(event)=>{
            if(event.key == "Enter" ){
                addtask()
            }
        })
    }

    db = new taskDB(success);
}

function _task(key,name,completed){
    let html =  `<div class="box w-100 "></div>
                <div draggable="true" id="${key}" class="item d-flex justify-content-between my-2">
                    <div id="task_done_but_${key}" class="me-2 rounded-circle ${completed? "add_button" : ""}"><button onclick="${completed? `task_undone(${key})` : `task_done('${key}')`}" class="${completed? 'add_button border-0 text-white rounded-circle fa-solid fa-check': 'bg-white border-0 fa-regular fa-circle'}"></button></div>
                    <div id="task_name_${key}" class="flex-fill w-75 task_name ${completed? 'text-decoration-line-through':''}">${name}</div>
                    <div><button onclick="delete_task('${key}')" class="bg-white border-0 fa-solid fa-xmark"></button></div>
                </div>`
    return html;
}

function add_dragabble_event(element){
    element.addEventListener('dragstart',(event)=>{
        event.dataTransfer.setData('item_id',event.target.id)
        event.target.classList.remove('d-flex')
        event.target.classList.add('hide');            
    })
    element.addEventListener('dragend',(event)=>{
        event.target.classList.remove('hide')
        event.target.classList.add('d-flex')
    })
}

function add_box_event(element){
    element.addEventListener('dragover',(event)=>{
        event.preventDefault();
        event.target.classList.add('dropover')
    });
    element.addEventListener('dragleave',(event)=>{
        event.target.classList.remove('dropover')
    })
    element.addEventListener('drop',(event)=>{
        event.preventDefault(); 
        let task = document.getElementById(event.dataTransfer.getData('item_id'));
        let tasks = document.getElementById('task_list')
        let boxabove = document.createElement("div")
        let boxbelow = document.createElement("div")
        boxabove.className = "box w-100"
        boxbelow.className = "box w-100"
        if (task.nextSibling != event.target){
            task.nextSibling.remove();
        }
        tasks.replaceChild(task,event.target)
        tasks.insertBefore(boxabove,task)
        tasks.insertBefore(boxbelow,task.nextSibling)
        add_box_event(boxabove)
        add_box_event(boxbelow)
    })
}

async function addtask(){
    let task = document.getElementById("task");
    if (task.value != ""){
        num_tasks+=1
        let task_id = await db.add_task({"task": task.value, "is_done": false})
        document.getElementById("task_list").innerHTML += _task(task_id,task.value,false)
        task.value = "";
    }
}

async function displaytask(){
    let task_list = await db.get_tasks()
    let html = "";
    for(let i = 0; i < task_list.length; i+=1){
        html += _task(task_list[i].key, task_list[i].value.task, task_list[i].value.is_done);
        if (i == task_list.length - 1) {
            html += `<div class="box w-100"></div>`
        }
    }
        document.getElementById("task_list").innerHTML = html
}

async function task_done(id){
    let task_name = document.getElementById(`task_name_${id}`);
    let task_but = document.getElementById(`task_done_but_${id}`);
    let update_status =  await db.update_task_status(parseInt(id),true)
    if (update_status){
        task_name.classList.add("text-decoration-line-through")
        task_but.classList.add("add_button");
        task_but.innerHTML = `<button onclick="task_undone('${id}')" class="add_button border-0 text-white rounded-circle fa-solid fa-check"></button>`
    }
}

async function task_undone(id){
    let task_name = document.getElementById(`task_name_${id}`);
    let task_but = document.getElementById(`task_done_but_${id}`);
    let update_status =  await db.update_task_status(id,false)
    if (update_status){
        task_name.classList.remove("text-decoration-line-through");
        task_but.classList.remove("add_button");
        task_but.innerHTML = `<button onclick="task_done('${id}')" class="bg-white border-0 fa-regular fa-circle"></button>`
    }
}

async function delete_task(id){
    await db.delete_task(parseInt(id));
    displaytask()
}

function clear_all(){
    db.delete_all_tasks()
    displaytask()
}

window.addtask = addtask
window.task_done = task_done
window.task_undone = task_undone
window.delete_task = delete_task
window.clear_all = clear_all