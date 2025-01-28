const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize app
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Import and use routes
app.use('/clear-list', require(path.join(__dirname, 'routes/clearList')));
app.use('/count-items', require(path.join(__dirname, 'routes/countItems')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});