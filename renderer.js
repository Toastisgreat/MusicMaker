const { dialog } = require('electron').remote
const ipc = require('electron').ipcRenderer
const Vex = require('vexflow')
const Mousetrap = require('mousetrap');

//Global Variables
var keylist = {'z': 'a/4', 'x': 'b/4', 'c': 'c/4', 'v': 'd/4', 'b': 'e/4', 'n': 'f/4', 'm': 'g/4', 'a': 'a/5', 's': 'b/5', 'd': 'c/5', 'f': 'd/5', 'g': 'e/5', 'h': 'f/5', 'j': 'g/5', 'q': 'a/6', 'w': 'b/6', 'e': 'c/6', "r": 'd/6', 't': 'e/6', 'y': 'f/6', 'u': 'g/6', 'tab': ['q', 'qr', ], 'delete': 'delete', 'i': '#', 'o': 'b'}
var VF = Vex.Flow;
var notes = []
var chord = []
var duration = 0
var canvas = document.getElementById("myCanvas");
var renderer = new VF.Renderer(canvas, VF.Renderer.Backends.CANVAS);
//whole, half, quarter, eighth, sixteenth, thirtysecong
var times = ['w', 'h', 'q', '8', '16', '32']
var sharp = false
var flat = false
// Use the renderer to give the dimensions to the SVG

// Expose the context of the renderer
var context = renderer.getContext();

// And give some style to our SVG
context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");


/**
 * Creating a new stave
 */
// Create a stave of width 400 at position x10, y40 on the SVG.
console.log("made it this far")
var stave = new VF.Stave(10, 40, 400);
// Add a clef and time signature.
stave.addClef("treble").addTimeSignature("4/4");
// Set the context of the stave our previous exposed context and execute the method draw !
stave.setContext(context).draw();

//define the action based on the key that is pressed
function newnote (e) {
    // Send a message to know the function triggered
    console.log('triggered')
    // define new variable for a numerical value based on the key
    let code = (e.keyCode ? e.keyCode : e.which);
    VF = Vex.Flow
    //checks to see if the key is a shortcut, and isnt a special key
    if (e in keylist && code !== 13 && code !== 9 && code !== 73 && code !== 79 && code !== 8) { 
        let note = keylist[e]
        chord.push(note)
        flat = false
        sharp = false
    }
    //if the key is enter, then the chord is put no the staff and chord is cleared
    else if (code === 13) {
        if (sharp !== true && flat !== true) { notes.push(new VF.StaveNote({clef: "treble", keys: chord, duration: times[duration]}))}
        else if (sharp === true && flat !== true) {notes.push(new VF.StaveNote({clef: "treble", keys: chord, duration: times[duration]}).addAccidental(0, new VF.Accidental('#')))}
        else if (sharp !== true && flat === true) {notes.push(new VF.StaveNote({clef: "treble", keys: chord, duration: times[duration]}).addAccidental(0, new VF.Accidental('b')))}
        VF.Formatter.FormatAndDraw(context, stave, notes);
        chord = []
        flat = false
        sharp = false
    }
    //if the key is tab, switch the note type
    else if (code === 9) {
        if (duration < 5) { duration ++}
        else if (duration === 5) {duration = 0}
    }
    // if the key is o, switch flat value
    else if (code === 79) { 
        if (flat == true) { flat = false }
        else if (flat === false) { flat = true}
    }
    //if the key is i, switch sharp value
    else if (code === 73) {
        if (sharp === true) { sharp = false}
        else if (sharp === false) { sharp = true}
    }
    //if the key is delete, take the last note away
    else if (code === 8) {  notes.pop()}
    //if nothing else worked, dont do anything
    else { }
}

Mousetrap.bind('z', newnote)
Mousetrap.bind('x', newnote)
Mousetrap.bind('c', newnote)
Mousetrap.bind('v', newnote)
Mousetrap.bind('b', newnote)
Mousetrap.bind('n', newnote)
Mousetrap.bind('m', newnote)
Mousetrap.bind('a', newnote)
Mousetrap.bind('s', newnote)
Mousetrap.bind('d', newnote)
Mousetrap.bind('f', newnote)
Mousetrap.bind('g', newnote)
Mousetrap.bind('h', newnote)
Mousetrap.bind('j', newnote)
Mousetrap.bind('q', newnote)
Mousetrap.bind('w', newnote)
Mousetrap.bind('e', newnote)
Mousetrap.bind('r', newnote)
Mousetrap.bind('t', newnote)
Mousetrap.bind('y', newnote)
Mousetrap.bind('u', newnote)
Mousetrap.bind('enter', newnote)
Mousetrap.bind('tab', newnote)
Mousetrap.bind('i', newnote)
Mousetrap.bind('o', newnote)