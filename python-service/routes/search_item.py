from flask import request
from flask_restful import Resource
from models.database import items_collection
from bson.objectid import ObjectId

class SearchItem(Resource):
    def get(self):
        keyword = request.args.get("keyword", "").lower()
        if not keyword:
            return {"message": "Keyword is required"}, 400
        try:
            # Search for items by keyword
            results = list(items_collection.find(
                {"name": {"$regex": keyword, "$options": "i"}},
                {"_id": 1, "name": 1, "quantity": 1}
            ))

            # Convert ObjectId to string
            for item in results:
                item["_id"] = str(item["_id"])

            return {"results": results}, 200
        except Exception as e:
            return {"message": f"An error occurred: {str(e)}"}, 500