import Database from "../DB scripts/dbrequests.js";

class taskDB {
    constructor(success, date) {
        this.task_main_db = false;
        let task_obj_store = [
            {
                name: "all_tasks",
                indexes: [
                    {
                        name: "is_done",
                        keypath: "is_done",
                    },
                    {
                        name: "name",
                        keypath: "name",
                    },
                    {
                        name: "date",
                        keypath: "date",
                        // date format : date object
                    },
                    {
                        name: "box_id",
                        keypath: "box_id",
                    }
                ],
            },
        ];

        this.task_main_db = new Database("tasks", 1, task_obj_store, () => {
            this.initialize(success, date);
        });
    }

    async initialize(callback, date) {
        let num_tasks = await this.task_main_db.countDB("all_tasks", "date", date);
        callback(num_tasks);
    }

    async count_tasks(query){
        return await this.task_main_db.countDB("all_tasks", "date", query);
    }

    async add_task(data) {
        try {
            let res = await this.task_main_db.addDB("all_tasks", data);
            return res;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async get_tasks(query) {
        try {
            let res = this.task_main_db.getAllDB("all_tasks", "date", query);
            return res;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async update_task(id, rec) {
        try {
            await this.task_main_db.updateVal("all_tasks", parseInt(id), rec);
            return 1;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async update_multiple(rec){
        let cursor_call = (cursor, done) => {
            if (!done){
                let data = cursor.value;
                let id = data.id;
                if (rec.hasOwnProperty(id)){
                    for (let key in rec[id]){
                        data[key] = rec[id][key]
                    }
                    cursor.update(data);
                }
            }
        }
        try{
            this.db.cursorDB("all_tasks", cursor_call);
        }catch(err){
            console.log(err);
        }
    }

    async delete_task(id, mapping){
        try{
            id = parseInt(id);
            let errorcall = (ev) => {
                console.log(`DB Error: ${ev.target.errorCode}`);
                transaction.abort();
                return false;
            };
    
            let val = this.task_main_db._transaction("all_tasks");
            let transaction = val[0];
            let store = val[1];
    
            let req = store.get(id);
            req.onsuccess = (event) => {
                let record = event.target.result;
                if(record){
                    let deleteRequest = store.delete(id);
    
                    deleteRequest.onsuccess = async function(event) {
                        for (let task in mapping){
                            let task_id = parseInt(task.match(/\d+$/));
                            let getreq = store.get(task_id);
                            getreq.onsuccess = async (event) => {
                                let data = event.target.result;
                                if (data){
                                    data['box_id'] = mapping[task];
                                    let putreq = store.put(data);
                                    putreq.onerror = errorcall;
                                }
                            };
                            getreq.onerror = errorcall;
                        }
                    };
                    
                    deleteRequest.onerror = errorcall;
                }
            };
            req.onerror = errorcall;
        } catch(error){
            console.log(error);
            return null;
        }
    }

    async delete_all_tasks(){
        try{
            let res = await this.task_main_db.clearall("all_tasks");
            return res;
        }catch(error){
            console.log(error);
            return null;
        }
    }

    async update_task_status(id, val){
        try{
            let res = await this.task_main_db.updateVal("all_tasks", id, {"is_done": val});
            return res
        }catch(error){
            console.log(error);
            return null;
        }
    }

}

export default taskDB;
