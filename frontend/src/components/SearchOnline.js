import React, { useState, useEffect } from "react";
import { request } from "../api"; // API utility for making requests

const PriceCompare = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResults([]); // Clear previous results
  
    try {
      const response = await request("get", `/search-online?query=${query}`);
      console.log("API Response:", response); // Debugging
  
      // Ensure the response has the `results` key and it is an array
      if (response.results && Array.isArray(response.results)) {
        const products = response.results;
  
        if (products.length > 0) {
          const mappedProducts = products.map((product) => ({
            title: product.title,
            price: product.price,
            link: product.link,
            image: product.image,
            rating: "N/A",  // You can handle rating if you get it from the API
            reviews: "No reviews",  // Similarly, handle reviews if available
          }));
  
          setResults(mappedProducts);
          console.log("Updated Results:", mappedProducts); // Debugging
        } else {
          setError("No products found for your search.");
        }
      } else {
        setError("No products found for your search.");
        console.error("Invalid API Response:", response);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch price comparisons. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Results updated:", results);
  }, [results]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#4CAF50", textAlign: "center" }}>Price Comparison</h2>
      <div style={{ margin: "20px 0", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Search for a product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "300px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {results.map((product, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px",
              textAlign: "center",
            }}
          >
            <img
              src={product.image || "https://via.placeholder.com/150"}
              alt={product.title}
              style={{
                maxWidth: "100%",
                height: "150px",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
            <h3 style={{ fontSize: "16px", margin: "10px 0" }}>{product.title}</h3>
            <p style={{ color: "green", fontWeight: "bold" }}>
              Price: {product.price || "N/A"}
            </p>
            <p style={{ fontSize: "14px", color: "#555" }}>
              Rating: {product.rating || "N/A"} ({product.reviews || "No reviews"})
            </p>
            <a
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#4CAF50",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
              }}
            >
              View Product
            </a>
          </div>
        ))}
      </div>
      {results.length === 0 && !loading && !error && (
        <p style={{ textAlign: "center", color: "#777" }}>No results to display.</p>
      )}
    </div>
  );
};

export default PriceCompare;
