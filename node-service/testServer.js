const app = require('./app');

let server;

function startServer() {
    return new Promise((resolve, reject) => {
        server = app.listen(3000, () => {
            console.log('Test server is running on port 3000');
            resolve(server);
        }).on('error', reject);
    });
}

function stopServer() {
    return new Promise((resolve, reject) => {
        if (server) {
            server.close((err) => {
                if (err) return reject(err);
                console.log('Test server stopped');
                resolve();
            });
        } else {
            resolve();
        }
    });
}

module.exports = { startServer, stopServer };