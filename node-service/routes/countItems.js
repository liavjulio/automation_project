const express = require('express');
const router = express.Router();
require('dotenv').config();
const { MongoClient } = require('mongodb');

// Use a single database connection
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function connectDB() {
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
    }
    return client.db("services").collection("items");
}

router.get('/', async (req, res) => {
    try {
        const collection = await connectDB();
        const count = await collection.countDocuments({});
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: "Error counting items.", error: error.message });
    }
});

module.exports = router;