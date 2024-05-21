"use strict";
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        function next() {
            while (env.stack.length) {
                var rec = env.stack.pop();
                try {
                    var result = rec.dispose && rec.dispose.call(rec.value);
                    if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                catch (e) {
                    fail(e);
                }
            }
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseManager = void 0;
const mongodb_1 = require("mongodb");
const enum_1 = require("../util/enum");
class DatabaseManager {
    client;
    mongo;
    cache;
    constructor(client, mongoUrl = process.env.MONGO_URL) {
        this.client = client;
        if (mongoUrl == null)
            throw TypeError('MONGO_URL is not defined in .env or passed to constructor.');
        this.client = client;
        this.cache = new Map();
        this.mongo = new mongodb_1.MongoClient(mongoUrl);
    }
    get sorted() {
        return enum_1.House.ids.map(name => [name, this.cache.get(name)]).sort((a, b) => b[1] - a[1]);
    }
    async connect() {
        await this.mongo.connect();
        return {
            [Symbol.dispose]: () => this.mongo.close(),
            [Symbol.asyncDispose]: () => this.mongo.close(),
            db: this.mongo.db('Raven'),
            collection: this.mongo.db('Raven').collection('Houses')
        };
    }
    async init() {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            const connection = __addDisposableResource(env_1, await this.connect(), false);
            const houses = await connection.collection.find().toArray();
            for (const house of houses)
                this.cache.set(house._id, house.points);
            return houses;
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            __disposeResources(env_1);
        }
    }
    async patch(data) {
        const env_2 = { stack: [], error: void 0, hasError: false };
        try {
            const connection = __addDisposableResource(env_2, await this.connect(), false);
            const operations = data.map(([id, points]) => ({ updateOne: { filter: { _id: id }, update: { $set: { points } } } }));
            await connection.collection.bulkWrite(operations);
            for (const [id, points] of data)
                this.cache.set(id, points);
        }
        catch (e_2) {
            env_2.error = e_2;
            env_2.hasError = true;
        }
        finally {
            __disposeResources(env_2);
        }
    }
}
exports.DatabaseManager = DatabaseManager;
