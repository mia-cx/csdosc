
// Environment
const fps               = 288         // framerate
const backgroundColor   = '#1e1e1e';  // background color in hex
const canvasSize        = 'window'    // canvas size, must be "window" or [width,height]

let steps               = 6;          // amount of steps per track
let tracks              = 1;          // amount of tracks in the sequencer
let samples             = ["kick","hat","snare","cowbell","snap"];  // list of sound files in the samples directory

// Objects

// Settings
class Settings {
  constructor(parent) {
    this.parent = parent;

    this.button = createButton(this.parent.name);
    console.log(this.parent.obj.position);
    this.button.position(this.parent.obj.position() + 8, this.parent.obj.position() + 8);
    console.log(this.button.position());
  }
}

// Canvas
class Canvas {
  constructor(options) {
    let defaults = {
      width: windowWidth,
      height: windowHeight,
      color: color("#1e1e1e"),
      label: "canvas"
    }

    this.options = Object.assign(defaults,options);
    this.obj = createCanvas(this.options.width, this.options.height);
    this.sequencer = new Sequencer(this);

  }
  
}

// Sequencer
class Sequencer {
  constructor(parent) {
    let defaultOptions = {
      parent: parent,
      tempo: 100,
      tracks: 1
    }

    this.options = Object.assign(defaultOptions,parent);
    this.obj = createGraphics(100,100);

    for (let i; i < this.options.tracks; i++) {
      this.tracks[i] = new Track();
    }

    console.log(this.obj);

  }
}

// Sequencer Track
class Track {

}

// Sequencer Step
class Step {

}

let canvas;

function setup() {

  canvas = new Canvas();
  frameRate(fps);

}

function draw() {

}



function mousePressed() {

}

function windowResized() {
  
  if (canvas.resizing) {
    canvas.obj.size(windowWidth, windowHeight);
    // resizeCanvas(windowWidth, windowHeight);
    // canvas.settings.move();
  }

}