

/* This callback is triggered when the page is loaded and it loads the hidden image from the source 
I don't see why this has to happen on load...
*/

var chosenImage = document.getElementById("myImage");
var chosenText = "Add Text Here";

function loadImage() {
	chosenImage.src = "img/mistyi_photo_closeup.jpg";
}

/////////////////////////HELPER SET TEXT AND IMAGE VARIABLES///////
/*This is triggered when a picture is clicked and set as the images to be manipulated */
//set when pictures button is clicked and draw(display)TextOnImage Happens.
function setImage(filename) {

	console.log(filename);
	chosenImage.src = filename.src;
	console.log(chosenImage);
}

function setText() {
	
	var textBox = document.getElementById("chosenTextBox");
	chosenText =textBox.value;
	console.log("Displaying: \"" + chosenText + "\"");
	drawTextOnImage();
}

///////////////////////////TEXT//////////////////////////////////////////////
/* This callback is triggered when the image is loaded, picture and add text button are clicked*/
function drawTextOnImage() {
	console.log("drawing");
	//var img = document.getElementById("myImage");
	var canvas = document.getElementById("mainCanvas");
	var context = canvas.getContext("2d");
	canvas.setAttribute("width", chosenImage.width);
	canvas.setAttribute("height", chosenImage.height);
	context.drawImage(chosenImage, 0, 0);
	addText(chosenText);
}

/* This function is called in drawTextOnImage()*/
function addText(text) {
	var canvas = document.getElementById("mainCanvas");
	var x = canvas.width / 2;
	var y = canvas.height / 4;
	var w = 250;
	var h = 50;
	var context = canvas.getContext("2d");
	context.font = "30px Arial";
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillStyle = "black";
	context.rect(x - w / 2, y - h / 2, w, h);
	context.fill();
	context.fillStyle = "red";
	context.fillText(text, x, y);
}

////////////////////////////////////DOWNLOAD IMAGE/////////////////////////////////
/*Allows user to download the image in variable element*/
function downloadImage(element) {
	var filename = "myImageDownload.jpg";
	var canvas = document.getElementById("mainCanvas");
	var image = canvas.toDataURL("image/jpg");
	element.href = image;
	element.download = filename;
}
