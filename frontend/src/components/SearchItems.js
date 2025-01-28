import React, { useState } from "react";
import { request } from "../api";

const SearchItems = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  const searchItems = async () => {
    try {
      const response = await request("get", `/search-item?keyword=${keyword}`);
      setResults(response.results);
    } catch (error) {
      alert("Failed to search items. Check backend server.");
    }
  };

  return (
    <div>
      <h2>Search Items</h2>
      <input
        type="text"
        placeholder="Keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button onClick={searchItems}>Search</button>
      <ul>
        {results.map((item) => (
          <li key={item._id}>
            {item.name} - Quantity: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchItems;