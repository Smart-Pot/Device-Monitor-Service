const http = require("http");
const { initializeSocketIO, getSocket } = require("./socket");
const cfg = require("../config.json").server;
const { migrateMQTT, subscribe } = require("./mqtt");

async function main() {
  migrateMQTT(getSocket, function () {
    const httpServer = http.createServer();
    initializeSocketIO(httpServer, subscribe);
    httpServer.listen(cfg.port, () => {
      console.log(`listening port ${cfg.port}`);
    });
  });
}

main();
