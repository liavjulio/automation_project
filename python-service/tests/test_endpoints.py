import pytest
from unittest.mock import MagicMock
from flask import Flask
from routes.add_item import AddItem
from routes.clear_list import ClearList
from routes.count_items import CountItems
from routes.delete_item import DeleteItem
from routes.generate_id import GenerateID
from routes.search_item import SearchItem
from routes.search_online import SearchOnline
from routes.view_list import ViewList
from models.database import items_collection

@pytest.fixture
def client():
    app = Flask(__name__)
    app.testing = True

    app.add_url_rule('/add-item', view_func=AddItem.as_view('add_item'))
    app.add_url_rule('/clear-list', view_func=ClearList.as_view('clear_list'))
    app.add_url_rule('/count-items', view_func=CountItems.as_view('count_items'))
    app.add_url_rule('/delete-item', view_func=DeleteItem.as_view('delete_item'))
    app.add_url_rule('/generate-id', view_func=GenerateID.as_view('generate_id'))
    app.add_url_rule('/search-item', view_func=SearchItem.as_view('search_item'))
    app.add_url_rule('/search-online', view_func=SearchOnline.as_view('search_online'))
    app.add_url_rule('/view-list', view_func=ViewList.as_view('view_list'))
    
    return app.test_client()

def test_add_item_success(client):
    items_collection.insert_one = MagicMock()
    response = client.post('/add-item', json={"_id": "123", "name": "Test Item", "quantity": 5})
    assert response.status_code == 201
    assert response.json == {"message": "Item added successfully", "item_id": "123"}
    items_collection.insert_one.assert_called_once()

def test_clear_list(client):
    items_collection.delete_many = MagicMock(return_value=MagicMock(deleted_count=5))
    response = client.delete('/clear-list')
    assert response.status_code == 200
    assert response.json == {"message": "5 items cleared from the list."}

def test_count_items(client):
    items_collection.count_documents = MagicMock(return_value=10)
    response = client.get('/count-items')
    assert response.status_code == 200
    assert response.json == {"count": 10}

def test_delete_item(client):
    items_collection.delete_one = MagicMock(return_value=MagicMock(deleted_count=1))
    response = client.delete('/delete-item', query_string={"id": "123"})
    assert response.status_code == 200
    assert "Item with ID 123 deleted successfully" in response.json["message"]

def test_generate_id(client):
    response = client.get('/generate-id')
    assert response.status_code == 200
    assert "unique_id" in response.json

def test_search_item(client):
    items_collection.find = MagicMock(return_value=[{"_id": "123", "name": "Test Item", "quantity": 5}])
    response = client.get('/search-item', query_string={"keyword": "Test"})
    assert response.status_code == 200
    assert "results" in response.json

def test_search_online(client):
    response = client.get('/search-online', query_string={"query": "laptop"})
    assert response.status_code in [200, 404]

def test_view_list(client):
    items_collection.find = MagicMock(return_value=[{"_id": "123", "name": "Test Item", "quantity": 5}])
    response = client.get('/view-list')
    assert response.status_code == 200
    assert "items" in response.json
