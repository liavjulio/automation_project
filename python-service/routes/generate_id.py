# python-service/routes/generate_id.py
from flask_restful import Resource
import uuid

class GenerateID(Resource):
    def get(self):
        unique_id = str(uuid.uuid4())
        return {"unique_id": unique_id}, 200