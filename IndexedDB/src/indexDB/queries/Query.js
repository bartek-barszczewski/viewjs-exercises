export class QuerySet {
    constructor() {}

    createStore() {
        this.ctx.dbversion += 1;
        this.columns = this.ctx.columns;
        this.tableName = this.ctx.tableName;
        this.indexPath = this.ctx.indexPath;
        // Close before upgrade
        this.ctx.cursor.result.close();

        const cursor = window.indexedDB.open(this.ctx.dbname, this.ctx.dbversion + 1);

        cursor.onupgradeneeded = (event) => {
            const db = event.target.result;

            let tableStore = null;

            if (!db.objectStoreNames.contains(this.tableName)) {
                tableStore = db.createObjectStore(this.tableName, {
                    keyPath: this.indexPath,
                    autoIncrement: true,
                });
            }

            if (!Array.isArray(this.columns)) {
                throw new Error(`Error method createTableStore
                                                     third key (columns) is not an array`);
            } else {
                this.columns.forEach((props) => {
                    tableStore.createIndex(props.indexName, props.indexValue, {
                        unique: props.unique,
                    });
                });

                console.log(`${tableStore} successfully created`);
            }
        };

        cursor.onsuccess = (event) => {
            console.log("Cursor is open");
        };

        cursor.onerror = (event) => {
            console.info("Cursor has been closed");
        };

        return cursor;
    }

    insert() {
        this.columns = this.ctx.columns;
        this.tableName = this.ctx.tableName;
        this.data = this.ctx.data;

        const cursor = window.indexedDB.open(this.ctx.dbname);

        cursor.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(this.tableName, "readwrite");
            const table = transaction.objectStore(this.tableName);

            if (!Array.isArray(this.data)) {
                throw new Error(`Error Insert data: ${this.data} must be array`);
            } else {
                let insertRequest = null;

                this.data.forEach((item) => {
                    insertRequest = table.add(item);

                    insertRequest.onsuccess = (event) => {
                        console.log(`Insert: `, item, ` success`);
                    };

                    insertRequest.onerror = (event) => {
                        console.error(`Error Insert: `, item, ` not added`);
                    };
                });

                this.ctx = {
                    rowCount: this.ctx.rowCount + this.data.length,
                };
            }
        };

        cursor.onerror = (event) => {
            console.error("Data not added ", this.data);
        };

        return cursor;
    }

    deleteFromTable() {
        this.dbname = this.ctx.dbname;
        this.tableName = this.ctx.tableName;
        this.object = this.ctx.object;
        this.indexPath = this.ctx.indexPath;

        const cursor = window.indexedDB.open(this.dbname);

        cursor.onsuccess = (event) => {
            if (!Number.isInteger(this.object)) {
                const db = event.target.result;
                const transaction = db.transaction(this.tableName, "readwrite");
                const getAllRequest = transaction.objectStore(this.tableName).getAll();

                getAllRequest.onsuccess = (event) => {
                    const result = event.target.result;
                    const fromTableObjectKeys = Object.keys(result[0]);
                    const objectKeys = Object.keys(this.object);
                    const objectKeysLength = objectKeys.length;
                    const MIN_REQUIRE_KEYS = 2;
                    const ERROR_MESSAGE = "Error from DeleteFromTable require object with minimum 2 object keys";

                    if (!(objectKeysLength >= MIN_REQUIRE_KEYS)) {
                        throw new Error(ERROR_MESSAGE);
                    } else {
                        console.log(objectKeys);
                        console.log(fromTableObjectKeys);
                        /*
                            On the basis of to pass the object with keys 
                            you should delete the record from 
                            the specific table
                        */
                    }
                };
            } else {
                const db = event.target.result;
                const transaction = db.transaction(this.tableName, "readwrite");
                const _delete = transaction.objectStore(this.tableName).delete(this.object);

                _delete.onsuccess = (event) => {
                    console.log("Delete record: ", this.object, " SUCCESS!");
                };
            }
        };
    }

    select() {
        this.rangeTo = this.ctx.rangeTo;
        this.rangeFrom = this.ctx.rangeFrom;
        this.display = this.ctx.display;
        this.tableName = this.ctx.tableName;

        if (this.rangeFrom > this.rangeTo) {
            this.rangeTo = this.rangeFrom;
        }

        const cursor = window.indexedDB.open(this.ctx.dbname);
        cursor.onsuccess = (event) => {
            const db = event.target.result;

            const transaction = db.transaction(this.tableName, "readonly");

            const tableStore = transaction.objectStore(this.tableName);

            const getRequest = tableStore.getAll(IDBKeyRange.bound(this.rangeFrom, this.rangeTo));

            getRequest.onsuccess = (event) => {
                this.display(event.target.result);
            };

            getRequest.onerror = (event) => {
                console.error("Error Select");
            };
        };

        return cursor;
    }

    selectAll() {
        this.tableName = this.ctx.tableName;
        this.display = this.ctx.display;

        const cursor = window.indexedDB.open(this.ctx.dbname);

        cursor.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(this.tableName, "readonly");
            const tableStore = transaction.objectStore(this.tableName);

            const getRequest = tableStore.getAll();

            getRequest.onsuccess = (event) => {
                this.display(event.target.result);
            };

            getRequest.onerror = (event) => {
                console.error("Error SelectAll");
            };
        };

        return cursor;
    }

    getTableInfo() {
        this.dbname = this.ctx.dbname;
        this.tableName = this.ctx.tableName;

        const cursor = window.indexedDB.open(this.dbname);

        cursor.onsuccess = (event) => {
            const db = event.target.result;
            const store = db.transaction(this.tableName, "readonly").objectStore(this.tableName);

            console.log(store);
        };
    }
}

export class Query extends QuerySet {
    constructor(query, ctx) {
        super();
        this.ctx = ctx;
        this.query = query;
    }
}
