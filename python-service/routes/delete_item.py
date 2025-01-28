from flask import request
from flask_restful import Resource
from models.database import items_collection

class DeleteItem(Resource):
    def delete(self):
        try:
            item_id = request.args.get("id")
            if not item_id:
                return {"message": "Item ID is required"}, 400

            # Delete the item with the provided ID
            result = items_collection.delete_one({"_id": item_id})
            if result.deleted_count == 0:
                return {"message": "Item not found"}, 404

            return {"message": f"Item with ID {item_id} deleted successfully"}, 200
        except Exception as e:
            return {"message": f"Failed to delete item: {str(e)}"}, 500