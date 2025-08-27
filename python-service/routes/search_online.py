import requests
from flask import request
from flask_restful import Resource
from dotenv import load_dotenv
import os

load_dotenv()
# Amazon API credentials
RAPIDAPI_KEY = os.getenv('RAPIDAPI_KEY')
RAPIDAPI_HOST = os.getenv('RAPIDAPI_HOST')
class SearchOnline(Resource):
    def get(self):
        # Extract query parameters
        query = request.args.get("query", "")
        if not query:
            return {"message": "Query parameter is required"}, 400

        try:
            # Correct endpoint and headers
            url = f"https://{RAPIDAPI_HOST}/search"
            headers = {
                "X-RapidAPI-Key": RAPIDAPI_KEY,
                "X-RapidAPI-Host": RAPIDAPI_HOST,
                "Content-Type": "application/json",
            }
            params = {
                "query": query,
                "country": "US",
                "sort_by": "RELEVANCE",
                "page": "1",
                "product_condition": "ALL",
                "is_prime": "false",
                "deals_and_discounts": "NONE",
            }

            # Make the request
            response = requests.get(url, headers=headers, params=params)

            # Debugging: Print request details
            print("Request URL:", response.url)
            print("Response Status:", response.status_code)
            print("Response Data:", response.json())

            # Handle response
            if response.status_code == 200:
                data = response.json()
                # Debugging: Check if 'data' and 'products' are present
                print("Data structure:", data)

                # Extract products
                products = data.get("data", {}).get("products", [])
                
                if not products:
                    return {"message": "No products found."}, 404

                # Process products for the frontend
                results = [
                    {
                        "title": item.get("product_title", "N/A"),
                        "price": item.get("product_price", "N/A"),
                        "link": item.get("product_url", ""),
                        "image": item.get("product_photo", ""),
                    }
                    for item in products
                ]
                return {"results": results}, 200
            else:
                return {
                    "message": "Error fetching data from Amazon API",
                    "status_code": response.status_code,
                    "details": response.text,
                }, response.status_code
        except Exception as e:
            return {"message": f"An error occurred: {str(e)}"}, 500