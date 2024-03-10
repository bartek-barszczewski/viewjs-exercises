import {
    CreateTable,
    Insert,
    Select,
    SelectAll,
    GetTableInfo,
    DeleteFromTable,
    UpdateTable,
    DeleteTable,
} from "./queries/Queries.js";

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

    query(init, ...args) {
        this.cursor = init.query();
    }
}
//
//
// usage example
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

const iDB = new IndexDB(DB_NAME, DB_VERSION);

iDB.cursor.onsuccess = (event) => {
    iDB.query(new CreateTable(iDB, TAB_NAME, INDEX_PATH, columns));
    iDB.query(new Insert(iDB, TAB_NAME, data));
    iDB.query(new Select(iDB, displayCallback, TAB_NAME), 3, 5);
    iDB.query(new SelectAll(iDB, displayCallback, TAB_NAME));
};
