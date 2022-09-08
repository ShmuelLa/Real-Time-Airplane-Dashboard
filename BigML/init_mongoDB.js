const bigml = require('bigml');
const express = require("express");
const { MongoClient } = require('mongodb');
const csvtojson = require("csvtojson");
const app = express();

const connection = new bigml.BigML('ShmuelLa', '1bbe994797b5fb7637e4590aa3c11bff420a548e');
bigml.Prediction(connection)

const localModel = new bigml.LocalModel('model/6318d5768be2aa4bb80001e8', connection);

const url = "mongodb://localhost:2717";
const mongo = new MongoClient(url);
const db_name = "airdb"


async function inserJson(csvData) {
    try {
        await mongo.connect();
        const database = mongo.db(db_name);
        const foods = database.collection("test2");
        // this option prevents additional documents from being inserted if one fails
        const options = { ordered: true };
        const result = await foods.insertMany(csvData, options);
        console.log(`${result.insertedCount} documents were inserted`);
    } finally {
        await mongo.close();
    }
}

csvtojson()
    .fromFile(__dirname + "/../Datasets/1000-data.csv")
    .then(csvData => {
        inserJson(csvData).catch(console.dir);
});