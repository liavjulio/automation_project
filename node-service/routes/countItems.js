const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

// MongoDB connection URI and database details
const uri = "mongodb+srv://liavjulio7:Ll456456@bikesafe.8wwo9.mongodb.net/?retryWrites=true&w=majority&appName=bikesafe";
const client = new MongoClient(uri);

router.get('/', async (req, res) => {
    try {
        await client.connect();
        const database = client.db("services");
        const collection = database.collection("items");

        // Count documents in the collection
        const count = await collection.countDocuments({});
        res.status(200).json({ count: count });
    } catch (error) {
        res.status(500).json({ message: "Error counting items.", error: error.message });
    } finally {
        await client.close();
    }
});

module.exports = router;