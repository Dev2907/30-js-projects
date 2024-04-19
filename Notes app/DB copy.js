import Database from "../DB scripts/dbrequests _1.js";

class notesDB{
    constructor(success){
        this.db = false;
        let obj_store = [
                        {
                            "name": "all_notes",
                            "indexes" :[
                                {
                                    "name":"tags",
                                    "keypath": "tags",
                                },
                                {
                                    "name":"name",
                                    "keypath": "name",
                                }
                            ],
                        }
                    ];

        this.db = new Database("notes",1,obj_store, ()=>{this.initialize(success)});
    }
    initialize = async(callback) =>{
        if(! localStorage.hasOwnProperty("cur_placement")){
            localStorage.setItem("cur_placement",JSON.stringify({}))
        }
        let num_notes = await this.db.countDB("all_notes")
        callback(num_notes)
    }
}







// class notesDB extends Database {
    
//     /**
//      * Initializes the database and loads the specified object store.
//      * @param {function} success_callback - A callback function that will be called once the initialization is complete.
//      *                                          It will receive the number of notes from DB.
//      */
//     initialize = (success_callback)=>{
//         if(! localStorage.hasOwnProperty("cur_placement")){
//             localStorage.setItem("cur_placement",JSON.stringify({}))
//         }
        
//         let obj_store = [
//             {
//                 "name": "all_notes",
//                 "indexes" :[
//                     {
//                         "name":"tags",
//                         "keypath": "tags",
//                     },
//                     {
//                         "name":"name",
//                         "keypath": "name",
//                     }
//                 ],
//             }
//         ];
    
//         let success = async ()=>{
//             let num_notes = await this.countDB("notes","all_notes")
//             success_callback(num_notes)
//         }
    
//         this.loadDB("notes",1, obj_store, success)
//     }

//     /**
//      * Retrieves a note from the database based on the provided query.
//      *
//      * @param {Object} query - An object containing the query parameters for retrieving the note.
//      * @returns {Promise<Object|null>} - A promise that resolves to the retrieved note if found, or null if not found.
//      * @throws {Error} - If an error occurs during the database operation.
//      */
//     async get_note(query){
//         try{
//             let res = await this.getDB("notes","all_notes",query);
//             return res;
//         }catch(error){
//             console.log(error);
//             return null;
//         }
//     }

//     /**
//      * Adds a new note to the database.
//      * @param {Object} data - The data of the new note to be added.
//      * @returns {Promise<Object|null>} - A promise that resolves to the id of added note if successful, or null if an error occurs during the database operation.
//      */
//     async add_note(data){
//         try{
//             let res = await this.addDB("notes","all_notes",data);
//             return res;
//         }catch(error){
//             console.log(error);
//             return null;
//         }
//     }
//     /**
//      * Deletes a note from the database based on the provided key.
//      * @param {string} key - The key of the note to be deleted.
//      * @returns {Promise<number>} - A promise that resolves to 1 if the note is successfully deleted, or 0 if an error occurs during the database operation.
//      */
//     async delete_note(key){
//         try{
//             let res = await this.deleteDB("notes","all_notes",key);
//             return res;
//         }catch(error){
//             console.log(error);
//             return null;
//         }
//     }

//     /**
//      * Searches for a note in the database based on the provided query.
//      *
//      * @param {string} query - The query to search for in the note's tags, name, or content.
//      * @param {function} callback - A callback function that will be called for each matching note.
//      *                                  It will receive the key and the note object as arguments.
//      * @returns {1|null} - 1 on successfull completion, null on failure
//      */
//     async search_note(query,callback){
//         try{
//             let cursor_call = (cursor,done) => {
//                 if(done){
//                     let record = cursor.value;
//                     if (record.tags.includes(query) || record.name.toLowerCase().includes(query.toLowerCase()) || record.content.includes(query)){
//                         callback(cursor.key,record);   
//                     }
//                 }else{
//                     console.log("All records iterated")
//                 }
//             }
//             await this.cursorDB("notes","all_notes",cursor_call)
//             return 1;

//         }catch(error){
//             console.log(error);
//             return null;
//         }
//     }

//     /**
//      * Sets a value in the localStorage with the specified key and value.
//      *
//      * @param {string} key - The key to store the value under.
//      * @param {any} val - The value to be stored.
//      * @returns {number} - Returns 1 if the operation is successful, 0 otherwise.
//      */
//     setLS(key, val){
//         try{
//             localStorage.setItem(key, JSON.stringify(val))
//             return 1;
//         }catch{
//             console.log(error);
//             return 0;
//         }
//     }
// }

export default notesDB;