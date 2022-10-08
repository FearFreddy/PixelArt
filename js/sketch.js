let canvas;

let video = [];
let currVideo = 0;
let videoVolume = 1;
let playing = false;
let realVideoDisplayed = true;

let drawing = false;
let currentDrawingForm = 0;
let reversed = false;
let reverseColor = false;

let mouseOverUIElement = false;

function preload() {
	video[0] = createVideo('video/aboutYou.mp4');
	video[1] = createVideo('video/moderat.mp4');
	video[2] = createVideo('video/birds.mp4');
	video[3] = createVideo('video/cityNight.mp4');
	video[4] = createVideo('video/Binkbeats.mp4');
	video[5] = createVideo('video/lava.mp4');
	video[6] = createVideo('video/fireworks.mp4');
} 

function setup() {
	canvas = createCanvas(window.innerWidth, window.innerHeight);
	canvas.parent(body);
	canvas.class('canvasP5');

	video.forEach(function(video) {
		video.position(0,0);
		video.size(width,height);
		video.hide();
	});

	video[0].show();
}

function draw(){
	if(drawing)
		drawPixels();
}

function windowResized() {
	canvas.size(window.innerWidth,window.innerHeight);
	video.forEach(function(video) {
		video.size(width,height);
	});
	clear();
}


$('.leftArrow').on('click', function() {
	nextOrPrevVideo(true)
});

$('.rightArrow').on('click', function() {
	nextOrPrevVideo(false);
});

function nextOrPrevVideo(next) {
	video[currVideo].pause();
	video[currVideo].hide();

	if(next) {
		if(currVideo == 0) {
			currVideo = video.length -1;
		} else currVideo--;
	} else {
		if(currVideo == video.length -1) {
			currVideo = 0;
		} else currVideo++;
	}	

	video[currVideo].show();
	video[currVideo].position(0,0);
	video[currVideo].play();
	video[currVideo].volume(videoVolume)
	if(!realVideoDisplayed) video[currVideo].style("opacity", 0);
}

$(window).on('keyup', function(e) {
	if(e.keyCode === 32) {
		if($('.uiContainer').css("opacity") === "0") {
			$('.uiContainer').css({ opacity: 1})		
		} else {
			$('.uiContainer').css({ opacity: 0})
		}
	}
})

function playVideo(node) {
	video[currVideo].play();
	$(node).attr("src", "img/pause.png");
	playing = !playing;
}

function pauseVideo(node) {
	video[currVideo].pause();
	$(node).attr("src", "img/play.png");
	playing = !playing;
}

$('.toggleVideo').on('click', function() {
	if(!playing) {
		playVideo(this);
	} else pauseVideo(this);
});

$('.toggleDrawing').on('click', function() {
	if(!drawing) {
		$(this).attr("src", "img/pencil.png");
		$('.drawElement').css("opacity", 1)
		$('.drawElement').css("cursor", "pointer")
	} else {
		clear();
		$(this).attr("src", "img/pencil-off.png");
		$('.drawElement').css("opacity", 0.3)
		$('.drawElement').css("cursor", "default")
	}
	drawing = !drawing;
});

$('.changeForm').on('click', function() {
	if(drawing) {
		if(currentDrawingForm < 3) {
			currentDrawingForm++;
		} else {
			currentDrawingForm = 0;
		}
	}
});

$('.toggleRealVideo').on('click', function() {
	if(realVideoDisplayed) {
		$(this).attr("src", "img/camera-off.png");
		video[currVideo].style('opacity', 0);
	} else { 
		$(this).attr("src", "img/camera.png");
		video[currVideo].style('opacity', 1);
	}

	realVideoDisplayed = !realVideoDisplayed;
});

$('.toggleSound').on('click', function() {
	if(videoVolume === 1) {
		$(this).attr("src", "img/volume-off.png");
		video[currVideo].volume(0);
	} else { 
		$(this).attr("src", "img/volume-high.png");
		video[currVideo].volume(1); 
	}
	videoVolume = Math.abs(videoVolume - 1)
});

$('.flipVideo').on('click', function() {
	if(drawing) {
		reversed = !reversed;
	}
});

$('.colorButton').on('click', function() {
	if(drawing) {
		reverseColor = !reverseColor;
	}
});

$('.toggleHelp').on("click", function() {
	if($('.info').css("opacity") === "0") {
		$('.info').css("opacity", 1);
	} else $('.info').css("opacity", 0);
})


$('.uiElement').on('mouseenter', function() {
	mouseOverUIElement = true;
});

$('.uiElement').on('mouseleave', function() {
	mouseOverUIElement = false;
});


function drawPixels() {
	if(mouseIsPressed && !mouseOverUIElement) clear();

	video[currVideo].loadPixels();
  	let stepSize = round(constrain(mouseX / 10, 12, 200));
  	noStroke();
  	let whichForm = null;
	switch(currentDrawingForm) {
		case 0: 
			whichForm = (randX, randY, x, y, i) => triangle(x + randX,y + randY,x +stepSize +randX, y+stepSize +randY, x + randX, y+ stepSize +randY);
			break;
		case 1: 
			whichForm = (randX, randY, x, y, i) => ellipse(x + randX, y + randY, stepSize, stepSize);
			break;
		case 2:
			whichForm = (randX, randY, x, y, i) => {
			strokeWeight(7);
				if(!reverseColor) {
					stroke(video[currVideo].pixels[i*4],video[currVideo].pixels[i*4 + 1], video[currVideo].pixels[i*4 + 2], round(constrain(mouseY / 10, 15, 100)));
				} else {
					stroke(video[currVideo].pixels[i*4 + 2],video[currVideo].pixels[i*4 + 1], video[currVideo].pixels[i*4], round(constrain(mouseY / 10, 15, 100)));
				}
				line(x + randX, y + randY, x + randX + stepSize, y + randY + stepSize);					
			}
			break;
		default:
			whichForm = (randX, randY, x, y, i) => rect(x + randX, y + randY, stepSize, stepSize);
			break;
	}
	let fillWithColor = null;
	if(!reverseColor) {
		fillWithColor = i => fill(video[currVideo].pixels[i*4],video[currVideo].pixels[i*4 + 1], video[currVideo].pixels[i*4 + 2], round(constrain(mouseY / 10, 15, 100)));
	} else {
		fillWithColor = i => fill(video[currVideo].pixels[i*4 + 2],video[currVideo].pixels[i*4 + 1], video[currVideo].pixels[i*4], round(constrain(mouseY / 10, 15, 100)));
	}

  	if(!reversed) {
  		for (let y= 0; y < height; y+=stepSize) {
    		for (let x= 0; x <width; x+=stepSize) {
      			let i = y * width + x;
      			fillWithColor(i);
      			let randomX = random(-7,7);
      			let randomY = random(-7,7);
      			whichForm(randomX, randomY, x, y, i);
    		}
  		}
  	}
 	// reversed
  	else {
  		for (let y= height; y > 0; y-=stepSize) {
    		for (let x= width; x > 0; x-=stepSize) {
      			let i = y * width - x;
      			//COLOR
      			fillWithColor(i);
      			//DRAWING FORM
      			let randomX = random(-7,7);
      			let randomY = random(-7,7);
      			whichForm(randomX, randomY, x, y, i);		
    		}
  		}
  	}
}