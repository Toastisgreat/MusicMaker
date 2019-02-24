const { dialog } = require('electron').remote
const ipc = require('electron').ipcRenderer
const Vex = require('vexflow')
const Mousetrap = require('mousetrap');

//Global Variables
var keylist = {'z': 'a/3', 'x': 'b/3', 'c': 'c/4', 'v': 'd/4', 'b': 'e/4', 'n': 'f/4', 'm': 'g/4', 'a': 'a/4', 's': 'b/4', 'd': 'c/5', 'f': 'd/5', 'g': 'e/5', 'h': 'f/5', 'j': 'g/5', 'q': 'a/5', 'w': 'b/5', 'e': 'c/6', "r": 'd/6', 't': 'e/6', 'y': 'f/6', 'u': 'g/6'}
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
var x_pos = 10
var y_pos = 40
var length = 200
var timeValues = {'w' : 4, 'h': 2, 'q': 1, '8': .5, '16': .25, '32': .125}
var beat = 0
// Use the renderer to give the dimensions to the SVG

// Expose the context of the renderer
var context = renderer.getContext();
// And give some style to our SVG
context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");


/**
 * Creating a new stave
 */
// Create a stave of width 400 at position x10, y40 on the SVG.
var stave = new VF.Stave(10, 40, 200);
// Add a clef and time signature.
stave.addClef("treble").addTimeSignature("4/4");
// Set the context of the stave our previous exposed context and execute the method draw !
stave.setContext(context).draw();

//define the action based on the key that is pressed
function newnote (e) {
    // define new variable for a numerical value based on the key
    let code = (e.keyCode ? e.keyCode : e.which);
    VF = Vex.Flow
    //checks to see if the key is a shortcut, and isnt a special key
    if (e.key in keylist && code !== 13 && code !== 9 && code !== 73 && code !== 79 && code !== 8) { 
        let note = keylist[e.key]
        chord.push(note)
        flat = false
        sharp = false
        console.log(chord)
    }
    //if the key is enter, then the chord is put no the staff and chord is cleared
    else if (code === 13) {
    
        //clears the current staff of notes to rewrite on
        
        //adds chord to note array
        if (sharp !== true && flat !== true) { notes.push(new VF.StaveNote({clef: "treble", keys: chord, duration: times[duration]}))}
        else if (sharp === true && flat !== true) {notes.push(new VF.StaveNote({clef: "treble", keys: chord, duration: times[duration]}).addAccidental(0, new VF.Accidental('#')))}
        else if (sharp !== true && flat === true) {notes.push(new VF.StaveNote({clef: "treble", keys: chord, duration: times[duration]}).addAccidental(0, new VF.Accidental('b')))}
        //puts note array on the staff, drawing the notes
        VF.Formatter.FormatAndDraw(context, stave, notes);
        //resets variables 
        chord = []
        flat = false
        sharp = false
        //adds to beat
        beat += timeValues[times[duration]]
        //if the measure is full, add a new measure to the end
        if (beat >= 4) {
            //if reached the end of the line, go to the next tile
            if (x_pos >= 810) {
                //TODO: fix bug where wont use last stave
                x_pos = 10
                y_pos += 80
                stave = new VF.Stave(x_pos, y_pos, length)
                stave.addClef("treble").addTimeSignature("4/4")
                stave.setContext(context).draw(); }
            //else: just add one to the end
            else {
                x_pos += 200
                stave = new VF.Stave(x_pos, y_pos, length)
                stave.setContext(context).draw(); }
            //clear beat count and notes
            beat = 0
            notes = [] 
            }
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
    else if (code === 8) {  notes.pop(); VF.Formatter.FormatAndDraw(context, stave, notes);}
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