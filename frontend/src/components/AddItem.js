import React, { useState } from "react";
import { request } from "../api";
import "../styles/componentStyle.css";

const AddItem = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");

  const addItem = async () => {
    try {
      if (!name || !quantity) {
        alert("Please provide both name and quantity.");
        return;
      }

      // Generate unique ID when adding the item
      const idResponse = await request("get", "/generate-id");
      const uniqueId = idResponse.unique_id;

      const response = await request("post", "/add-item", {
        _id: uniqueId,
        name,
        quantity,
      });

      alert(`Item added: ${response.item_id}`);
      setName("");
      setQuantity("");
    } catch (error) {
      alert("Failed to add item. Check backend server.");
    }
  };

  return (
    <div className="pop-up">
      <h2>Add Item</h2>
      <input
        type="text"
        placeholder="Item Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button onClick={addItem}>Add Item</button>
    </div>
  );
};

export default AddItem;