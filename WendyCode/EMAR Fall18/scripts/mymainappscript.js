

// js for connecting to MISTY


//variable set up
var ipAddress  = document.getElementById("ip-address");
var connect = document.getElementById("connect");
var start = document.getElementById("start");
var stop = document.getElementById("stop");
var resultsBox = document.getElementById("results");

var playAudioArg = {
  "AssetId": "001-OooOooo.wav",
};
var client;
var driveArgs = {
  "LinearVelocity": 0,
  "AngularVelocity": 5,
};
var ip;
var msg = {
  "$id": "1",
  "Operation": "subscribe",
  "Type": "FaceDetection",
  "DebounceMs": 100,
	"EventName": "FaceDetection",
  "Message": ""
};
var message = JSON.stringify(msg);
var messageCount = 0;
var socket;

/////////////////////////////////////////
////**** Function is called, return value will end up in var
// Below trying out new way to do button clicks... 

///////////////////IP Connect Remember to if (!ip) and send error message
connect.onclick = function() {
  ip = validateIPAddress(ipAddress.value);
  if (!ip) {
    printToScreen("IP address needed.");
    return;
  }
  client = new LightClient(ip, 10000);
  client.GetCommand("info/device", function(data) {
    printToScreen("Connected to robot.");
    console.log(data);
  });
};

function validateIPAddress(ip) {
  var ipNumbers = ip.split(".");
  var ipNums = new Array(4);
  if (ipNumbers.length !== 4) {
    return "";
  }
  for (let i = 0; i < 4; i++) {
    ipNums[i] = parseInt(ipNumbers[i]);
    if (ipNums[i] < 0 || ipNums[i] > 255) {
    return "";
    }
  }
  return ip;
}

////////////////////movement control

start.onclick = function() {
  if (!ip) {
    printToScreen("You must connect to a robot first.");
    return;
  }
  // startFaceDetection();
  client.PostCommand("drive", JSON.stringify(driveArgs));
};

stop.onclick = function() {
  client.PostCommand("drive/stop");
  // stopFaceDetection();
};

stop.onclick = function() {
  client.PostCommand("drive/stop");
  // stopFaceDetection();
};

////////////
function right180(){
    printToScreen("right 180");
}


////////////////////////////////////////////////////////////////
/////////////////////////////////////helper functions//////////////
function printToScreen(msg) {
  resultsBox.innerHTML += (msg + "\r\n");
}

///////////////////Testing out Face detection
////you have to use JSON.stringify to convert js values into JSON string
function startFaceDetection() {
    //Create a new websocket, if one is not already open
    socket = socket ? socket : new WebSocket("ws://" + ip + "/pubsub");
    //When the socket is open, send the message
    socket.onopen = function(event) {
      printToScreen("WebSocket opened.");
      socket.send(message);
      client.PostCommand("beta/faces/detection/start");
      printToScreen("Face detection started.");
    };
    // Handle messages received from the server
    socket.onmessage = function(event) {
      client.PostCommand("drive/stop");
      console.log(JSON.parse(event.data).message);
      printToScreen("Face detected.");
      var payload = JSON.stringify(playAudioArg);
      client.PostCommand("audio/play", payload);
    };
    // Handle any errors that occur.
    socket.onerror = function(error) {
      console.log("WebSocket Error: " + error);
    };
    // Do something when the WebSocket is closed.
    socket.onclose = function(event) {
      printToScreen("WebSocket closed.");
    };
}

function stopFaceDetection() {
  client.PostCommand("beta/faces/detection/stop");
  printToScreen("Face detection stopped.");
  socket.close();
}
