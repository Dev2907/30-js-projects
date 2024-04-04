let num_notes = 0
let cur_placements = {}
let cur_state="view";
window.onload = ()=>{
    if(! localStorage.hasOwnProperty("cur_placement")){
        localStorage.setItem("cur_placement",JSON.stringify({}))
    }
    
    let request = indexedDB.open("notes", 1)
    request.onerror = (event)=>{
        console.log(`DB Error: ${event.target.errorCode}`)
    }

    request.onupgradeneeded = (event)=>{
        console.log("upgrade")
        const db = event.target.result;
        const object_store = db.createObjectStore("all_notes", {KeyPath:"id", autoIncrement: true});
        object_store.createIndex("tags","tags");
        object_store.createIndex("name","name")
    }
    
    request.onsuccess = (event)=>{
        let db = event.target.result;
        let object_store = db.transaction(["all_notes"],"readwrite").objectStore("all_notes");
        let request_all = object_store.count()
        request_all.onsuccess=(event)=>{
            cur_placements = JSON.parse(localStorage.getItem("cur_placements"));
            num_notes = event.target.result
            show_all();
        }
    }

    document.getElementById("search").addEventListener('keypress',(event)=>{
        if(event.key == "Enter" ){
            search_note(document.getElementById("search").value);
        }
    })
}
window.addEventListener("beforeunload", function(event) {
    // Code to execute when the page is about to be unloaded
    // You can also return a string to display a confirmation message to the user
    event.preventDefault(); // This is necessary for some browsers to display the confirmation dialog
    if(cur_state == "input"){
        cancel_new_note()
        event.returnValue = ""; // This is necessary for some browsers to display the confirmation dialog
    }
});

function _note(is_input, key="",heading="", tags="", content=""){
    if (is_input){
        return  `<div class="note card p-2">
        <div class="d-flex w-100 gap-1">
            <input id="heading" class="border-0 w-50" type="text" placeholder="Heading" />
            <input id="tags" type="text" placeholder="Tags (comma separated)" class="border-0 w-50" />
        </div>
        <hr />
        <p class="card-text"><textarea id="content" class="w-100"></textarea></p>
        <div class="d-flex gap-2">
            <button onclick="add_new_note()" class="w-50 btn btn-dark">Add</button>
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
    localStorage.setItem("cur_placements", JSON.stringify(cur_placements));
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
        localStorage.setItem("cur_placements", JSON.stringify(cur_placements));
    })
}

function dbrequest(successcallback) {
    let request = indexedDB.open("notes")
    request.onerror = (event)=>{
        console.log(`DB Error: ${event.target.errorCode}`)
    }
    request.onsuccess = successcallback
}

function show_all(){
    dbrequest((event)=>{
        let object_store = event.target.result.transaction(["all_notes"],"readwrite").objectStore("all_notes");
        for(let i=0; i<num_notes; i+=1){
            let match = cur_placements[i].match(/\d+/)[0];
            let request_note = object_store.get(parseInt(match))
            request_note.onsuccess = (event)=>{
                let obj = event.target.result;
                add_box(i);
                add_note(i,cur_placements[i],obj['name'],obj['tags'],obj['content'])
            }
        }
    });
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
    if(cur_state == "view"){
        cur_state = "input";
        add_box(num_notes);
        cur_placements = {};
        _shift("foreward",num_notes,0)
        let box_0 = document.getElementById(id);
        box_0.innerHTML = _note(true);
    }
}

function add_new_note(){
    let heading = document.getElementById("heading").value;
    let tags = document.getElementById("tags").value;
    let content = document.getElementById("content").value;
    tags = tags.split(",");

    dbrequest((event)=>{
        let object_store = event.target.result.transaction(["all_notes"],"readwrite").objectStore("all_notes");
        let request_add = object_store.add({
        "name": heading, 
        "tags": tags, 
        "content": content,
        })
        request_add.onsuccess=(event)=>{
            add_note(0,`item_${event.target.result}`,heading,tags,content)
            cur_state = "view"
            num_notes+=1;
        }
    })
}

function add_note(box_id,key,heading, tags, content) {
    let box = document.getElementById(box_id);
    box.innerHTML = _note(false,key,heading,tags,content);
    add_draggable_event(box.firstElementChild)
    cur_placements[box_id] = key;
    localStorage.setItem("cur_placements", JSON.stringify(cur_placements));
}

function cancel_new_note(){
    document.getElementById(0).firstElementChild.remove()
    cur_placements = {}
    _shift("backward",0,num_notes)
    document.getElementById(num_notes).remove();
}

function delete_note(key){
    dbrequest((event)=>{
        let object_store = event.target.result.transaction(["all_notes"],"readwrite").objectStore("all_notes");
        let match = key.match(/\d+/)[0];
        let request_delete = object_store.delete(parseInt(match));
        request_delete.onsuccess = ()=>{
            let note = document.getElementById(key);
            let box = note.parentElement;
            note.remove();
            _shift("backward",parseInt(box.id),num_notes-1)
            document.getElementById(num_notes-1).remove();
            num_notes-=1;
            last_row = document.querySelectorAll('.row_last')[0];
            if (last_row.childElementCount == 0 && document.querySelectorAll(".row").length>2){
                last_row.remove();
                document.getElementById(num_notes-1).parentElement.classList.add("row_last");
            }
        }
    });
}

function search_note(query){
    if(query){
        document.getElementById('all_notes').innerHTML = "<div class='row row_last'></div><br/>";
        cur_state = "search";
        dbrequest((event)=>{
            let request_cursor = event.target.result.transaction(["all_notes"],"readwrite").objectStore("all_notes").openCursor();
            request_cursor.onsuccess = (event)=>{
                let cursor = event.target.result;
                if (cursor){
                    let record = cursor.value;
                    if (record.tags.includes(query) || record.name.toLowerCase().includes(query.toLowerCase()) || record.content.includes(query)){
                        let box = add_box(0)
                        box.innerHTML = _note(false,`item_${cursor.key}`,record["name"],record["tags"],record["content"]);
                    }
                    cursor.continue();
                }
            }
        })
    }else{
        clear_search_input()
        cur_state = "view"
    }
}

function clear_search_input(){
    document.getElementById('all_notes').innerHTML = "<div class='row row_last'></div><br/>";
    document.getElementById("search").value = '';
    show_all()
}