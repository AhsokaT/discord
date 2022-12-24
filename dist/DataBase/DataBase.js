"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBaseManager = exports.MongoClientStatus = void 0;
const mongodb_1 = require("mongodb");
var MongoClientStatus;
(function (MongoClientStatus) {
    MongoClientStatus[MongoClientStatus["Connected"] = 0] = "Connected";
    MongoClientStatus[MongoClientStatus["Disconnected"] = 1] = "Disconnected";
})(MongoClientStatus = exports.MongoClientStatus || (exports.MongoClientStatus = {}));
class DataBaseManager {
    client;
    status;
    constructor(mongoURL) {
        this.status = MongoClientStatus.Disconnected;
        this.client = new mongodb_1.MongoClient(mongoURL);
    }
    get database() {
        return this.client.db('Raven');
    }
    get collection() {
        return this.database.collection('Houses');
    }
    async closeConnection() {
        if (this.status === MongoClientStatus.Connected) {
            await this.client.close();
            this.status = MongoClientStatus.Disconnected;
        }
    }
    async openConnection() {
        if (this.status === MongoClientStatus.Disconnected) {
            await this.client.connect();
            this.status = MongoClientStatus.Connected;
        }
    }
    async edit(id, data, closeConnection = true) {
        await this.openConnection();
        let updated = await this.collection.findOneAndUpdate({ _id: id }, { $set: data });
        if (closeConnection)
            await this.closeConnection();
        return updated.value;
    }
    async fetch(id) {
        await this.openConnection();
        const document = await this.collection.findOne({ _id: id });
        await this.closeConnection();
        return document ? document.points : null;
    }
    async fetchAll() {
        await this.openConnection();
        const documents = await this.collection.find().toArray();
        await this.closeConnection();
        return Object.fromEntries(documents.map(doc => [doc._id, doc.points]));
    }
}
exports.DataBaseManager = DataBaseManager;
