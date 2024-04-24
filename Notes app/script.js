import notesDB from "./DB.js";

let db = null;
let num_notes = null;
let cur_placements = {}
let allow_update=true;
window.onload = ()=>{
    let success =(notes,placements )=>{
        cur_placements = placements;
        num_notes = notes
        console.log(`Current Number of Notes : ${num_notes}`);
        show_all(num_notes,cur_placements);
    }
    db = new notesDB(success)
}
window.addEventListener("beforeunload", function(event) {
    // Code to execute when the page is about to be unloaded
    // You can also return a string to display a confirmation message to the user
    if(!allow_update){
        event.preventDefault(); // This is necessary for some browsers to display the confirmation dialog
        this.document.getElementById("all_notes").innerHTML = "";
        event.returnValue = ""; // This is necessary for some browsers to display the confirmation dialog
    }
});

function disable_create_new(){
    allow_update = false;
    document.getElementById("new_note_btn").disabled = true;
}

function enable_create_new(){
    allow_update = true;
    document.getElementById("new_note_btn").disabled = false;
}

function _note(is_input, key="",heading="", tags="", content=""){
    if (is_input){
        return  `<div class="note card p-2">
        <div class="d-flex w-100 gap-1">
            <input id="heading" oninput="add_btn_status()" class="border-0 w-50" type="text" placeholder="Heading" />
            <input id="tags" type="text" placeholder="Tags (comma separated)" class="border-0 w-50" />
        </div>
        <hr />
        <p class="card-text"><textarea oninput="add_btn_status()" id="content" class="w-100"></textarea></p>
        <div class="d-flex gap-2">
            <button id="add_note_btn" onclick="add_new_note()" class="w-50 btn btn-dark">Add</button>
            <button onclick="cancel_new_note()" class="w-50 btn btn-dark">Cancel</button>
        </div>
    </div>`
    }

    let tags_string = ""
    for(let i=0; i<tags.length; i++) {
        tags_string += `<div class="tag bg-success rounded-pill py-1 px-2 text-white">${tags[i]}</div>`
    }

    let html=`<div id=${key} draggable="true" class="note card p-2">
    <div class=" w-100 gap-2 ">
        <div class="d-flex w-100 card-title">
            <h5 class="head text-wrap fw-bold">${heading}</h5>
            <i onclick="delete_note('${key}')" class="fa-solid fa-trash-can"></i>
        </div>
        <div class="tags flex-wrap d-flex gap-2 align-items-center">
            ${tags_string}
        </div>
    </div>
    <hr />
    <textarea class="card-text border-0" readonly>${content}</textarea>
    </div>
    `
    return html
}

function add_btn_status(){
    let heading = document.getElementById("heading").value;
    let content = document.getElementById("content").value;
    if (!heading || !content){
        document.getElementById("add_note_btn").disabled = true;
    }else{
        document.getElementById("add_note_btn").disabled = false;
    }
}

function _shift(direction, start, end){
    if (direction == 'backward'){
        for(let i=start; i<end; i+=1){
            let cur_box = document.getElementById(i);
            let next_box = document.getElementById(i+1);
            cur_box.appendChild(next_box.firstElementChild);
            cur_placements[cur_box.id] = cur_box.firstElementChild.id
        }
    }else{
        for(let i=start; i>end; i-=1){
            let cur_box = document.getElementById(i);
            let prev_box = document.getElementById(i-1);
            cur_box.appendChild(prev_box.firstElementChild);
            cur_placements[cur_box.id] = cur_box.firstElementChild.id;
        }
    }
    db.setplacement(cur_placements);
}

function add_draggable_event(node){
    node.addEventListener("dragstart",(event)=>{
        let obj = {
            "box":event.target.parentElement.id,
            "child":event.target.id
        }
        event.dataTransfer.setData("first",JSON.stringify(obj))
    })
}

