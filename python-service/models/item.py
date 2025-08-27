# python-service/models/item.py
from bson.objectid import ObjectId
from models.database import items_collection


class ItemModel:
    @staticmethod
    def create_item(name, quantity):
        """
        Create a new item in the items collection.
        """
        new_item = {
            "name": name,
            "quantity": quantity
        }
        result = items_collection.insert_one(new_item)
        return str(result.inserted_id)

    @staticmethod
    def get_all_items():
        """
        Get all items from the items collection.
        """
        items = list(items_collection.find({}, {"_id": 1, "name": 1, "quantity": 1}))
        for item in items:
            item["_id"] = str(item["_id"])  # Convert ObjectId to string for JSON compatibility
        return items

    @staticmethod
    def get_item_by_id(item_id):
        """
        Get a single item by its ID.
        """
        item = items_collection.find_one({"_id": ObjectId(item_id)}, {"_id": 1, "name": 1, "quantity": 1})
        if item:
            item["_id"] = str(item["_id"])  # Convert ObjectId to string
        return item

    @staticmethod
    def search_items(keyword):
        """
        Search for items by a keyword in their name.
        """
        items = list(items_collection.find({"name": {"$regex": keyword, "$options": "i"}}, {"_id": 1, "name": 1, "quantity": 1}))
        for item in items:
            item["_id"] = str(item["_id"])  # Convert ObjectId to string
        return items

    @staticmethod
    def delete_item(item_id):
        """
        Delete an item by its ID.
        """
        result = items_collection.delete_one({"_id": ObjectId(item_id)})
        return result.deleted_count

    @staticmethod
    def clear_all_items():
        """
        Clear all items from the items collection.
        """
        result = items_collection.delete_many({})
        return result.deleted_count