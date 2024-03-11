let drag_task_list = [];

window.onload = function(){
    check_task_list();
    displaytask();
    drag_task_list = document.querySelectorAll('.item')
    box = document.querySelectorAll('.box')
    drag_task_list.forEach((element)=>{
        add_dragabble_event(element);
    });
    box.forEach((element)=>{
        add_box_event(element);
    });
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
        // debugger;
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

function check_task_list(){
    if (! localStorage.hasOwnProperty("task_list") || ! Array.isArray(JSON.parse(localStorage.getItem("task_list"))) ){
        task_list = [];
        localStorage.setItem("task_list",JSON.stringify(task_list));
    }
}

function addtask(){
    check_task_list();
    let task_list = JSON.parse(localStorage.getItem("task_list"));
    let task = document.getElementById("task");
    if (task.value != ""){
        task_id = task_list.length
        task_list.push({"id": task_id,"task": task.value, "is_done": false});
        localStorage.setItem("task_list",JSON.stringify(task_list));
        let html = `
                    <div id="${task_id}" draggable="true" class="item d-flex justify-content-between my-2">
                        <div id="task_done_but_${task_id}" class="me-2 rounded-circle"><button onclick="task_done('${task_id}')" class="bg-white border-0 fa-regular fa-circle"></button></div>
                        <div id="task_name_${task_id}" class="flex-fill">${task.value}</div>
                        <div><button onclick="delete_task('${task_id}')" class="bg-white border-0 fa-solid fa-xmark"></button></div>
                    </div>
                    <div class="box w-100 "></div>`
        document.getElementById("task_list").innerHTML += html
        task.value = "";
    }
}

function displaytask(){
    let task_list = JSON.parse(localStorage.getItem("task_list"));
    let html = "";
    for(let i = 0; i < task_list.length; i+=1){
        if (! task_list[i].is_done){
            html += `<div class="box w-100"></div>
                    <div draggable="true" id="${task_list[i].id}" class="item d-flex justify-content-between my-2">
                        <div id="task_done_but_${task_list[i].id}" class="me-2 rounded-circle"><button onclick="task_done('${task_list[i].id}')" class="bg-white border-0 fa-regular fa-circle"></button></div>
                        <div id="task_name_${task_list[i].id}" class="flex-fill">${task_list[i].task}</div>
                        <div><button onclick="delete_task('${i}')" class="bg-white border-0 fa-solid fa-xmark"></button></div>
                    </div>`
        }else{
            html += `<div class="box w-100 "></div>
                    <div draggable="true" id="${task_list[i].id}" class="item d-flex justify-content-between my-2">
                        <div id="task_done_but_${task_list[i].id}" class="me-2 rounded-circle add_button"><button onclick="task_done('${task_list[i].id}')" class="add_button border-0 text-white rounded-circle fa-solid fa-check"></button></div>
                        <div id="task_name_${task_list[i].id}" class="flex-fill text-decoration-line-through">${task_list[i].task}</div>
                        <div><button onclick="delete_task('${i}')" class="bg-white border-0 fa-solid fa-xmark"></button></div>
                    </div>`
        }
        if (i == task_list.length - 1) {
            html += `<div class="box w-100"></div>`
        }
    }
        document.getElementById("task_list").innerHTML = html
}

function task_done(id){
    let task_list = JSON.parse(localStorage.getItem("task_list"))
    task_list[Number(id)].is_done = ! task_list[Number(id)].is_done 
    localStorage.setItem("task_list",JSON.stringify(task_list))
    let curtask = document.getElementById(`task_name_${id}`)
    let curtask_but = document.getElementById(`task_done_but_${id}`)
    if (! task_list[Number(id)].is_done){
        curtask.classList.remove("text-decoration-line-through");
        curtask_but.classList.remove("add_button");
        curtask_but.innerHTML = `<button onclick="task_done('${id}')" class="bg-white border-0 fa-regular fa-circle"></button>`
    }else{
        curtask.classList.add("text-decoration-line-through");
        curtask_but.classList.add("add_button");
        curtask_but.innerHTML = `<button onclick="task_done('${id}')" class="add_button border-0 text-white rounded-circle fa-solid fa-check"></button>`
    }
}

function delete_task(id){
    let task_list = JSON.parse(localStorage.getItem("task_list"))
    task_list.splice(Number(id),1)
    localStorage.setItem("task_list",JSON.stringify(task_list))
    displaytask()
}

function clear_all(){
    localStorage.setItem("task_list",JSON.stringify([]));
    displaytask()
}