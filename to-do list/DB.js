import Database from "../DB scripts/dbrequests.js";

class taskDB {
    constructor(success) {
        this.db = false;
        let obj_store = [
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
                ],
            },
        ];

        this.db = new Database("tasks", 1, obj_store, () => {
            this.initialize(success);
        });
    }

    async initialize(callback) {
        let num_tasks = await this.db.countDB("all_tasks");
        callback(num_tasks);
    }

    async add_task(data) {
        try {
            let res = await this.db.addDB("all_tasks", data);
            return res;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async get_tasks() {
        try {
            let task_list = [];
            let cursor_call = (cursor, done) => {
                if (!done) {
                    task_list.push({ key: cursor.key, value: cursor.value });
                } else {
                    console.log("All records iterated");
                }
            };
            await this.db.cursorDB("all_tasks", cursor_call);
            return task_list;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async update_task_status(id, val) {
        try {
            let rec = { is_done: val };
            await this.db.updateVal("all_tasks", parseInt(id), rec);
            return 1;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

export default taskDB;
