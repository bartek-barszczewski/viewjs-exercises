class IndexDB {
    constructor(dbname, version) {
        this.dbname = dbname;
        this.version = version;
        this.cursor = null;
        this.db = null;
        this.tableName = null;
    }

    connect() {
        this.cursor = window.indexedDB.open(this.dbname, this.version);
        this.cursor.onsuccess = (event) => {
            this.cursor = event.target.result;
            console.log(`${this.dbname} created successfully`);
        };

        this.cursor.onerror = (event) => {
            const err = event.target.errorCode;
            console.error(`Error: ${this.dbname} not created database ${event.target}`);
        };
    }

    createTableStore({tableName, indexPath, columns}) {
        this.tableName = tableName;
        this.cursor.onupgradeneeded = function (event) {
            this.cursor = event.target.result;

            if (!this.cursor.objectStoreNames.contains(tableName)) {
                // Object stores in IndexedDB are containers that hold data.
                this.tableStore = this.cursor.createObjectStore(tableName, {
                    keyPath: indexPath,
                    autoIncrement: true,
                });

                if (!Array.isArray(columns)) {
                    throw new Error(`Error method createTableStore
                                     third key (columns) is not an array`);
                } else {
                    columns.forEach((props) => {
                        this.tableStore.createIndex(props.indexName, props.indexValue, {
                            unique: props.unique,
                        });
                    });
                }
            } else {
                console.log("Exist now");
            }
        };
    }

    insert(data, typeTransaction) {
        this.db = this.cursor;
        const insertTransaction = this.db.transaction([this.tableName], typeTransaction);
        const tableStore = insertTransaction.objectStore(this.tableName);

        const tableStoreRequest = tableStore.add([data]);

        tableStoreRequest.onsuccess = (event) => {
            console.log("${data} added");
        };

        tableStoreRequest.onerror = (event) => {
            console.log("$Error ${data} not added");
        };
    }
}

const mydb = new IndexDB("NewDB", 4);

mydb.connect();
mydb.createTableStore({
    tableName: "Books",
    indexPath: "id",
    columns: [
        {
            indexName: "id",
            indexValue: "id",
            unique: true,
        },
        {
            indexName: "title",
            indexValue: "title",
            unique: false,
        },
        {
            indexName: "author",
            indexValue: "author",
            unique: false,
        },
    ],
});

setTimeout(() => {
    mydb.insert(
        {
            id: 1,
            title: "Dune",
            author: "Frank Herbert",
        },
        "readwrite"
    );
}, 100);
