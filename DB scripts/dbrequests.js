class Database{
    /**
     * Loads an IndexedDB database. Used in window onload
     * @param {string} dbname - The name of the database to open.
     * @param {number} ver - The version of the database schema.
     * @param {Object[]} obj_stores - An array of object store configurations.
     * @param {string} obj_stores[].name - The name of the object store.
     * @param {Object[]} obj_stores[].indexes - An array of index configurations.
     * @param {string} obj_stores[].indexes[].name - The name of the index.
     * @param {string} obj_stores[].indexes[].keypath - The name of the index key path.
     * @param {Object} obj_stores[].indexes[].options - The index options.
     * @param {function} success_callback - The function to call on success.
     */
    async loadDB(dbname, ver, obj_stores, success_callback) {
        let request = indexedDB.open(dbname,ver);
        request.onerror = (event)=>{
            console.log(`DB Error: ${event.target.errorCode}`)
            return null;
        };
        request.onupgradeneeded = (event)=>{
            console.log("IndexedDB Upgrade started");
            const db = event.target.result;
            if (obj_stores.length>0){
                for(let i=0; i<obj_stores.length; i+=1){
                    let object_store = db.createObjectStore(obj_stores[i]["name"], {KeyPath:"id", autoIncrement: true});
                    if (obj_stores[i]["indexes"].length>0){
                        for(let j=0; j<obj_stores[i]["indexes"].length; j+=1){
                            let index = obj_stores[i]["indexes"][j];
                            index["options"]? object_store.createIndex(index["name"], index["keypath"], index["options"]) :
                                object_store.createIndex(index["name"], index["keypath"], index["options"]);
                        }
                    }
                }
            }
            console.log("IndexedDB Upgrade completed");
        };
        request.onsuccess = success_callback;
    }
    
    /**
    * Opens a connection to an IndexedDB database.
    * @param {string} dbname - The name of the database to open.
    * @param {function} success_callback - The function to call on success.
    */ 
    dbrequest(dbname,successcallback) {
        let request = indexedDB.open(dbname)
        request.onerror = (event)=>{
            console.log(`DB Error: ${event.target.errorCode}`)
        }
        request.onsuccess = successcallback
    }
    
    /**
     * Gets an item from an IndexedDB database.
     * @param {string} dbname - The name of the database.
     * @param {string} storename - The name of the object store.
     * @param {Int} query - The key or key range to use for the get operation.
     * @returns {Promise.<Object>} The item, or null if not found.
     */
    async getDB(dbname, storename, query) {
        return new Promise((resolve, reject) => {
            this.dbrequest(dbname, (event) => {
                let transaction = event.target.result.transaction([storename], "readonly");
                let objstore = transaction.objectStore(storename);
                let req = objstore.get(query);
                req.onsuccess = async (event) => {
                    resolve(event.target.result);
                    console.log(`Queried DB : ${dbname}, Store : ${storename}, for Query : ${query} `);
                };
                req.onerror = (event) => {
                    console.log(`DB Error: ${event.target.errorCode}`);
                    reject(null);
                };
            });
        });
    }
    
    /**
     * Gets all items from an IndexedDB database.
     * @param {string} dbname - The name of the database.
     * @param {string} storename - The name of the object store.
     * @returns {Promise.<Object[]>} The items.
     */
    async getAllDB(dbname, storename){
        return new Promise((resolve, reject) => {
            this.dbrequest(dbname, (event) => {
                let transaction = event.target.result.transaction([storename], "readonly");
                let objstore = transaction.objectStore(storename);
                let req = objstore.getAll();
                req.onsuccess = async (event) => {
                    resolve(event.target.result);
                    console.log(`All record for DB : ${dbname} queried`);
                };
                req.onerror = (event) => {
                    console.log(`DB Error: ${event.target.errorCode}`);
                    reject(null);
                };
            });
        })
    }
    
    /**
     * Adds an item to an IndexedDB database.
     * @param {string} dbname - The name of the database.
     * @param {string} storename - The name of the object store.
     * @param {Object} data - The data to add.
     * @returns {Promise.<Object>} The added item.
     */
    async addDB(dbname, storename, data){
        return new Promise((resolve, reject) => {
            this.dbrequest(dbname, (event) => {
                let transaction = event.target.result.transaction([storename], "readwrite");
                let objstore = transaction.objectStore(storename);
                let req = objstore.add(data);
                req.onsuccess = async (event) => {
                    resolve(event.target.result);
                    console.log(`Added Data : ${data} to DB : ${dbname}, Store : ${storename}`);
                };
                req.onerror = (event) => {
                    console.log(`DB Error: ${event.target.errorCode}`);
                    reject(null);
                };
            });
        })
    }
    
    /**
     * Deletes an item from an IndexedDB database.
     * @param {string} dbname - The name of the database.
     * @param {string} storename - The name of the object store.
     * @param {*} query - The key or key range to use for the delete operation.
     * @returns {Promise.<number>} The number of items deleted.
     */
    async deleteDB(dbname, storename, query){
        return new Promise((resolve, reject) => {
            this.dbrequest(dbname, (event) => {
                let transaction = event.target.result.transaction([storename], "readwrite");
                let objstore = transaction.objectStore(storename);
                let req = objstore.delete(query);
                req.onsuccess = async (event) => {
                    resolve(event.target.result);
                    console.log(`Deleted id : ${query} from DB : ${dbname}, Store : ${storename}`);
                };
                req.onerror = (event) => {
                    console.log(`DB Error: ${event.target.errorCode}`);
                    reject(null);
                };
            });
        })
    }
    
    /**
     * Opens a cursor for an IndexedDB database.
     * @param {string} dbname - The name of the database.
     * @param {string} storename - The name of the object store.
     * @returns {Promise.<Object>} The cursor, or null if not found.
     */
    async cursorDB(dbname, storename,callback){
        return new Promise((resolve, reject) => {
            this.dbrequest(dbname, (event) => {
                let transaction = event.target.result.transaction([storename], "readonly");
                let objstore = transaction.objectStore(storename);
                let req = objstore.openCursor();
                req.onsuccess = async (event) => {
                    let cursor = event.target.result;
                    if(cursor){
                        callback(cursor,true);
                        cursor.continue();
                    }else{
                        callback(null,false);
                    }
                };
                req.onerror = (event) => {
                    console.log(`DB Error: ${event.target.errorCode}`);
                    reject(null);
                };
            });
        })
    }

    /**
     * Counts the number of items in an IndexedDB database.
     * @param {string} dbname - The name of the database.
     * @param {string} storename - The name of the object store.
     * @returns {Promise.<number>} The number of items in the object store.
     */
    async countDB(dbname,storename){
        return new Promise((resolve, reject) => {
            this.dbrequest(dbname, (event) => {
                let transaction = event.target.result.transaction([storename], "readonly");
                let objstore = transaction.objectStore(storename);
                let req = objstore.count();
                req.onsuccess = async (event) => {
                    resolve(event.target.result);
                    console.log(`Counted DB : ${dbname}, Store : ${storename}`);
                };
                req.onerror = (event) => {
                    console.log(`DB Error: ${event.target.errorCode}`);
                    reject(null);
                };
            });
        })
    }
}

export default Database