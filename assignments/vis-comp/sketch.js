// keyCodeStream (array containing previous 2 keys).
const modKeys = {
    values: [],

    /**
     * adds a provided key(Code) to the values[]
     * @param {int} key keyCode of pressed key to add to the values[]
     */
    add(key) {
        this.values.push(key);
        this.values.sort();
        console.debug(key + " added to modKeys.values[]");
    },

    /**
     * removes a provided key(Code) from the values[]
     * @param {int} key keyCode of pressed key to remove from the values[]
     */
    del(key) {
        this.values.indexOf(key) > -1
            ? this.values.splice(this.values.indexOf(key))
            : console.warn(key + " not found in modKeys.values[]!");
        console.debug(key + " removed from modKeys.values[]");
    }
};

// declarations

function setup() {
    // initializations before runtime
    note = new NoteBuilder().create();
}

function draw() {
    // runtime "loop", p5 calls this at a rate of framerate()
}

/**
 * gets called when a key is pressed down.
 * @param {Object} event the keydown event p5 passes along with the function
 */
function keyPressed(event) {
    console.debug("pressed:");
    console.debug(event);
    const keymap = Piano.keymap.notes;

    /*  
        adds up to 2 held-down modifier keys to the modKeys array 
        (useful for modifier key combinations, e.g. ctrl + shift + s)
    */
    switch (event.keyCode) {
        case CONTROL:
        case SHIFT:
            console.debug("modifier key pressed: " + event.keyCode);
            modKeys.add(event.keyCode);
        default:
            if (!modKeys.length) break; // if modifier keys are pressed, do not play the piano
            if (keymap.includes(event.key)) {
                console.debug(
                    "user pressed key " +
                        event.key +
                        ", which is included in the Piano keymap, at position " +
                        keymap.indexOf(event.key)
                );
            }
    }
}

/**
 * gets called when a key is released.
 * @param {Object} event the keydown event p5 passes along with the function
 */
function keyReleased(event) {
    console.debug("released:");
    console.debug(event);
    const keymap = Piano.keymap.notes;

    switch (event.keyCode) {
        case CONTROL:
        case SHIFT:
            console.debug("modifier key pressed: " + event.keyCode);
            modKeys.del(event.keyCode);
    }
}
