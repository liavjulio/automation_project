# python-service/models/database.py
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI')

# Connect to MongoDB Atlas
client = MongoClient(MONGO_URI)

shopping_list_db = client["services"]
items_collection = shopping_list_db["items"]