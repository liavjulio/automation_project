import React, { useState, useEffect } from "react";
import { request } from "../api";

const ViewList = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const fetchItems = async () => {
    try {
      const response = await request("get", "/view-list");
      setItems(response.items);
      setError("");
    } catch (err) {
      console.error("Failed to fetch items:", err);
      setError("Failed to fetch items. Check backend server.");
    }
  };

  const deleteItem = async (id) => {
    try {
      await request("delete", `/delete-item?id=${id}`);
      setItems(items.filter((item) => item._id !== id));
      alert("Item deleted successfully.");
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Failed to delete item. Check backend server.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div>
      <h2>View and Delete Items</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item._id}>
              {item.name} - Quantity: {item.quantity}{" "}
              <button onClick={() => deleteItem(item._id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items found in the database.</p>
      )}
    </div>
  );
};

export default ViewList;