class IndexDB {
    constructor(dbname, dbversion) {
        this.dbname = dbname;
        this.dbversion = dbversion;
        this.informationTables = [];
        this.cursor = null;
    }

    execute(command, ...args) {
        this.cursor = command.execute(this.cursor);
    }
}

class Command {
    constructor(execute) {
        this.execute = execute;
    }
}

// commands
function CreateDB(ctx) {
    const create = (cursor) => {
        try {
            cursor = indexedDB.open(ctx.dbname, ctx.dbversion);

            cursor.onsuccess = (event) => {
                console.log(`${ctx.dbname} successfully created `);
            };

            cursor.onerror = (event) => {
                console.error(`Error: CreateDB not created database ${ctx.dbname}, already exist`);
            };
        } catch (err) {}
        return cursor;
    };

    return new Command(create);
}

function CreateTable(ctx, tableName, indexPath, columns) {
    const createStore = (cursor) => {
        ctx.dbversion += 1;

        cursor = window.indexedDB.open(ctx.dbname, ctx.dbversion + 1);

        cursor.onsuccess = (event) => {
            console.log("Cursor is open");
        };

        cursor.onerror = (event) => {
            console.info("Cursor has been closed");
        };

        cursor.onupgradeneeded = (event) => {
            const db = event.target.result;

            let tableStore = null;

            console.log(!db.objectStoreNames.contains(tableName));

            if (!db.objectStoreNames.contains(tableName)) {
                tableStore = db.createObjectStore(tableName, {
                    keyPath: indexPath,
                    autoIncrement: true,
                });
            }

            if (!Array.isArray(columns)) {
                throw new Error(`Error method createTableStore
                                                     third key (columns) is not an array`);
            } else {
                columns.forEach((props) => {
                    tableStore.createIndex(props.indexName, props.indexValue, {
                        unique: props.unique,
                    });
                });

                console.log(`${tableStore} successfully created`);
            }

            ctx.informationTables.push({
                tableName: tableName,
                rowCount: 0,
                coumnCount: columns.length,
                columns: columns,
            });

            db.close();
        };

        return cursor;
    };

    return new Command(createStore);
}

function Insert(ctx, tableName, data) {
    const insert = (cursor) => {
        cursor = window.indexedDB.open(ctx.dbname);

        cursor.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(tableName, "readwrite");
            const table = transaction.objectStore(tableName);

            if (!Array.isArray(data)) {
                throw new Error(`Error Insert data: ${data} must be array`);
            } else {
                let insertRequest = null;

                data.forEach((item) => {
                    insertRequest = table.add(item);

                    insertRequest.onsuccess = (event) => {
                        console.log(`Insert: `, item, ` success`);
                    };

                    insertRequest.onerror = (event) => {
                        console.error(`Error Insert: `, item, ` not added`);
                    };
                });

                ctx.rowCount += data.length;
            }
        };

        cursor.onerror = (event) => {
            console.error("Data not added ", data);
        };

        return cursor;
    };

    return new Command(insert);
}

function Select(ctx, callback, tableName, rangeFrom = 1, rangeTo = 1) {
    const select = (cursor) => {
        if (rangeFrom > rangeTo) {
            rangeTo = rangeFrom;
        }

        cursor = window.indexedDB.open(ctx.dbname);

        if (cursor) {
            cursor.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(tableName);
                const tableStore = transaction.objectStore(tableName);

                const getRequest = tableStore.getAll(IDBKeyRange.bound(rangeFrom, rangeTo));

                getRequest.onsuccess = (event) => {
                    callback(event.target.result);
                };
            };
        }

        return cursor;
    };

    return new Command(select);
}

function GetInfoAboutTable(ctx, tableName) {
    const getInfo = (cursor) => {
        console.log(ctx.informationTables);
        return cursor;
    };

    return new Command(getInfo);
}

/*
const columns = [
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
];

const data = [
    {
        id: 1,
        title: "Joe Dune",
        author: "Frank Herbert",
    },
    {
        id: 2,
        title: "Dune",
        author: "Frank Herbert",
    },
    {
        id: 3,
        title: "Herectics Dune",
        author: "Frank Herbert",
    },
];

const DB_NAME = "PatternDB";
const DB_VERSION = 1;
const TAB_CONTEXT = "PatternTable";
const TAB_KEY_PATH = "id";

const iDB = new IndexDB(DB_NAME, DB_VERSION);

iDB.execute(new CreateDB(iDB));

iDB.cursor.onsuccess = (event) => {
    iDB.execute(new CreateTable(iDB, TAB_CONTEXT, TAB_KEY_PATH, columns));
    iDB.execute(new CreateTable(iDB, TAB_CONTEXT + "1", TAB_KEY_PATH, columns));
    iDB.execute(new CreateTable(iDB, TAB_CONTEXT + "2", TAB_KEY_PATH, columns));

    iDB.execute(new Insert(iDB, TAB_CONTEXT, data));
    iDB.execute(
        new Select(
            iDB,
            (results) => {
                console.log(results);
            },
            "PatternTable"
        )
    );
};
*/
