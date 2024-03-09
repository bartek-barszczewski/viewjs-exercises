import CommandSet from "./command/CommandSet.js";

class IndexDB {
    constructor(dbname, dbversion) {
        this.dbname = dbname;
        this.dbversion = dbversion;
        try {
            if (window.indexedDB.open(this.dbname)) {
                this.cursor = window.indexedDB.open(this.dbname);
            } else {
                this.cursor = indexedDB.open(this.dbname, this.dbversion);

                this.cursor.onsuccess = (event) => {
                    this.cursor = event.target.result;
                    console.log(`${this.dbname} successfully created `);
                };

                this.cursor.onerror = (event) => {
                    console.error(`Error: CreateDB not created database ${this.dbname}, already exist`);
                };
            }
        } catch (err) {
            console.log(`Something went wrong! `, err);
        }
    }

    execute(command, ...args) {
        console.log(command);
        this.cursor = command.execute();
    }
}

class Command extends CommandSet {
    constructor(execute, ctx) {
        super();
        this.ctx = ctx;
        this.execute = execute;
    }
}

function CreateTable(ctx, tableName, indexPath, columns) {
    const command = new CommandSet();
    ctx = {
        tableName,
        indexPath,
        columns,
        ...ctx,
    };

    const executor = command.createStore;
    return new Command(executor, ctx);
}

function Insert(ctx, tableName, data) {
    const command = new CommandSet(ctx);

    ctx = {
        tableName,
        data,
        ...ctx,
    };

    const executor = command.insert;

    return new Command(executor, ctx);
}

function Select(ctx, display, tableName, rangeFrom = 1, rangeTo = 1) {
    const command = new CommandSet();
    ctx = {
        display,
        tableName,
        rangeFrom,
        rangeTo,
        ...ctx,
    };
    const executor = command.select;
    return new Command(executor, ctx);
}

function SelectAll(ctx, display, tableName) {
    const command = new CommandSet();
    ctx = {
        display,
        tableName,
        ...ctx,
    };
    const executor = command.selectAll;
    return new Command(executor, ctx);
}

function GetTableInfo(ctx, tableName) {
    const command = new CommandSet();
    ctx = {
        tableName,
        ...ctx,
    };

    const executor = command.getTableInfo;

    return new Command(executor, ctx);
}

window.DeleteFromTable = function (ctx, tableName, indexPath, object) {
    const command = new CommandSet();
    ctx = {
        indexPath,
        tableName,
        object,
        ...ctx,
    };

    const executor = command.deleteFromTable;

    return new Command(executor, ctx);
};

function UpdateTable(ctx, tableName) {}

function DeleteTable(ctx, tableName) {}

function displayCallback(results) {
    results.forEach((item) => {
        console.log(item);
    });
    console.log("\n\n");
}

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

const DB_NAME = "BookDB";
const DB_VERSION = 1;
const TAB_NAME = "BookTable";
const INDEX_PATH = "id";

window.iDB = new IndexDB(DB_NAME, DB_VERSION);

iDB.cursor.onsuccess = (event) => {
    // iDB.execute(new CreateTable(iDB, TAB_NAME, INDEX_PATH, columns));
    // iDB.execute(new Insert(iDB, TAB_NAME, data));
    iDB.execute(new Select(iDB, displayCallback, TAB_NAME), 3, 5);

    iDB.execute(new SelectAll(iDB, displayCallback, TAB_NAME));
};

//     // iDB.execute(new CreateTable(iDB, TAB_NAME + "1", INDEX_PATH, columns));
//     // iDB.execute(new CreateTable(iDB, TAB_NAME + "2", INDEX_PATH, columns));

// };
