class Database {
    /**
     * Initializes a new instance of the Database class.
     * @param {string} dbname - The name of the database to open.
     * @param {number} ver - The version of the database schema.
     * @param {Object[]} obj_stores - An array of object store configurations.
     * @param {string} obj_stores[].name - The name of the object store.
     * @param {Object[]} obj_stores[].indexes - An array of index configurations.
     * @param {string} obj_stores[].indexes[].name - The name of the index.
     * @param {string} obj_stores[].indexes[].keypath - The name of the index key path.
     * @param {Object} obj_stores[].indexes[].options - The index options.
     * @param {function} callback - A callback function to be executed after the database is loaded.
     */
    constructor(dbname, ver, obj_stores, callback) {
        this.db = null;
        this.dbname = dbname;
        this.ver = ver;
        this.obj_stores = obj_stores;

        this.loadDB(dbname, ver, obj_stores)
            .then((result) => {
                this.db = result;
                callback();
            })
            .catch((err) => {
                console.log(err);
            });
    }

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
     */
    async loadDB(dbname, ver, obj_stores) {
        return new Promise(function (resolve, reject) {
            let request = indexedDB.open(dbname, ver);
            request.onerror = (event) => {
                console.log(`DB Error: ${event.target.errorCode}`);
                reject(event.target.errorCode);
            };
            request.onupgradeneeded = (event) => {
                console.log("IndexedDB Upgrade started");
                const db = event.target.result;
                if (obj_stores.length > 0) {
                    for (let i = 0; i < obj_stores.length; i += 1) {
                        let object_store = db.createObjectStore(
                            obj_stores[i]["name"],
                            { keyPath: "id", autoIncrement: true }
                        );
                        if (obj_stores[i]["indexes"].length > 0) {
                            for (
                                let j = 0;
                                j < obj_stores[i]["indexes"].length;
                                j += 1
                            ) {
                                let index = obj_stores[i]["indexes"][j];
                                index["options"]
                                    ? object_store.createIndex(
                                          index["name"],
                                          index["keypath"],
                                          index["options"]
                                      )
                                    : object_store.createIndex(
                                          index["name"],
                                          index["keypath"]
                                      );
                            }
                        }
                    }
                }
                console.log("IndexedDB Upgrade completed");
            };
            request.onsuccess = (event) => {
                resolve(event.target.result);
                console.log("DB created successfully");
            };
        });
    }

