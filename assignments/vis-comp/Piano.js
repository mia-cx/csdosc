class Piano {
    static offset = 60;

    static keymap = {
        notes: "AWSEDFTGYHUJKOLP;['".toLowerCase().split(""),
        offsetBy: 12,
        offset: ["z", "x"]
        // velocity: ['c', 'v'] // TODO maybe add this?
    };

    /* TODO
        constructor 
        visualizer
        modeselector
    */

    play(note) {
        // show which note is being played
    }
}
