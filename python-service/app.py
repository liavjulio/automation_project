# python-service/app.py
from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from routes.add_item import AddItem
from routes.delete_item import DeleteItem
from routes.view_list import ViewList
from routes.count_items import CountItems
from routes.clear_list import ClearList
from routes.generate_id import GenerateID
from routes.search_item import SearchItem
from routes.search_online import SearchOnline
app = Flask(__name__)
CORS(app)
api = Api(app)


api.add_resource(AddItem, '/add-item')
api.add_resource(DeleteItem, '/delete-item')
api.add_resource(ViewList, '/view-list')
api.add_resource(CountItems, '/count-items')
api.add_resource(ClearList, '/clear-list')
api.add_resource(GenerateID, '/generate-id')
api.add_resource(SearchItem, '/search-item')
api.add_resource(SearchOnline , '/search-online')

if __name__ == '__main__':
    app.run(debug=True)