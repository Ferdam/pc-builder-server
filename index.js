const express = require('express');
const serverless = require('serverless-http');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://ferdam:wdplcm11@pcbuilder.xki6y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let collection = null;
let database = null;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function runServer() {
    try {
        await client.connect();
        database = client.db("pcbuilding");
        await database.command({ ping: 1 });
        console.log("Connected successfully to server");
        
        collection = database.collection("saved")

        app.post('/putSaved', (req, res) => {
            console.log(req.body);
            collection.insertOne(req.body, (err, result) => { 
                if (err) return console.log(err);
            });
        });
        
        app.get('/', async (req, res) => {
            res.send('<h1>server</h1>');
        });

        app.get('/getSaved', async (req, res) => {
            let docid = req.query.docid;
            let jsonFile;
            try {
                jsonFile = await collection.findOne({ _id: docid })
            }
            catch (ex) {
                jsonFile = { error: 'something went wrong' };
            }
            res.send( jsonFile );
        });
        
        app.listen(port, () => {
            console.log('server started');
        });
    } finally {
        await client.close();
    }
}
runServer();

// client.connect(err => {
//     if (err) return console.log(err);
//     database = client.db("pcbuilding");
//     collection = database.collection("saved");
//     client.close();
// });

