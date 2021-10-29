const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();

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

        // GET API
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })

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