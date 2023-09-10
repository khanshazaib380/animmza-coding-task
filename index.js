const express = require('express');
const app = express();
const Routes = require('./src/routes/routes');
const cors = require('cors');
const http = require('http');
const ip = require('ip');

const server = http.createServer(app);
server.keepAliveTimeout = (60 * 1000) + 1000;
server.headersTimeout = (60 * 1000) + 2000;
app.use(cors());
app.use(express.json());
app.use(Routes);

const PORT = process.env.SERVER_PORT;
const ipAddress = ip.address(); // Get the IP address

server.listen(PORT, () => {
    console.log(`Server running at http://${ipAddress}:${PORT}`);
});
