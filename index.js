const express = require('express');
const fs = require('fs');
const app = express();
const port = 3110;
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://ferdam:wdplcm11@pcbuilder.xki6y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const collection;
const database;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

async function runServer() {
    try {
        await client.connect();
        await client.db("pcbuilding").command({ ping: 1 });
        console.log("Connected successfully to server");

        app.post('/putSaved', (req, res) => {
            console.log(req.body);
            collection.insertOne(req.body, (err, result) => { 
                if (err) return console.log(err);
            });
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

