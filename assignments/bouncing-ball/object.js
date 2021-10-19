import * as env from "./environment.js";

export let click = false;

export class Canvas {
  constructor(w, h, f) {
    if (!w) { this.w = env.canvasWidth; } else { this.w = w; }
    if (!h) { this.h = env.canvasHeight; } else { this.h = h; } 
    if (!f) { this.f = env.frameRate; } else { this.f = f; }
  }

  create() {
    colorMode(HSL, 360, 1, 1, 1);
    createCanvas(this.w, this.h);
<<<<<<< HEAD
    this.fill();
    frameRate(this.f);
  }

  fill() {
    background(0, 0, 0.1, 1);
=======
    this.fill(0, 0, 0.1, 1);
    frameRate(this.f);
  }

  fill(h, s, l, a) {
    background(h, s, l, a);
>>>>>>> 450d0e5 (add bouncing-ball & potential stylesheet)
  }

  resize() {
    let w = document.documentElement.clientWidth;
    let h = document.documentElement.clientHeight;

    resizeCanvas(w, h);
  }
}

export class Ball {
  constructor(d, x, y, vX, vY, m, uuid) {
    if (!d) { this.d = (env.size + env.size * (env.sizeVariance * Math.random()) - env.sizeVariance) >> 1; } else { this.d = d; }
    if (!x) { this.x = this.d / 2 + (env.canvasWidth - this.d) * Math.random(); } else { this.x = x; }
    if (!y) { this.y = this.d / 2 + (env.canvasHeight - this.d) * Math.random(); } else { this.y = y; }
    if (!vX) { (this.vX = env.velocity * (env.veloVariance * Math.random() - env.veloVariance / 2) - env.velocity / 2) / env.frameRate; } else { this.vX = vX; }
    if (!vY) { (this.vY = env.velocity * (env.veloVariance * Math.random() - env.veloVariance / 2) - env.velocity / 2) / env.frameRate; } else { this.vY = vY; }
    if (!m) { this.m = this.d + this.d * Math.random(); } else { this.m = m; }
    if (!uuid) { this.uuid = Math.random().toString(36).substr(2, 9); } else { this.uuid = uuid; }
  }

  hue = Math.floor(Math.random() * 360);
  saturation = env.ballSaturation;
  lightness = env.ballLightness;
  alpha = env.ballOpacity;

  g = env.g / env.frameRate;

  translate(canvas) {
    
    if (this.y + this.d / 2 < canvas.h) {
      this.vY += this.g;
    }

    this.x += this.vX;
    this.y += this.vY;
  }

  collide(obj) {
    
    if (obj instanceof Canvas) {
      
      if ((this.x + this.d / 2 >= obj.w && this.vX >= 0) || (this.x - this.d / 2 < 0 && this.vX < 0)) {
        this.vX = -this.vX * env.b;
      }
      
      if ((this.y + this.d / 2 >= obj.h && this.vY >= 0) || (this.y - this.d / 2 < 0 && this.vY < 0)) {
        this.vY = -this.vY * env.b;
      }

    } else {
      
      // TODO object collision
    
    }
  }

  render(canvas) {
    colorMode(HSL, 360, 1, 1, 1);
    noStroke();
    fill(this.hue, this.saturation, this.lightness, this.alpha);

    ellipse(this.x, this.y, this.d);

    this.collide(canvas);
    this.translate(canvas);
  }

  nSqrt(n) {
    return n > 0 ? sqrt(Math.abs(n)) : -sqrt(Math.abs(n));
  }
}
