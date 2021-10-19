/* Canvas */
export let canvasWidth      = window.innerWidth;
export let canvasHeight     = window.innerHeight;

export let frameRate        = 120;

/* Physics */
export let g = 98.1;                      // gravitational constant               (0 to disable)
export let b = 0.95;                       // bounciness / restituion coëfficient
export let d = 0;                         // drag / air restistance               (0 to disable)

/* Object */
export let amount           = 50;        // amount of initial balls
export let size             = 100;        // average size of initial balls
export let velocity         = 3;         // average velocity of initial balls

export let sizeVariance     = 3;          // variance in size of initial balls
export let veloVariance     = 10;         // variance in velocity of inital balls

/* Appearance */

export let ballSaturation   = 0.9;
export let ballLightness    = 0.75;
export let ballOpacity      = 0.3;