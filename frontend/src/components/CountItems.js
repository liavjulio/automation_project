import React, { useState, useEffect } from "react";
import { request } from "../api";

const CountItems = () => {
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");

  const fetchCount = async () => {
    try {
      const response = await request("get", "/count-items");
      console.log("Count Items Response:", response);
      setCount(response.count);
      setError("");
    } catch (error) {
      console.error("Count Items Error:", error);
      setError("Failed to fetch the item count. Check backend server.");
    }
  };

  useEffect(() => {
    fetchCount(); // Call the function on component mount
  }, []);

  return (
    <div>
      <h2>Count Items</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Total Items: {count}</p>
      <button onClick={fetchCount}>Refresh Count</button>
    </div>
  );
};

export default CountItems;