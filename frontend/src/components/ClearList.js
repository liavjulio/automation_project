import React from "react";
import { request } from "../api";

const ClearList = () => {
  const clearList = async () => {
    try {
      const response = await request("delete", "/clear-list");
      alert(response.message);
    } catch (error) {
      alert("Failed to clear the list. Check backend server.");
    }
  };

  return (
    <div>
      <h2>Clear List</h2>
      <button onClick={clearList}>Clear All Items</button>
    </div>
  );
};

export default ClearList;