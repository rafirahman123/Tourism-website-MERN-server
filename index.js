const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const ObjectId = require("mongodb").ObjectId;

// Middleware
app.use(cors());
app.use(express.json());

// tourismUser
// B5FR66laauY80F3z

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3fgg4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('connected to database');
        const database = client.db('Toursim');
        const packageCollection = database.collection('packages');

        const ordersCollection = database.collection('orders');

        // GET API
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });

        //Add Tour Package API Post Api
        app.post('/addPackage', async (req, res) => {
            const package = req.body;
            console.log(package);
            const result = await packageCollection.insertOne(package);
            res.send(result);
        });

        //ADD Order by POST Method
        app.post('/orders', async (req, res) => {
            const orderPackage = req.body;
            console.log(orderPackage);
            const result = await ordersCollection.insertOne(orderPackage);
            res.send(result);
        });

        //GET my Orders
        app.get('/myOrders/:email', async (req, res) => {
            const result = await ordersCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(result);
        });

        //Get API for Manage All Order
        app.get('/manageAllOrder', async (req, res) => {
            const result = await ordersCollection.find({}).toArray();
            res.send(result);
            console.log(result);
        });

        //DELETE an Personal Ordered Event
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            // console.log(id);
            const result = await ordersCollection.deleteOne(query);
            console.log("Deleting user with id ", result);
            res.send(result);
        });


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Toursim server running');
});


app.listen(port, () => {
    console.log('Running genius server on port', port);
})