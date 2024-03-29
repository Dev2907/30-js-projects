let num_notes = 0
let cur_placements = {}
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
        object_store.createIndex("tags","tags",{multiEntry:true});
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
}

function _note(is_input, key="",heading="", tags="", content=""){
    if (is_input){
        return  `<div class="note card p-2">
        <div class="d-flex w-100">
            <input id="heading" class="border-0 w-50" type="text" placeholder="Heading" />
            <input id="tags" type="text" placeholder="Tags (comma separated)" class="border-0 w-50" />
        </div>
        <hr />
        <p class="card-text"><textarea id="content" class="w-100"></textarea></p>
        <div class="d-flex gap-2">
            <button onclick="add_new_note()" class="btn btn-dark">Add</button>
            <button onclick="cancel_new_note()" class="btn btn-dark">Cancel</button>
        </div>
    </div>`
    }
    let tags_string = ""
    for(let i=0; i<tags.length; i++) {
        tags_string += `<div class="bg-success rounded-pill p-1 text-white">${tags[i]}</div>`
    }

    let html=`<div id=${"item_"+key} class="note card p-2">
    <div class="d-flex w-100 h-10">
        <h5 class="card-title text-wrap flex-fill">${heading}</h5>
        <div class="d-flex flex-wrap gap-2">
        ${tags_string}
        </div>
    </div>
    <hr />
    <textarea class="card-text border-0">${content}</textarea>
    </div>
    `
    return html
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
            add_box(i);
            debugger;
            let match = cur_placements[i].match(/\d+/)[0];
            let request_note = object_store.get(parseInt(match))
            request_note.onsuccess = (event)=>{
                let obj = event.target.result;
                add_box(i);
                add_note(i,obj['name'],obj['tags'],obj['content'])
            }
        }
    });
}

function add_box(id){
    let last_row = document.querySelectorAll('.row_last')[0]
    if (last_row.childNodes.length > 2){
        last_row.classList.remove("row_last");
        last_row = document.createElement("div");
        last_row.classList.add("row","row_last");
        document.getElementById("all_notes").appendChild(last_row);
        document.getElementById("all_notes").appendChild(document.createElement('br'));
    }
    let new_box = document.createElement('div');
    new_box.id = id;
    new_box.classList.add("box", "col-6")
    last_row.appendChild(new_box);
    return num_notes;
}

function createNewNote(){
    add_box(num_notes);
    cur_placements = {};
    for(let i=num_notes; i>0; i-=1){
        let cur_box = document.getElementById(i);
        let prev_box = document.getElementById(i-1);
        cur_box.appendChild(prev_box.firstElementChild);
        cur_placements[cur_box.id] = cur_box.firstElementChild.id;
    }
    localStorage.setItem("cur_placements", JSON.stringify(cur_placements));
    let box_0 = document.getElementById(0);
    box_0.innerHTML = _note(true);
}

function add_new_note(){
    let heading = document.getElementById("heading").value;
    let tags = document.getElementById("tags").value;
    let content = document.getElementById("content").value;
    tags = tags.split(",");
    add_note(0,heading,tags,content);
}

function add_note(box_id,heading, tags, content) {
    dbrequest((event)=>{
        let object_store = event.target.result.transaction(["all_notes"],"readwrite").objectStore("all_notes");
        let request_add = object_store.add({
        "name": heading, 
        "tags": tags, 
        "content": content,
        })
        request_add.onsuccess=(event)=>{
            let box_0 = document.getElementById(box_id);
            box_0.innerHTML = _note(false,event.target.result,heading,tags,content);
            num_notes+=1;
            cur_placements[0] = `item_${event.target.result}`;
            localStorage.setItem("cur_placements", JSON.stringify(cur_placements));
        }
    })
}

function cancel_new_note(){
    document.getElementById(0).firstElementChild.remove()
    cur_placements = {}
    for(let i=0; i<num_notes; i+=1){
        let cur_box = document.getElementById(i);
        let next_box = document.getElementById(i+1);
        cur_box.appendChild(next_box.firstElementChild);
        cur_placements[cur_box.id] = cur_box.firstElementChild.id
    }
    localStorage.setItem("cur_placements", JSON.stringify(cur_placements));
    document.getElementById(num_notes).remove();
}
