const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:3000",  // Adjust according to your frontend port
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));
// Middleware and Routes
app.use('/clear-list', require('./routes/clearList'));
app.use('/count-items', require('./routes/countItems'));

// Only start the server if this file is run directly
// Start the server (listen on all interfaces)
if (require.main === module) {
    app.listen(PORT, "0.0.0.0", () => {  // ✅ Listen on all IPs
        console.log(`Server is running on http://0.0.0.0:${PORT}`);
    });
}

module.exports = app; // Export the app for testing