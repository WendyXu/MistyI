

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

var displayduration =5;

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

//////////////////LED
function setLEDColor(){
    checkIP();

	chosencolor =document.getElementById("LEDcolorPicker").value;
	console.log("Displaying: \"" + chosencolor + "\"");
    printToScreen("LED color: "+ chosencolor);
    r = hexToRgb(chosencolor).r;
    g = hexToRgb(chosencolor).g;
    b = hexToRgb(chosencolor).b;
    //client.PostCommand("led/change", JSON.stringify({"Red":r,"Green":g,"Blue":b}));
    
    //Attempting a promise here:        
    var confirmLEDpromise = new Promise(function(resolve, reject) {
        client.PostCommand("led/change", JSON.stringify({"Red":r,"Green":g,"Blue":b}));
    });
    
/*     confirmLEDpromise.then(function(result){
        printToScreen(result);
        printToScreen("Inside promise.then");
    //this is not working
    }); */
    //How do I test a fail? 
        //confirmLEDpromise.then(printToScreen("Inside promise.then")); //this works
        //confirmLEDpromise.then(printToScreen(value)); //this doesn't working
        //confirmLEDpromise.then(printToScreen(result)); //this doesn't working
        
     /* function checkDefaultGroupForOptions() {
    // Get usersInfo to get userid
    var getUsersInfoPromise = new Promise(function(resolve, reject) {
        odkData.getUsers(resolve, reject);
    });

    getUsersInfoPromise.then(function(result) {
        var users = [];
        users = result.getUsers();

        if (users.length == 1) {
            indexUserId = users[0].user_id;
        }

        return new Promise(function(resolve, reject) {
            odkData.getDefaultGroup(resolve, reject);
        });

    }).then(
    
    function (result) {
        var defGrp = result.getDefaultGroup();
        if (defGrp !== null && defGrp !== undefined) {
            var body = $('#main');
            body.css('background-image', 'url(img/bw-business-bubble.jpg)');
            if (util.ADMIN_DEFAULT_GROUPS.indexOf(defGrp) > -1)
            {
                initCoordinatorButton();
            } else {
                if (util.checkValidAgentDefaultGroup(defGrp)) {
                    indexDefaultGroup = defGrp;
                    initAgentButton();
                } else {
                    $('#login-text').text('Invalid agent default group.')
                }
            }

        } else {
            $('#login-text').text('You must login to use eKichabi.')
            // TODO: Show login button to launch sync
        }

    }
    
    
    ).catch(function(error) {
        console.log('Could not get default group or userid for user: ' + error);
        $('#login-text').text('Error getting default group or userid.  User must have a default group and valid userid to use eKichabi.')
    }); 
} 
*/
    
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

//alert( hexToRgb("#0033ff").g ); // "51";

////////////////////////////////////////////////////////////////
////////////////////MOVEMENT CONTROL

start.onclick = function() {
  if (!ip) {
    printToScreen("You must connect to a robot first.");
    return;
  }
  // startFaceDetection();
  printToScreen("Left turning");
  client.PostCommand("drive", JSON.stringify(driveArgs));
};


stop.onclick = function() {
  printToScreen("Stopping");
  client.PostCommand("drive/stop");
  // stopFaceDetection();
};

////////////
function rightquickbit(){
    
    var rightquickbitdriveArgs = {
      "LinearVelocity": 0,
      "AngularVelocity": -25,
      "TimeMs":500
    
      };
    printToScreen("Quickly right a bit" + JSON.stringify(rightquickbitdriveArgs));
    client.PostCommand("drive/time", JSON.stringify(rightquickbitdriveArgs));

}

function wiggle(){
    printToScreen("Wiggle");

    client.PostCommand("drive/time", JSON.stringify({"LinearVelocity":0,"AngularVelocity":-25,"TimeMs":500}));
    client.PostCommand("drive/time", JSON.stringify({"LinearVelocity":0,"AngularVelocity":25,"TimeMs":1000}));
    client.PostCommand("drive/time", JSON.stringify({"LinearVelocity":0,"AngularVelocity":-25,"TimeMs":500}));

}

// look slightly down
function lookDown(){
    printToScreen("Look down");
    client.PostCommand("beta/head/move", "{ \"Pitch\": \"1\", \"Velocity\": \"10\" }");

}

////////////////////////////////////////////////////////////////
///////////////////IMAGE MANIPULATION
function setDisplayDuration(){
    displayduration =  document.getElementById("durationTextBox").value;
    printToScreen(displayduration);
    
    
}
//parameter filename...?
function displayImage(image){
    checkIP();
    var index = image.src.lastIndexOf("/"); //This give me the index afterwhich the filenames starts
    var myfile = image.src.substring(index+1);
    printToScreen("Post image/change: " +myfile);

    client.PostCommand("images/change",JSON.stringify({"FileName":myfile,"TimeoutSeconds":displayduration,"Alpha":1}));
    //client.PostCommand("images/change",JSON.stringify({"FileName":"Angry.jpg","TimeoutSeconds":displayduration,"Alpha":1}));
}






////////////////////////////////////////////////////////////////
/////////////////////////////////////helper functions//////////////
function printToScreen(msg) {
  resultsBox.innerHTML += (msg + "\r\n");
}

function checkIP(){
  if (!ip) {
    printToScreen("IP Missing. Connect to robot first.");
  }
}
///////////////////Testing out Face detection
////you have to use JSON.stringify to convert js values into JSON string
function startFaceDetection() {
    //Create a new websocket, if one is not already open
    socket = socket ? socket : new WebSocket("ws://" + ip + "/pubsub");
    //  ternary operator condition ? true action: false action O_o
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
