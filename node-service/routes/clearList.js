const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

// MongoDB connection URI and database details
const uri = "mongodb+srv://liavjulio7:Ll456456@bikesafe.8wwo9.mongodb.net/?retryWrites=true&w=majority&appName=bikesafe";
const client = new MongoClient(uri);

router.delete('/', async (req, res) => {
    try {
        await client.connect();
        const database = client.db("services");
        const collection = database.collection("items");

        // Delete all items
        const result = await collection.deleteMany({});
        res.status(200).json({ message: `${result.deletedCount} items cleared from the list.` });
    } catch (error) {
        res.status(500).json({ message: "Error clearing the list.", error: error.message });
    } finally {
        await client.close();
    }
});

module.exports = router;