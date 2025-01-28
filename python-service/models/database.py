# python-service/models/database.py
from pymongo import MongoClient

MONGO_URI = "mongodb+srv://liavjulio7:Ll456456@bikesafe.8wwo9.mongodb.net/?retryWrites=true&w=majority&appName=bikesafe"

# Connect to MongoDB Atlas
client = MongoClient(MONGO_URI)

shopping_list_db = client["services"]
items_collection = shopping_list_db["items"]