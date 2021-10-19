import * as env from './environment.js';
import * as object from './object.js';

let click = false;

let canvas = new object.Canvas();

const map = []; // a non-redeclarable array of shapes (in this case just balls)

// as long as i remains under the configured amount, assign array position of i to a new object.Ball.
for (let i = map.length; i < env.amount; i++) {
  map[i] = new object.Ball(i == 0 ? 50 : undefined); // if the ball is the first object in the array, use diameter of 50, else use undefined.
}

console.log(map);

// let ballA = new object.Ball(50);
// let ballB = new object.Ball();

function setup() {
  canvas.create();
}

function draw() {

<<<<<<< HEAD
  canvas.fill();
=======
  canvas.fill(0, 0, 0.1, 1);
>>>>>>> 450d0e5 (add bouncing-ball & potential stylesheet)
  map.forEach(obj => {
    obj.render(canvas);
    interact(obj);
  });
}

function interact(obj) {
  let oldX = obj.x;
  let oldY = obj.y;
  if (dist(obj.x, obj.y, mouseX, mouseY) < obj.d / 2) {
    if (click) {
      obj.x = mouseX;
      obj.y = mouseY;
      obj.vX = mouseX - pmouseX;
      obj.vY = mouseY - pmouseY;
      // obj.g = 0;
    } else {
      obj.g = env.g / env.frameRate;
    }
  }
}

function mousePressed() { click = true; }

function mouseReleased() { click = false; }

// actually assign functions to active p5 functions
window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
window.mouseReleased = mouseReleased;