define(['jquery'], function($) {
        var notes = {
            'C0': 16.35,
            'C#0': 17.32,
            'Db0': 17.32,
            'D0': 18.35,
            'D#0': 19.45,
            'Eb0': 19.45,
            'E0': 20.60,
            'F0': 21.83,
            'F#0': 23.12,
            'Gb0': 23.12,
            'G0': 24.50,
            'G#0': 25.96,
            'Ab0': 25.96,
            'A0': 27.50,
            'A#0': 29.14,
            'Bb0': 29.14,
            'B0': 30.87,
            'C1': 32.70,
            'C#1': 34.65,
            'Db1': 34.65,
            'D1': 36.71,
            'D#1': 38.89,
            'Eb1': 38.89,
            'E1': 41.20,
            'F1': 43.65,
            'F#1': 46.25,
            'Gb1': 46.25,
            'G1': 49.00,
            'G#1': 51.91,
            'Ab1': 51.91,
            'A1': 55.00,
            'A#1': 58.27,
            'Bb1': 58.27,
            'B1': 61.74,
            'C2': 65.41,
            'C#2': 69.30,
            'Db2': 69.30,
            'D2': 73.42,
            'D#2': 77.78,
            'Eb2': 77.78,
            'E2': 82.41,
            'F2': 87.31,
            'F#2': 92.50,
            'Gb2': 92.50,
            'G2': 98.00,
            'G#2': 103.83,
            'Ab2': 103.83,
            'A2': 110.00,
            'A#2': 116.54,
            'Bb2': 116.54,
            'B2': 123.47,
            'C3': 130.81,
            'C#3': 138.59,
            'Db3': 138.59,
            'D3': 146.83,
            'D#3': 155.56,
            'Eb3': 155.56,
            'E3': 164.81, // start tabs here
            'F3': 174.61,
            'F#3': 185.00,
            'Gb3': 185.00,
            'G3': 196.00,
            'G#3': 207.65,
            'Ab3': 207.65,
            'A3': 220.00,
            'A#3': 233.08,
            'Bb3': 233.08,
            'B3': 246.94,
            'C4': 261.63,
            'C#4': 277.18,
            'Db4': 277.18,
            'D4': 293.66,
            'D#4': 311.13,
            'Eb4': 311.13,
            'E4': 329.63,
            'F4': 349.23,
            'F#4': 369.99,
            'Gb4': 369.99,
            'G4': 392.00,
            'G#4': 415.30,
            'Ab4': 415.30,
            'A4': 440.00,
            'A#4': 466.16,
            'Bb4': 466.16,
            'B4': 493.88,
            'C5': 523.25,
            'C#5': 554.37,
            'Db5': 554.37,
            'D5': 587.33,
            'D#5': 622.25,
            'Eb5': 622.25,
            'E5': 659.26,
            'F5': 698.46,
            'F#5': 739.99,
            'Gb5': 739.99,
            'G5': 783.99,
            'G#5': 830.61,
            'Ab5': 830.61,
            'A5': 880.00,
            'A#5': 932.33,
            'Bb5': 932.33,
            'B5': 987.77,
            'C6': 1046.50,
            'C#6': 1108.73,
            'Db6': 1108.73,
            'D6': 1174.66,
            'D#6': 1244.51,
            'Eb6': 1244.51,
            'E6': 1318.51,
            'F6': 1396.91,
            'F#6': 1479.98,
            'Gb6': 1479.98,
            'G6': 1567.98,
            'G#6': 1661.22,
            'Ab6': 1661.22,
            'A6': 1760.00,
            'A#6': 1864.66,
            'Bb6': 1864.66,
            'B6': 1975.53,
            'C7': 2093.00,
            'C#7': 2217.46,
            'Db7': 2217.46,
            'D7': 2349.32,
            'D#7': 2489.02,
            'Eb7': 2489.02,
            'E7': 2637.02,
            'F7': 2793.83,
            'F#7': 2959.96,
            'Gb7': 2959.96,
            'G7': 3135.96,
            'G#7': 3322.44,
            'Ab7': 3322.44,
            'A7': 3520.00,
            'A#7': 3729.31,
            'Bb7': 3729.31,
            'B7': 3951.07,
            'C8': 4186.01
        };
        var tabNotes = {
            // e string
            '0:0' : notes['E2'],
            '0:1' : notes['F2'],
            '0:2' : notes['F#2'],
            '0:3' : notes['G2'],
            '0:4' : notes['G#2'],
            '0:5' : notes['A2'],
            '0:6' : notes['A#2'],
            '0:7' : notes['B2'],
            '0:8' : notes['C3'],
            '0:9' : notes['C#3'],
            '0:10' : notes['D3'],
            '0:11' : notes['D#3'],
            '0:12' : notes['E3'],
            '0:13' : notes['F3'],
            '0:14' : notes['F#3'],
            '0:15' : notes['G3'],
            '0:16' : notes['G#3'],
            '0:17' : notes['A3'],
            '0:18' : notes['A#3'],
            '0:19' : notes['B3'],
            '0:20' : notes['C4'],
            '0:21' : notes['C#4'],
            '0:22' : notes['D4'],
            '0:23' : notes['D#4'],
            '0:24' : notes['E4'],
            '0:25' : notes['F4'],
            '0:26' : notes['F#4'],
            '0:27' : notes['G4'],

            // a string
            '1:0' :  notes['A2'],
            '1:1' :  notes['A#2'],
            '1:2' :  notes['B2'],
            '1:3' :  notes['C3'],
            '1:4' :  notes['C#3'],
            '1:5' :  notes['D3'],
            '1:6' :  notes['D#3'],
            '1:7' :  notes['E3'],
            '1:8' :  notes['F3'],
            '1:9' :  notes['F#3'],
            '1:10' : notes['G3'],
            '1:11' : notes['G#3'],
            '1:12' : notes['A3'],
            '1:13' : notes['A#3'],
            '1:14' : notes['B3'],
            '1:15' : notes['C4'],
            '1:16' : notes['C#4'],
            '1:17' : notes['D4'],
            '1:18' : notes['D#4'],
            '1:19' : notes['E4'],
            '1:20' : notes['F4'],
            '1:21' : notes['F#4'],
            '1:22' : notes['G4'],
            '1:23' : notes['G#4'],
            '1:24' : notes['A4'],
            '1:25' : notes['A#4'],
            '1:26' : notes['B4'],
            '1:27' : notes['C5'],

            // D string
            '2:0' :  notes['D3'],
            '2:1' :  notes['D#3'],
            '2:2' :  notes['E3'],
            '2:3' :  notes['F3'],
            '2:4' :  notes['F#3'],
            '2:5' :  notes['G3'],
            '2:6' :  notes['G#3'],
            '2:7' :  notes['A3'],
            '2:8' :  notes['A#3'],
            '2:9' :  notes['B3'],
            '2:10' : notes['C4'],
            '2:11' : notes['C#4'],
            '2:12' : notes['D4'],
            '2:13' : notes['D#4'],
            '2:14' : notes['E4'],
            '2:15' : notes['F4'],
            '2:16' : notes['F#4'],
            '2:17' : notes['G4'],
            '2:18' : notes['G#4'],
            '2:19' : notes['A4'],
            '2:20' : notes['A#4'],
            '2:21' : notes['B'],
            '2:22' : notes['C5'],
            '2:23' : notes['C#5'],
            '2:24' : notes['D5'],
            '2:25' : notes['D#5'],
            '2:26' : notes['E'],
            '2:27' : notes['F5'],

            // G string
            '3:0' :  notes['G3'],
            '3:1' :  notes['G#3'],
            '3:2' :  notes['A3'],
            '3:3' :  notes['A#3'],
            '3:4' :  notes['B3'],
            '3:5' :  notes['C4'],
            '3:6' :  notes['C#4'],
            '3:7' :  notes['D4'],
            '3:8' :  notes['D#4'],
            '3:9' :  notes['E4'],
            '3:10' : notes['F4'],
            '3:11' : notes['F#4'],
            '3:12' : notes['G4'],
            '3:13' : notes['G#4'],
            '3:14' : notes['A4'],
            '3:15' : notes['A#4'],
            '3:16' : notes['B4'],
            '3:17' : notes['C5'],
            '3:18' : notes['C#5'],
            '3:19' : notes['D5'],
            '3:20' : notes['D#5'],
            '3:21' : notes['E5'],
            '3:22' : notes['F5'],
            '3:23' : notes['F#5'],
            '3:24' : notes['G5'],
            '3:25' : notes['G#5'],
            '3:26' : notes['A5'],
            '3:27' : notes['A#5'],

            // H string
            '4:0' : notes['B3'],
            '4:1' : notes['C4'],
            '4:2' : notes['C#4'],
            '4:3' : notes['D4'],
            '4:4' : notes['D#4'],
            '4:5' : notes['E4'],
            '4:6' : notes['F4'],
            '4:7' : notes['F#4'],
            '4:8' : notes['G4'],
            '4:9' : notes['G#4'],
            '4:10': notes['A4'],
            '4:11': notes['A#4'],
            '4:12': notes['B4'],
            '4:13': notes['C5'],
            '4:14': notes['C#5'],
            '4:15': notes['D5'],
            '4:16': notes['D#5'],
            '4:17': notes['E5'],
            '4:18': notes['F5'],
            '4:19': notes['F#5'],
            '4:20': notes['G5'],
            '4:21': notes['G#5'],
            '4:22': notes['A5'],
            '4:23': notes['A#5'],
            '4:24': notes['B5'],
            '4:25': notes['C6'],
            '4:26': notes['C#6'],
            '4:27': notes['D6'],

            // E string
            '5:0' : notes['E4'],
            '5:1' : notes['F4'],
            '5:2' : notes['F#4'],
            '5:3' : notes['G4'],
            '5:4' : notes['G#4'],
            '5:5' : notes['A4'],
            '5:6' : notes['A#4'],
            '5:7' : notes['B4'],
            '5:8' : notes['C5'],
            '5:9' : notes['C#5'],
            '5:10': notes['D5'],
            '5:11': notes['D#5'],
            '5:12': notes['E5'],
            '5:13': notes['F5'],
            '5:14': notes['F#5'],
            '5:15': notes['G5'],
            '5:16': notes['G#5'],
            '5:17': notes['A5'],
            '5:18': notes['A#5'],
            '5:19': notes['B5'],
            '5:20': notes['C6'],
            '5:21': notes['C#6'],
            '5:22': notes['D6'],
            '5:23': notes['D#6'],
            '5:24': notes['E6'],
            '5:25': notes['F6'],
            '5:26': notes['F#6'],
            '5:27': notes['G6']
        };

    return {

        pushNote : function (note, arrNotes) {
            // only save one note for now
            var frqs = [];
            Object.keys(note.stringz).forEach(function(s) {
                var tone = note.stringz[s];
                if ( tone === 'r' ) {
                    frqs.push(0);
                } else {
                    frqs.push(tabNotes[s + ':' + tone]);
                }
            }.bind(this));

            arrNotes.push({
                notelength : parseFloat(note.rest, 10),
                frqs : frqs
            });
        },

        playAll : function (bpm, arrNotes) {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            var ctx = new AudioContext();
            var o, t = ctx.currentTime,
            arrayLength = arrNotes.length,
            currNote = {},
            playlength = bpm; //, bpm = parseInt(that.$("#bpm").val());
            for (var i = 0; i < arrayLength; i++) {
                currNote = arrNotes[i];
                playlength = 1/(bpm/60) * currNote.notelength;

                currNote.frqs.forEach(function(frq) {
                    o = ctx.createOscillator();
                    // 1 second divided by number of beats per second times number of beats (length of a note)

                    o.type = 'square';//this.$("#waveType").val();
                    o.frequency.value = frq;
                    o.start(t);
                    o.stop(t + playlength);
                    o.connect(ctx.destination);
                });
                t += playlength;
            }
        },

        playTabs : function (tabs) {
            var arrNotes = [];
            tabs.tabs.forEach(function(t) {
                this.pushNote(t, arrNotes);
            }.bind(this));
            this.playAll(tabs.tempo, arrNotes);
        }
    };
});


