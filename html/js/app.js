    var socketAddress = "";
    var socket = null;

    function preparePage() {
        console.log("Page preparing ...");
        var date = new Date();
        $("#current_year").text(date.getFullYear())
    }

    function openWsServer() {
        var address = $("#ws_address").val();
        socketAddress = buildServerAddress(address, false);  // todo: umv: add checkbox here
        console.log("Websocket open server: " + address);
        socket = new WebSocket(socketAddress)
                // todo: analyze was socket conn establish was successful or not
                // todo: UMV: log to logs textarea
        logWsEvent("Web socket connection opened", null);
        socket.onmessage = function (event) {
            console.log("Got message from server");
            // todo: UMV: log to logs textarea
         }
    }

    function closeWsServer() {
        console.log("Websocket close server");
        if (socket != null) {
            socket.close();
            socket = null;
            logWsEvent("Web socket connection closed", null);
        }
    }

    function sendDataToWsServer() {
        if (socket != null) {
            console.log("Websocket send data");
            var message = $("#ws_payload").val();
            if (message.startsWith("{")) {
                message = JSON.stringify(message);
            }
            socket.send(message);
            // todo: UMV: add log to logs textarea here
        }
    }

    function buildServerAddress(address, secure) {
        if (!(address.startsWith("ws://") || address.startsWith("wss://")))
            return secure ? "wss://" + address : "ws://" + address;
        return address;
    }

    function logWsEvent(messageType, messageData) {
        var logMsg = createLogMessage(messageType, messageData);
        $("#ws_logs").append(logMsg);
    }

    function createLogMessage(messageType, messageData) {
        var dateStr = getFormattedDate();
        var logStr = dateStr + ": " + messageType;
        if (messageData != null && messageData.length > 0) {
            logStr = logStr + " : " + messageData
        }
        logStr += "\n";
        return logStr;
    }

    function getFormattedDate() {
        var date = new Date();
        var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        return str;
    }