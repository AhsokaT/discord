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
    async edit(id, data, closeConnection = true) {
        if (this.status === MongoClientStatus.Disconnected) {
            await this.client.connect();
            this.status = MongoClientStatus.Connected;
        }
        let updated = await this.collection.findOneAndUpdate({ _id: id }, { $set: data });
        if (closeConnection && this.status === MongoClientStatus.Connected) {
            await this.client.close();
            this.status = MongoClientStatus.Disconnected;
        }
        return updated.value;
    }
    async fetch(id) {
        if (this.status === MongoClientStatus.Disconnected) {
            await this.client.connect();
            this.status = MongoClientStatus.Connected;
        }
        const document = await this.collection.findOne({ _id: id });
        if (this.status === MongoClientStatus.Connected) {
            await this.client.close();
            this.status = MongoClientStatus.Disconnected;
        }
        return document ? document.points : null;
    }
    async fetchAll() {
        const record = {
            'OWL': 0,
            'PANDA': 0,
            'TIGER': 0,
            'RAVEN': 0,
            'TURTLE': 0
        };
        if (this.status === MongoClientStatus.Disconnected) {
            await this.client.connect();
            this.status = MongoClientStatus.Connected;
        }
        const documents = await this.collection.find().toArray();
        documents.forEach(document => record[document._id] = document.points);
        if (this.status === MongoClientStatus.Connected) {
            await this.client.close();
            this.status = MongoClientStatus.Disconnected;
        }
        return record;
    }
}
exports.DataBaseManager = DataBaseManager;
