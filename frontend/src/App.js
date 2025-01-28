// Updated App.js to use collapsible sections for better layout
import React, { useState } from "react";
import AddItem from "./components/AddItem";
import SearchItems from "./components/SearchItems";
import SearchOnline from "./components/SearchOnline";
import ViewList from "./components/ViewList";
import CountItems from "./components/CountItems";
import ClearList from "./components/ClearList";
import "./styles/styles.css";

const App = () => {
  const [visibleSection, setVisibleSection] = useState(null);

  const toggleSection = (section) => {
    setVisibleSection(visibleSection === section ? null : section);
  };

  return (
    <div className="container">
      <h1>Item Management</h1>

      <div className="section">
        <button className="toggle-button" onClick={() => toggleSection("addItem")}>Add Item</button>
        {visibleSection === "addItem" && <AddItem />}
      </div>

      <div className="section">
        <button className="toggle-button" onClick={() => toggleSection("searchItems")}>Search Items</button>
        {visibleSection === "searchItems" && <SearchItems />}
      </div>

      <div className="section">
        <button className="toggle-button" onClick={() => toggleSection("searchOnline")}>Price Comparison</button>
        {visibleSection === "searchOnline" && <SearchOnline />}
      </div>

      <div className="section">
        <button className="toggle-button" onClick={() => toggleSection("viewList")}>View and Delete Items</button>
        {visibleSection === "viewList" && <ViewList />}
      </div>

      <div className="section">
        <button className="toggle-button" onClick={() => toggleSection("countItems")}>Count Items</button>
        {visibleSection === "countItems" && <CountItems />}
      </div>

      <div className="section">
        <button className="toggle-button" onClick={() => toggleSection("clearList")}>Clear List</button>
        {visibleSection === "clearList" && <ClearList />}
      </div>
    </div>
  );
};

export default App;