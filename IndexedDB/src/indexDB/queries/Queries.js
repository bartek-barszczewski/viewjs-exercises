import {Query, QuerySet} from "./Query.js";

export function CreateTable(ctx, tableName, indexPath, columns) {
    const querySet = new QuerySet();
    ctx = {
        tableName,
        indexPath,
        columns,
        ...ctx,
    };

    const queryInit = querySet.createStore;
    return new Query(queryInit, ctx);
}

export function Insert(ctx, tableName, data) {
    const querySet = new QuerySet(ctx);

    ctx = {
        tableName,
        data,
        ...ctx,
    };

    const queryInit = querySet.insert;

    return new Query(queryInit, ctx);
}

export function Select(ctx, display, tableName, rangeFrom = 1, rangeTo = 1) {
    const querySet = new QuerySet();
    ctx = {
        display,
        tableName,
        rangeFrom,
        rangeTo,
        ...ctx,
    };
    const queryInit = querySet.select;
    return new Query(queryInit, ctx);
}

export function SelectAll(ctx, display, tableName) {
    const querySet = new QuerySet();
    ctx = {
        display,
        tableName,
        ...ctx,
    };
    const queryInit = querySet.selectAll;
    return new Query(queryInit, ctx);
}

export function GetTableInfo(ctx, tableName) {
    const querySet = new QuerySet();
    ctx = {
        tableName,
        ...ctx,
    };

    const queryInit = querySet.getTableInfo;

    return new Query(queryInit, ctx);
}

export function DeleteFromTable(ctx, tableName, indexPath, object) {
    const querySet = new QuerySet();
    ctx = {
        indexPath,
        tableName,
        object,
        ...ctx,
    };

    const queryInit = querySet.deleteFromTable;

    return new Query(queryInit, ctx);
}

export function UpdateTable(ctx, tableName) {}

export function DeleteTable(ctx, tableName) {}
