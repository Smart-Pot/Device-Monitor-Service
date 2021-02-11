"use strict";
const mqtt = require("mqtt");
const cfg = require("../config.json").mqtt;

var client = null;

function migrateMQTT(getSocket, cb) {
  client = mqtt.connect(cfg.address);
  client.on("connect", function () {
    cb();
  });

  client.subscribe("device/basic/+", function (err) {
    if (err) {
      console.error(err);
      return;
    }
    client.on("message", function (topic, message) {
      const parts = topic.split("/");
      if (parts.length != 3) {
        // TODO:
        return;
      }
      const deviceId = parts[2];

      const socket = getSocket(deviceId);

      // If does not exist
      if (!socket) {
        console.log("socket not found");
        return;
      }
      socket.emit("deviceData", message.toString());
    });
  });
}

function subscribe(topic) {
  return client.subscribe(topic);
}

module.exports = { migrateMQTT, subscribe };
