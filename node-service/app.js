const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware and Routes
app.use('/clear-list', require('./routes/clearList'));
app.use('/count-items', require('./routes/countItems'));

// Only start the server if this file is run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app; // Export the app for testing