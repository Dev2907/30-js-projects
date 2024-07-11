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

    async delete_task(id){
        try{
            let res = await this.task_main_db.deleteDB("all_tasks", id);
            return res;
        }catch(error){
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

    // search_placement(query, callback) {
    //     try {
    //         let cursor_call = (cursor, done) => {
    //             if (!done) {
    //                 let record = cursor.value;
    //                 if (record['date'] == query) {
    //                     callback(cursor.key, record);
    //                 }
    //             } else {
    //                 console.log("All records iterated");
    //             }
    //         };
    //         this.task_main_db.cursorDB("task_placement", cursor_call); 
    //         return 1;
    //     } catch (error) {
    //         console.log(error);
    //         return null;
    //     }
    // }

    // setplacement(val) {
    //     try {
    //         let k;
    //         this.search_placement(val['date'],(key, record)=>{
    //             k = key;
    //         })
    //         if (!k){
    //             this.task_main_db.addDB("task_placement", {
    //                 "date" : val['date'],
    //                 "placement": val["placement"]
    //             })
    //         }else{
    //             this.task_main_db.updateVal("task_placement", k, {
    //                 "placement": val["placement"]
    //             })
    //         }
    //     } catch {
    //         console.log(error);
    //         return 0;
    //     }
    // }

    // async getplacement(){
    //     try {
    //         let res = await this.task_main_db.getAllDB("task_placement")
    //         return res
    //     } catch {
    //         console.log(error);
    //         return 0;
    //     }
    // }
}

export default taskDB;