    /**
     * Gets an item from an IndexedDB database.
     * @param {string} storename - The name of the object store.
     * @param {Int} query - The key or key range to use for the get operation.
     * @returns {Promise.<Object>} The item, or null if not found.
     */
    async getDB(storename, key, query) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction([storename], "readonly");
            let objstore = transaction.objectStore(storename);
            let req;
            if (key) {
                let index = objstore.index(key);
                req = index.get(query); // This should be outside the onsuccess handler
    
                req.onsuccess = (event) => {
                    resolve(event.target.result);
                    console.log(
                        `Queried DB : ${this.dbname}, Store : ${storename}, for Query : ${query} `
                    );
                };
    
                req.onerror = (event) => {
                    console.log(`DB Error: ${event.target.errorCode}`);
                    reject(null);
                };
            } else {
                req = objstore.get(query);
    
                req.onsuccess = (event) => {
                    resolve(event.target.result);
                    console.log(`All records for DB : ${this.dbname} queried`);
                };
    
                req.onerror = (event) => {
                    console.log(`DB Error: ${event.target.errorCode}`);
                    reject(null);
                };
            }
        });
    }
    
    /**
     * Gets all items from an IndexedDB database.
     * @param {string} storename - The name of the object store.
     * @param {string} key - The name of the index key (optional).
     * @param {string} query - The query to serch from index key (optional).
     * @returns {Promise.<Object[]>} The items.
     */
    async getAllDB(storename, key ,query) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction([storename], "readonly");
            let objstore = transaction.objectStore(storename);
            let req;
            if (query && key) {
                let index = objstore.index(key);
                req = index.getAll(query); // This should be outside the onsuccess handler
    
                req.onsuccess = (event) => {
                    resolve(event.target.result);
                    console.log(`All records for DB : ${this.dbname} queried`);
                };
    
                req.onerror = (event) => {
                    console.log(`DB Error: ${event.target.errorCode}`);
                    reject(null);
                };
            } else {
                req = objstore.getAll();
    
                req.onsuccess = (event) => {
                    resolve(event.target.result);
                    console.log(`All records for DB : ${this.dbname} queried`);
                };
    
                req.onerror = (event) => {
                    console.log(`DB Error: ${event.target.errorCode}`);
                    reject(null);
                };
            }
        });
    }

    /**
     * Adds an item to an IndexedDB database.
     * @param {string} storename - The name of the object store.
     * @param {Object} data - The data to add.
     * @returns {Promise.<Object>} The added item.
     */
    async addDB(storename, data) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction([storename], "readwrite");
            let objstore = transaction.objectStore(storename);
            let req = objstore.add(data);
            req.onsuccess = async (event) => {
                let res = await event.target.result;
                resolve(res);
                console.log(
                    `Added Data : ${data} to DB : ${this.dbname}, Store : ${storename}`
                );
            };
            req.onerror = (event) => {
                console.log(`DB Error: ${event.target.errorCode}`);
                reject(null);
            };
        });
    }

    /**
     * Deletes an item from an IndexedDB database.
     * @param {string} storename - The name of the object store.
     * @param {*} query - The key or key range to use for the delete operation.
     * @returns {Promise.<number>} The number of items deleted.
     */
    async deleteDB(storename, query) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction([storename], "readwrite");
            let objstore = transaction.objectStore(storename);
            let req = objstore.delete(query);
            req.onsuccess = async (event) => {
                resolve(event.target.result);
                console.log(
                    `Deleted id : ${query} from DB : ${this.dbname}, Store : ${storename}`
                );
            };
            req.onerror = (event) => {
                console.log(`DB Error: ${event.target.errorCode}`);
                reject(null);
            };
        });
    }

    /**
     * Opens a cursor for an IndexedDB database.
     * @param {string} storename - The name of the object store.
     * @param {function} callback - A callback function to be executed for each cursor object.
     * @returns {Promise.<Object>} The cursor, or null if not found.
     */
    async cursorDB(storename, callback) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction([storename], "readonly");
            let objstore = transaction.objectStore(storename);
            let req = objstore.openCursor();
            req.onsuccess = async (event) => {
                let cursor = event.target.result;
                if (cursor) {
                    callback(cursor, false);
                    cursor.continue();
                } else {
                    resolve(1);
                    callback(null, true);
                }
            };
            req.onerror = (event) => {
                console.log(`DB Error: ${event.target.errorCode}`);
                reject(null);
            };
        });
    }

    /**
     * Counts the number of items in an IndexedDB database.
     * @param {string} storename - The name of the object store.
     * @returns {Promise.<number>} The number of items in the object store.
     */
    async countDB(storename, key, query) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction([storename], "readonly");
            let objstore = transaction.objectStore(storename);
            let req;
            if (query){
                let index = objstore.index(key)
                query = IDBKeyRange.only(query);
                req = index.count(query);
            }else{
                req = objstore.count();
            }
            req.onsuccess = async (event) => {
                resolve(event.target.result);
                console.log(
                    `Counted DB : ${this.dbname}, Store : ${storename}, Query ${query}`
                );
            };
            req.onerror = (event) => {
                console.log(`DB Error: ${event.target.errorCode}`);
                reject(null);
            };
        });
    }

    /**
     * Updates an existing record in the database.
     * @param {string} storename - The name of the object store.
     * @param {number} id - The primary key of the record to update.
     * @param {Object} vals - The key/value pairs to update in the record.
     * @returns {Promise.<number>} A status code indicating success (1) or failure (0).
     */
    async updateVal(storename, id, vals) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction([storename], "readwrite");
            let objstore = transaction.objectStore(storename);
            let req = objstore.get(parseInt(id));
            req.onsuccess = (event) => {
                let data = event.target.result;
                for (let key in vals) {
                    if (data.hasOwnProperty(key)) {
                        data[key] = vals[key];
                    }
                }
                let putreq = objstore.put(data);
                putreq.onsuccess = (event) => {
                    console.log(`record ${id} updated with vals: ${vals}`);
                    resolve(1);
                };
                putreq.onerror = (event) => {
                    console.log(`DB Error: ${event.target.errorCode}`);
                    reject(null);
                };
            };
            req.onerror = (event) => {
                console.log(`DB Error: ${event.target.errorCode}`);
                reject(null);
            };
        });
    }

    /**
     * Clears all records from an IndexedDB database.
     * @param {string} storename - The name of the object store.
     * @returns {Promise.<number>} A status code indicating success (1) or failure (0).
     */
    async clearall(storename) {
        return new Promise((resolve, reject) => {
            let transaction = this.db.transaction([storename], "readwrite");
            let objstore = transaction.objectStore(storename);
            let req = objstore.clear();
            req.onsuccess = (event) => {
                console.log(
                    `DB : ${this.dbname}, Store : ${storename} cleared`
                );
                resolve(1);
            };
            req.onerror = (event) => {
                console.log(`DB Error: ${event.target.errorCode}`);
                reject(null);
            };
        });
    }

    _transaction(storename){
        let transaction = this.db.transaction([storename],"readwrite")
        let objectStore = transaction.objectStore(storename); 
        return [transaction, objectStore]
    }
}

export default Database;
