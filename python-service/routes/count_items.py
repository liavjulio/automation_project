from flask_restful import Resource
from models.database import items_collection

class CountItems(Resource):
    def get(self):
        try:
            count = items_collection.count_documents({})
            return {"count": count}, 200
        except Exception as e:
            return {"message": f"Error counting items: {str(e)}"}, 500