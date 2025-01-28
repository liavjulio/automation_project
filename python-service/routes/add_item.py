from flask import request
from flask_restful import Resource
from models.database import items_collection

class AddItem(Resource):
    def post(self):
        try:
            data = request.json
            if not data or not data.get("name") or not data.get("quantity") or not data.get("_id"):
                return {"message": "Invalid input data"}, 400
            
            new_item = {
                "_id": data["_id"],  # Use the unique ID from the frontend
                "name": data["name"],
                "quantity": data["quantity"]
            }
            items_collection.insert_one(new_item)
            return {"message": "Item added successfully", "item_id": new_item["_id"]}, 201
        except Exception as e:
            return {"message": f"Failed to add item: {str(e)}"}, 500