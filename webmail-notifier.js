//
// node-red-contrib-webmail-notifier
//
module.exports = function(RED) {
    "use strict";

    var fs = require("fs");

    function WebmailNotifier(config) {
        RED.nodes.createNode(this, config)
        var node = this;
        const ledPath = "/sys/class/leds/"

        function switchLedError(err) {
            node.log("Error setting the led brightness: " + err);
        }

        function switchLedOn(led) {
            fs.writeFile(ledPath + "riso_kagaku0:" + led + "/brightness", "1", switchLedError);
        }
        
        function switchLedsOff() {
            fs.writeFile(ledPath + "riso_kagaku0:red/brightness", "0", switchLedError);
            fs.writeFile(ledPath + "riso_kagaku0:green/brightness", "0", switchLedError);
            fs.writeFile(ledPath + "riso_kagaku0:blue/brightness", "0", switchLedError);
        }
        
        node.on('input', function(msg) {
            switch(msg.payload) {
                case "red":
                    switchLedsOff();
                    switchLedOn("red");
                    break;
                case "green":
                    switchLedsOff();
                    switchLedOn("green");
                    break;
                case "blue":
                    switchLedsOff();
                    switchLedOn("blue");
                    break;
                case "off":
                    switchLedsOff();
                    break;
                default:
                    msg.payload = "Unknown color"
            }
            node.send(msg);
        });
    }

    RED.nodes.registerType("webmail-notifier", WebmailNotifier);
}
