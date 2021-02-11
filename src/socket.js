const socketio = require("socket.io");
const { decode } = require("./tool/jwt");

var sockets = {};

function initializeSocketIO(httpServer, subscribe) {
  const io = socketio(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", function (socket) {
    console.log("New socket connected");

    socket.on("auth", function (msg) {
      const token = msg.token || "";
      console.log("Get Auth", token);
      if (!token) {
        // if authentication token does not provided
        // send error message and kill connection
        socket.emit("error", { message: "Authentication token not provided!" });
        socket.disconnet();
        return;
      }

      decode(token)
        .then((decoded) => {
          const userId = decoded.userId || "";
          const deviceId = decoded.deviceId || "";
          //const deviceType = decode.deviceType;
          if (!userId) {
            socket.emit("error", { message: "userId not provided in token" });
            socket.disconnet();
            return;
          }
          if (!deviceId) {
            socket.emit("error", { message: "deviceId not provided in token" });
            socket.disconnet();
            return;
          }
          // Add Socket to the socketlist
          sockets[deviceId] = socket;

          // Notify client that user authenticated successfully
          socket.emit("auth", { ok: true, init: false });
        })
        .catch((err) => {
          socket.emit("error", { message: err });
          socket.disconnet();
        });
    });
    // Notify client that server is ready for authentication process
    socket.emit("auth", { init: true, ok: false });
  });
}

function getSocket(deviceID) {
  return sockets[deviceID];
}

module.exports = { initializeSocketIO, getSocket };
