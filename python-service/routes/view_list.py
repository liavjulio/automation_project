# python-service/routes/view_list.py
from flask_restful import Resource
from models.database import items_collection

class ViewList(Resource):
    def get(self):
        items = list(items_collection.find({}, {"_id": 1, "name": 1, "quantity": 1}))
        for item in items:
            item["_id"] = str(item["_id"])  # Convert ObjectId to string
        return {"items": items}, 200  # Return an empty list if no items