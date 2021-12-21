/**
 * Note class including pitch, velocity & duration
 */
class Note {
    pitch = 60;
    velocity = 0.8;
    duration = 1000;

    constructor(pitch, velocity, duration) {
        this.pitch = pitch ? pitch : _throw("Note has no pitch");
        this.velocity = velocity ? velocity : _throw("Note has no no velocity");
        this.duration = duration ? duration : _throw("Note has no duration");
    }

    /* TODO
        functions
        visual stuff?
    */

    play() {}
}

/**
 * wrapper function for throwing in ternary operators
 * @param {string} message error message
 */
function _throw(message) {
    throw new Error(message);
}

/**
 * simple NoteBuilder, so people can use method chaining to
 * create notes in a more user-friendly manner.
 */
class NoteBuilder {
    pitch = 60;
    velocity = 0.8;
    duration = 1000;

    constructor(pitch, velocity, duration) {
        this.pitch = pitch ? pitch : this.pitch;
        this.velocity = velocity ? velocity : this.velocity;
        this.duration = duration ? duration : this.duration;
    }

    withPitch(pitch) {
        this.pitch = pitch;
        return this;
    }

    withVelocity(velocity) {
        this.velocity = velocity;
        return this;
    }

    withDuration(duraction) {
        this.duration = duration;
        return this;
    }

    create() {
        return new Note(this.pitch, this.velocity, this.duration);
    }
}
