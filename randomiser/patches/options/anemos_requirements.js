const textutil = require('../../game_logic/textutil.js');
const { setTalkObject } = require('../../../util/npcWriter');
const { writeArray } = require('../../../util/binary');

function apply(mapCode, text) {
    mapCode[1712][0] = true;

    // Disable unused event table entries for map 303
    mapCode[1712][1][0x3DF7] = 0x12;
    mapCode[1712][1][0x3E03] = 0x12;
    mapCode[1712][1][0x3E0F] = 0x12;
    mapCode[1712][1][0x3E1B] = 0x12;

    // Create new NPC table for map 303
    setTalkObject(mapCode[1712][1], 0x4454, 0x3DE4, 0x8, 0x1C2, 0xFFFF, 0x200, 0, 0xE4, 0, 1, 0x0200C485);
    writeArray(mapCode[1712][1], 0x446C, [0xFF, 0xFF, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 
        0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]);
    writeArray(mapCode[1712][1], 0x864, [0x54, 0xC4]);

    // Create custom interact function for the Djinn sign
    writeArray(mapCode[1712][1], 0x4484, [0x20, 0xB5, 0x6, 0x48, 0x0, 0x78, 0x5, 0x21, 0x0, 0xF0, 0xC, 0xF8, 0x4, 0x48, 0x0, 0xF0, 0xD, 0xF8, 0xE, 
        0x20, 0x0, 0x21, 0x0, 0xF0, 0xD, 0xF8, 0x20, 0xBD, 0x2, 0x79, 0x0, 0x9, 0x78, 0x15, 0x0, 0x0, 0x0, 0x4C, 0x20, 0x47, 0x21, 0x81, 0x3, 0x8, 
        0x0, 0x4C, 0x20, 0x47, 0x81, 0x81, 0xC, 0x8, 0x0, 0x4C, 0x20, 0x47, 0xA1, 0x81, 0xC, 0x8]);

    // Set text line for the Djinn sign
    textutil.writeLine(text, 0x1578, "\x16 Djinn are required\x03to open the door.\x02");

    // Update room init function to open the door automatically when the required number of Djinn is met
    writeArray(mapCode[1712][1], 0x1E94, [0xFE, 0xF7, 0x18, 0xFE]);
    writeArray(mapCode[1712][1], 0xAC8, [0xE0, 0xB5, 0xFF, 0xF7, 0xB5, 0xFA, 0x30, 0x25, 0x80, 0x26, 0x0, 0x27, 0x28, 0x0, 0x2, 0xF0, 0xEF, 0xFB, 0x3F, 
        0x18, 0x1, 0x35, 0xB5, 0x42, 0xF8, 0xD1, 0xB, 0x48, 0x0, 0x78, 0xB8, 0x42, 0x11, 0xDC, 0xA0, 0x20, 0x0, 0x1, 0x87, 0x30, 0x5, 0x0, 0x2, 0xF0, 
        0xE5, 0xFB, 0x68, 0x1C, 0x2, 0xF0, 0xE2, 0xFB, 0xA8, 0x1C, 0x2, 0xF0, 0xDF, 0xFB, 0xE8, 0x1C, 0x2, 0xF0, 0xDC, 0xFB, 0x28, 0x1D, 0x2, 0xF0, 0xD9, 
        0xFB, 0xE0, 0xBD, 0x2, 0x79, 0x0, 0x9]);
}

module.exports = {apply};