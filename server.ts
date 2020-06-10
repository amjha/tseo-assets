const app = require('./paxserver/app');
const debug = require('debug')('node-angular');
const http = require('http');

const normalizePort = val => {
  const portInt = parseInt(val, 10);
  if (isNaN(portInt)) {
    return val;
  }

  if (portInt >= 0) {
    return portInt;
  }
  return false;
};

const onError = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'pipe ' + port : 'port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const bind = typeof port === 'string' ? 'pipe ' + port : 'port ' + port;
  debug('Listening on ' + bind);
};

const port = normalizePort(process.env.PORT || '3000');
const  host = process.env.HOST || '0.0.0.0';
app.set('port', port);
app.set('host', host);

const server = http.createServer(app);
server.on('error', onError);
server.on('listening', onListening);
server.listen(port, host, () => {
  console.log(`HTTP server listening on host: ${host} and  port: ${port}`);
});
