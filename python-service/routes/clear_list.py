# python-service/routes/clear_list.py
from flask_restful import Resource
from models.database import items_collection

class ClearList(Resource):
    def delete(self):
        result = items_collection.delete_many({})
        return {"message": f"{result.deleted_count} items cleared from the list."}, 200