/*

playNote : function (e) {
var frq = notes[e.currentTarget.id], o = ctx.createOscillator(), g = ctx.createGain(),
bpm = parseInt($("#bpm").val()), notelength = parseFloat($("#noteLength").val()), playlength = 0;
// $(e.currentTarget).attr("fill","yellow");
o.type = $("#waveType").val();

// 1 second divided by number of beats per second times number of beats (length of a note)
playlength = 1/(bpm/60) * notelength;

if (frq) {
// $("#note").val(e.currentTarget.id);
o.frequency.value = frq;
o.start(ctx.currentTime);
o.stop(ctx.currentTime + playlength);

g.gain.value = 1;
o.connect(g);
g.connect(ctx.destination);
}
},

startNote : function (e, note) {
//this.playNote(e);
var frq = notes[e.currentTarget.id], thisNote = {}, notelength = parseFloat(that.$("#noteLength").val());
$(e.currentTarget).attr("fill","yellow");

if (frq) {
thisNote.notelength = notelength;
thisNote.frq = frq;
thisNote.noteLength = that.$("#noteLength option:selected").text();
$("#tblNotes tbody").append("<tr><td>"+e.currentTarget.id+"</td><td>"+thisNote.noteLength+"</td></tr>");
this.arrNotes.push(thisNote);
}
},

// pushNote : function (note) {
//   // only save one note for now
//   var frqs = [];
//   Object.keys(note.stringz).forEach(function(s) {
//     var tone = note.stringz[s];
//     if ( tone === 'r' ) {
//         frqs.push(0);
//     } else {
//         frqs.push(this.tabNotes[s + ':' + tone]);
//     }
//   }.bind(this));
//
//   this.arrNotes.push({
//     notelength : parseFloat(note.rest, 10),
//     frqs : frqs
//   });
// },

stopNote : function (e) {
$(e.currentTarget).attr("fill", "inherit");
that.$("#note").val("");
},

// playAll : function (e, bpm) {
//   window.AudioContext = window.AudioContext || window.webkitAudioContext;
//   var ctx = new AudioContext();
//     var o, t = ctx.currentTime,
//         arrayLength = this.arrNotes.length,
//         currNote = {},
//         playlength = bpm; //, bpm = parseInt(that.$("#bpm").val());
//
//     for (var i = 0; i < arrayLength; i++) {
//         currNote = this.arrNotes[i];
//         playlength = 1/(bpm/60) * currNote.notelength;
//
//         currNote.frqs.forEach(function(frq) {
//             o = ctx.createOscillator();
//             // 1 second divided by number of beats per second times number of beats (length of a note)
//
//             o.type = 'square';//this.$("#waveType").val();
//             o.frequency.value = frq;
//             o.start(t);
//             o.stop(t + playlength);
//             o.connect(ctx.destination);
//         });
//         t += playlength;
//     }
// },

__playTabsClicked : function () {
// reset array of notes
//this.arrNotes.length = 0;
//var tabs = this.tabsView.getTabs();
//   tabs.tabs.forEach(function(t) {
//     this.pushNote(t);
//   }.bind(this));
//   this.playAll(null, tabs.tempo);

// call tabGenerator.playTabs
},
*/
