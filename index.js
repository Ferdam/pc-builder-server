const express = require('express');
const serverless = require('serverless-http');
const fs = require('fs');
var cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://ferdam:wdplcm11@pcbuilder.xki6y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let collection = null;
let database = null;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function runServer() {
    try {
        await client.connect();
        database = client.db("pcbuilding");
        await database.command({ ping: 1 });
        console.log("Connected successfully to server");
        
        collection = database.collection("saved");

        app.post('/putSaved', (req, res) => {
            // res.set('Access-Control-Allow-Origin', '*');
            // res.header('Access-Control-Allow-Origin', '*');
            // res.header('Content-Type', 'json');
            res.header('Access-Control-Allow-Origin', '*');
            console.log(req.body);
            collection.insertOne(req.body, (err, result) => { 
                if (err) return console.log(err);
                res.send(result);
                return result;
            });
        });
        
        app.get('/', async (req, res) => {
            // res.header('Content-Type', 'json');
            res.header('Access-Control-Allow-Origin', '*');
            res.send('<h1>server</h1>');
        });

        app.get('/getAllSaved', async (req, res) => {
            // res.header('Content-Type', 'json');
            res.header('Access-Control-Allow-Origin', '*');
            let jsonFile;
            try {
                jsonFile = await collection.find({}).toArray();
            }
            catch (ex) {
                jsonFile = { error: 'something went wrong' };
            }
            res.send( jsonFile );
        });

        app.get('/getSaved', async (req, res) => {
            // res.header('Content-Type', 'json');
            res.header('Access-Control-Allow-Origin', '*');
            let docid = req.query.docid;
            let jsonFile;
            try {
                jsonFile = collection.findOne({ _id: docid })
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
        // await client.close();
    }
}
runServer();
