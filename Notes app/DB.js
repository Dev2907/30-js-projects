import Database from "../DB scripts/dbrequests.js";

class notesDB {
    /**
     * Initializes the database and sets up the necessary indexes.
     * @param {Function} success - A callback function to be executed once the initialization is complete.
     */
    constructor(success) {
        this.db = false;
        let obj_store = [
            {
                name: "all_notes",
                indexes: [
                    {
                        name: "tags",
                        keypath: "tags",
                    },
                    {
                        name: "name",
                        keypath: "name",
                    },
                ],
            },
        ];

        this.db = new Database("notes", 1, obj_store, () => {
            this.initialize(success);
        });
    }

    /**
     * Initializes the database and sets up the necessary indexes.
     * @param {Function} callback - A callback function to be executed once the initialization is complete.
     */
    initialize = async (callback) => {
        if (!localStorage.hasOwnProperty("note_placements")) {
            localStorage.setItem("note_placements", JSON.stringify({}));
        }
        let num_notes = await this.db.countDB("all_notes");
        let cur_placements = this.getplacement();
        callback(num_notes,cur_placements);
    };

    /**
     * Retrieves a note from the database based on the provided query.
     * @param {Object} query - An object containing the query parameters for the note search.
     * @returns {Promise<Object|null>} - A promise that resolves to the retrieved note object or null if the note is not found.
     */
    async get_note(query) {
        try {
            let res = await this.db.getDB("all_notes", query);
            return res;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     * Adds a new note to the database.
     * @param {Object} data - An object containing the data for the new note.
     * @returns {Promise<Object|null>} - A promise that resolves to the added note object or null if the addition fails.
     */
    async add_note(data) {
        try {
            let res = await this.db.addDB("all_notes", data);
            return res;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     * Deletes a note from the database based on the provided key.
     * @param {string} key - The unique key of the note to be deleted.
     * @returns {Promise<Object|null>} - A promise that resolves to the deleted note object or null if the deletion fails.
     */
    async delete_note(key) {
        try {
            let res = await this.db.deleteDB("all_notes", key);
            return res;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     * Searches for a note in the database based on the provided query.
     * @param {string} query - The search query to be used for finding the note.
     * @param {Function} callback - A callback function to be executed once the search is complete. The callback function receives the key and the note object as arguments.
     * @returns {Promise<number>} - A promise that resolves to 1 if the search is successful, or null if an error occurs.
     */
    search_note(query, callback) {
        try {
            let cursor_call = (cursor, done) => {
                if (!done) {
                    let record = cursor.value;
                    if (
                        record.tags.includes(query) ||
                        record.name
                            .toLowerCase()
                            .includes(query.toLowerCase()) ||
                        record.content.includes(query)
                    ) {
                        callback(cursor.key, record);
                    }
                } else {
                    console.log("All records iterated");
                }
            };
            this.db.cursorDB("all_notes", cursor_call); 
            return 1;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     * Sets a value in the localStorage with the provided key and value.
     * @param {string} key - The key to store the value under.
     * @param {any} val - The value to be stored.
     * @returns {number} - 1 if the operation is successful, 0 otherwise.
     */
    setplacement(val) {
        try {
            localStorage.setItem('note_placements', JSON.stringify(val));
            return 1;
        } catch {
            console.log(error);
            return 0;
        }
    }

    getplacement(){
        try {
            return JSON.parse(localStorage.getItem('note_placements'))
        } catch {
            console.log(error);
            return 0;
        }
    }

}

export default notesDB;