function add_box_event(node){
    node.addEventListener('dragover',(event)=>{
        event.preventDefault();
        event.target.classList.add('dropover')
    });
    node.addEventListener('dragleave',(event)=>{
        event.target.classList.remove('dropover')
    });
    node.addEventListener('drop',(event)=>{
        event.preventDefault();
        let obj = JSON.parse(event.dataTransfer.getData("first"))
        let prev_box = document.getElementById(obj["box"]);
        let target_box = event.currentTarget;
        let prev_note = document.getElementById(obj["child"]);
        let target_note = target_box.firstElementChild;
        prev_box.replaceChild(target_note,prev_note);
        target_box.appendChild(prev_note);
        cur_placements[prev_box.id] = target_note.id;
        cur_placements[target_box.id]  = prev_note.id;
        db.setplacement(cur_placements)
    })
}

async function show_all(num_notes, cur_placements) {
    for (let i = 0; i < num_notes; i += 1) {
        let match = cur_placements[i].match(/\d+/)[0];
        let note = await db.get_note(parseInt(match));
        if (note) {
            add_box(i);
            add_note(i, cur_placements[i], note['name'], note['tags'], note['content']);
        } else {
            break;
        }
    }
}

function add_box(id){
    let last_row = document.querySelectorAll('.row_last')[0]
    if (last_row.childElementCount == 2){
        last_row.classList.remove("row_last");
        last_row = document.createElement("div");
        last_row.classList.add("row","row_last");
        document.getElementById("all_notes").appendChild(last_row);
        document.getElementById("all_notes").appendChild(document.createElement('br'));
    }
    let new_box = document.createElement('div');
    add_box_event(new_box);
    new_box.id = id;
    new_box.classList.add("box", "col-6")
    last_row.appendChild(new_box);
    return new_box;
}

function createNewNote(id=0){
    if(allow_update){
        disable_create_new();
        add_box(num_notes);
        cur_placements = {};
        _shift("foreward",num_notes,0)
        let box_0 = document.getElementById(id);
        box_0.innerHTML = _note(true);
        add_btn_status()
    }
}

async function add_new_note(){
    let heading = document.getElementById("heading").value;
    let tags = document.getElementById("tags").value;
    let content = document.getElementById("content").value;
    tags = tags? tags.split(",") : [];
    let data = {
        "name": heading, 
        "tags": tags, 
        "content": content,
    }
    let id = await db.add_note(data)
    if(id){
        add_note(0,`item_${id}`,heading,tags,content)
        enable_create_new()
        num_notes+=1;
    }
}

function add_note(box_id,key,heading, tags, content) {
    let box = document.getElementById(box_id);
    box.innerHTML = _note(false,key,heading,tags,content);
    add_draggable_event(box.firstElementChild)
    cur_placements[box_id] = key;
    db.setplacement(cur_placements);
}

function cancel_new_note(){
    document.getElementById(0).firstElementChild.remove()
    cur_placements = {}
    _shift("backward",0,num_notes)
    document.getElementById(num_notes).remove();
    enable_create_new();
}

async function delete_note(key){
    try{
        let match = key.match(/\d+/)[0];
        await db.delete_note(parseInt(match))
        let note = document.getElementById(key);
        let box = note.parentElement;
        note.remove();
        _shift("backward",parseInt(box.id),num_notes-1)
        document.getElementById(num_notes-1).remove();
        num_notes-=1;
        let last_row = document.querySelectorAll('.row_last')[0];
        if (last_row.childElementCount == 0 && document.querySelectorAll(".row").length>2){
            last_row.remove();
            document.getElementById(num_notes-1).parentElement.classList.add("row_last");
        }
    }catch(error){
        console.log(error)
    }
}

async function search_note(query){
    if(query){
        let callback = (key,record) => {
            let box = add_box(0)
            box.innerHTML = _note(false,`item_${key}`,record["name"],record["tags"],record["content"]);
        }
        document.getElementById('all_notes').innerHTML = "<div class='row row_last'></div><br/>";
        disable_create_new();
        allow_update = false;
        db.search_note(query, callback);

    }else{
        clear_search_input()
        enable_create_new();
    }
}

function clear_search_input(){
    document.getElementById('all_notes').innerHTML = "<div class='row row_last'></div><br/>";
    document.getElementById("search").value = '';
    show_all(num_notes,cur_placements)
}

window.clear_search_input = clear_search_input
window.createNewNote = createNewNote
window.add_new_note = add_new_note
window.cancel_new_note = cancel_new_note
window.delete_note = delete_note
window.search_note = search_note
window.add_btn_status = add_btn_status