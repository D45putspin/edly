const http= require('http');
const app= require('./app');
const port= 8080;
const HOST='0.0.0.0';
const server= http.createServer(app);
server.listen(port,HOST);