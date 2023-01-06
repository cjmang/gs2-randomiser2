const textutil = require('./../game_logic/textutil.js');

/**
 * Applies this patch to the map code
 * @param {MapCodeData} mapCode The map code data instance
 * @param {string[]} text The text data instance
 */
function apply(mapCode, text) {
    applyKandorean(mapCode[1619]);
    applyLemurianShip(mapCode[1622], mapCode[1623]);
    applyMadra(mapCode[1624], mapCode[1625]);
    applyGaroh(mapCode[1631]);
    applyAlhafra(mapCode[1640]);
    applyBriggs(mapCode[1641]);
    applyKibombo(mapCode[1648]);
    applyGabombaCatacombs(mapCode[1651]);
    applyEasternSeaIsles(mapCode[1652]);
    applyAquaRock(mapCode[1657], mapCode[1659]);
    applyIzumo(mapCode[1661]);
    applyGaiaRock(mapCode[1664], mapCode[1665]);
    applyJupiterAerie(mapCode[1701]);

    //Set text lines for battle prompts
    textutil.writeLine(text, 0x1B67, "Fight Briggs?\x1E");
    textutil.writeLine(text, 0x2ACD, "Fight Agatio and Karst?\x1E");

    //Set miscellaneous text lines
    textutil.writeLine(text, 0x2186, "You can't carry any more,\x03so the Mayor's reward was\x03placed in the nearby pot.\x02");
}

/**
 * Writes an array of bytes into the map code, overwriting existing data
 * @param {byte[]} mapCode The binary map code data
 * @param {number} offset The position to start writing at
 * @param {byte[]} data The data to write
 */
function applyMapCode(mapCode, offset, data) {
    for (var i = 0; i < data.length; ++i) {
        mapCode[offset++] = data[i];
    }
}

/**
 * Applies cutscene skip to Kandorean Temple
 * @param {MapCodeEntry} mapCode
 */
function applyKandorean(mapCode) {
    mapCode[0] = true;
    
    // ASM for skipping the Master Poi cutscene after taking the item
    applyMapCode(mapCode[1], 0x23E8, [0x20, 0xB5, 0x0, 0x20, 0x02, 0xF0, 0xC0, 0xFF, 0x80, 0x20, 0x80, 0x4, 0x5, 0x0, 0xCA, 0x21, 0x9, 
        0x2, 0xBB, 0x31, 0x89, 0x0, 0x40, 0x18, 0xE2, 0x21, 0x9, 0x2, 0xAC, 0x31, 0x6D, 0x18, 0x0, 0x28, 0x2, 0xD0, 0x3, 0x21, 0x2, 0xF0,
        0x8F, 0xFF, 0xC6, 0x20, 0x0, 0x21, 0x2, 0xF0, 0xDB, 0xFE, 0x28, 0x68, 0x0, 0x28, 0x1, 0xD0, 0x2, 0xF0, 0x92, 0xFE, 0xC, 0x20, 
        0x4, 0x21, 0x2, 0xF0, 0xE, 0xFF, 0x80, 0x20, 0x0, 0x1, 0x4A, 0x30, 0x2, 0xF0, 0x71, 0xFE, 0x20, 0xBD]);

    // ASM for skipping the cutscenes with Kraden outside
    applyMapCode(mapCode[1], 0x2336, [0x2, 0xB0, 0x0, 0xBD]);
    mapCode[1][0x6007] = 0x12;
}

/**
 * Applies cutscene skip to the Lemurian Ship (Indra beach)
 * @param {MapCodeEntry} intMapCode Map code entry for Lemurian Ship interior
 * @param {MapCodeEntry} extMapCode Map code entry for East Indra Shore (ship exterior)
 */
function applyLemurianShip(intMapCode, extMapCode) {
    intMapCode[0] = true;
    extMapCode[0] = true;

    //Changing flag trigger for Piers stopping you, to account for another scene being skipped
    extMapCode[1][0x242E] = 0x8E;

    //ASM for skipping the ship activation cutscene
    applyMapCode(intMapCode[1], 0x169C, [0x80, 0x20, 0x0, 0x1, 0xDE, 0x30, 0x1, 0xF0, 0x9D, 0xFA, 0xD1, 0xE0]);
    intMapCode[1][0x3379] = 0x70;
}

/**
 * Applies cutscene skip to Madra
 * @param {MapCodeEntry} extMapCode Map code entry for Madra exterior
 * @param {MapCodeEntry} intMapCode Map code entry for Madra interior
 */
function applyMadra(extMapCode, intMapCode) {
    extMapCode[0] = true;
    intMapCode[0] = true;

    //ASM for skipping the mushroom scenes
    applyMapCode(intMapCode[1], 0x102E, [0xD, 0xE0]);
    applyMapCode(intMapCode[1], 0x1090, [0xB0, 0xE0]);
    applyMapCode(intMapCode[1], 0x1202, [0x2, 0xE0]);
    applyMapCode(intMapCode[1], 0x1218, [0x17, 0xE0]);
    applyMapCode(intMapCode[1], 0x1258, [0x10, 0xE0]);
    applyMapCode(intMapCode[1], 0x1286, [0x31, 0xE0]);
    intMapCode[1][0x1252] = 0x19;

    //ASM for skipping Mayor scenes
    applyMapCode(extMapCode[1], 0x19E8, [0x21, 0x20, 0x0, 0x21, 0x0, 0x22, 0x1, 0xF0, 0xCB, 0xF8, 0x1, 0xF0, 0x21, 0xF9, 0x8C, 0x22, 
        0x4, 0x20, 0x96, 0x21, 0x52, 0x0, 0x1, 0xF0, 0xB3, 0xF8, 0x20, 0x20, 0x0, 0x2, 0xCD, 0x30, 0x1, 0xF0, 0xE2, 0xF8, 0x4A, 0xE1]);
    applyMapCode(extMapCode[1], 0x1D2C, [0x2C, 0xE0]);
    applyMapCode(extMapCode[1], 0x1D88, [0x0, 0x48, 0x0, 0x47, 0x8D, 0xA9, 0x0, 0x2]);
    extMapCode[1][0x7DD] = 0xD1;
    intMapCode[1][0x315F] = 0x19;
}

/**
 * Applies cutscene skip to Garoh
 * @param {MapCodeEntry} mapCode 
 */
function applyGaroh(mapCode) {
    mapCode[0] = true;

    //ASM for skipping the Master Maha daytime cutscene
    mapCode[1][0x389C] = 0x48;
    applyMapCode(mapCode[1], 0x38A2, [0x52, 0x4]);
    applyMapCode(mapCode[1], 0x38B4, [0x3, 0xE0]);
    applyMapCode(mapCode[1], 0x38DC, [0x26, 0xE0]);
    applyMapCode(mapCode[1], 0x3938, [0x32, 0xE0]);
    applyMapCode(mapCode[1], 0x39B0, [0x20, 0x20, 0x0, 0x3, 0xCA, 0x30, 0x0, 0x2, 0xB3, 0x30, 0x0, 0x47]);
    applyMapCode(mapCode[1], 0x4B7A, [0x18, 0xE1]);
    applyMapCode(mapCode[1], 0x4DF6, [0x80, 0xE1]);
}

/**
 * Applies cutscene skip to (Eastern) Alhafra
 * @param {MapCodeEntry} mapCode 
 */
function applyAlhafra(mapCode) {
    mapCode[0] = true;

    //ASM for skipping the mayor cutscene after Bursting the rock
    applyMapCode(mapCode[1], 0x205C, [0x90, 0x25, 0x2D, 0x1, 0x68, 0x1D, 0x2, 0xF0, 0xCF, 0xFC, 0xF, 0x35, 0x28, 0x1C, 0x2, 0xF0, 
        0xCB, 0xFC, 0x70, 0x35, 0x28, 0x1C, 0x2, 0xF0, 0xC7, 0xFC, 0x20, 0xBD]);
    applyMapCode(mapCode[1], 0x2A0A, [0xE0, 0xBD]);
}

/**
 * Applies cutscene skip to the Briggs battle in Alhafra
 * @param {MapCodeEntry} mapCode
 */
function applyBriggs(mapCode) {
    mapCode[0] = true;

    // ASM for skipping the Briggs pre-battle cutscene
    applyMapCode(mapCode[1], 0x4F4, [0x0, 0xB5, 0x0, 0x20, 0x2, 0xF0, 0xA2, 0xFE, 0x4, 0x20, 0x0, 0x21, 0x0, 0x22, 0x0, 0x23, 0x2, 0xF0,
        0xA8, 0xFE, 0x1B, 0x20, 0x0, 0x2, 0x67, 0x30, 0x5, 0x21, 0x2, 0xF0, 0xC6, 0xFE, 0x4, 0x20, 0x0, 0x21, 0x2, 0xF0, 0x12, 0xFE, 0x0,
        0x28, 0x6, 0xD0, 0x4, 0x20, 0x0, 0x21, 0x10, 0x22, 0x52, 0x42, 0x2, 0xF0, 0x96, 0xFE, 0xE, 0xE0, 0x80, 0x23, 0xDB, 0x2, 0x9,
        0x33, 0xDB, 0x1, 0xB, 0x33, 0x2, 0x22, 0x1A, 0x70, 0x63, 0x20, 0x63, 0x21, 0x2, 0xF0, 0x72, 0xFE, 0xA, 0x20, 0x1, 0x21, 0x2,
        0xF0, 0x6A, 0xFE, 0x0, 0xBD, 0x0, 0xBD]);

    // ASM for skipping the Briggs post-battle cutscene
    applyMapCode(mapCode[1], 0x292, [0xF5, 0x0, 0xF5, 0x0]);

    // Updates function table
    applyMapCode(mapCode[1], 0x32A4, [0x41, 0x80, 0x3]);
}

/**
 * Applies cutscene skip to the Kibombo cutscenes
 * @param {MapCodeEntry} mapCode 
 */
function applyKibombo(mapCode) {
    mapCode[0] = true;

    //ASM for skipping the cutscene where Piers joins
    applyMapCode(mapCode[1], 0x131A, [0x20, 0x4D, 0x99, 0x22, 0x12, 0x2, 0x28, 0x68, 0x1F, 0x49, 0x99, 0x32, 0x4, 0xF0, 0xD1, 0xFB, 0x99, 
        0x22, 0x12, 0x2, 0x1C, 0x49, 0x99, 0x32, 0x7, 0x20, 0x4, 0xF0, 0xCA, 0xFB, 0x15, 0x49, 0x7, 0x20, 0x4, 0xF0, 0xCA, 0xFB, 0x14, 0x49, 
        0x28, 0x68, 0x4, 0xF0, 0xCE, 0xFB, 0x28, 0x68, 0x0, 0x21, 0x0, 0x22, 0x4, 0xF0, 0x11, 0xFC, 0xCC, 0x21, 0xCC, 0x22, 0x9, 0x2, 0xD2, 
        0x1, 0x7, 0x20, 0xCC, 0x31, 0x66, 0x32, 0x4, 0xF0, 0xB4, 0xFB, 0xC, 0x49, 0x7, 0x20, 0x4, 0xF0, 0xBC, 0xFB, 0x80, 0x20, 0x0, 0x1, 0xF4, 
        0x30, 0x4, 0xF0, 0x4F, 0xFB, 0x90, 0x20, 0x0, 0x1, 0x2E, 0x30, 0x4, 0xF0, 0x4A, 0xFB, 0x7, 0x20, 0x1, 0x21, 0x4, 0xF0, 0x92, 0xFB, 0x4, 
        0xF0, 0x80, 0xFB, 0x20, 0xBD, 0x0, 0x0, 0xEC, 0xDE, 0x0, 0x2, 0x88, 0xDE, 0x0, 0x2, 0xE0, 0xDF, 0x0, 0x2, 0x54, 0x4, 0x0, 0x2, 0x33, 
        0x33, 0x1, 0x0]);
}

/**
 * Applies cutscene skip to the Gabomba Catacombs
 * @param {MapCodeEntry} mapCode 
 */
function applyGabombaCatacombs(mapCode) {
    mapCode[0] = true;

    // ASM for skipping the cutscene at the end of the catacombs
    applyMapCode(mapCode[1], 0xA02, [0x36, 0xE0]);
    applyMapCode(mapCode[1], 0xA96, [0x1, 0xE0]);
    applyMapCode(mapCode[1], 0xAF8, [0x24, 0xE1]);
    applyMapCode(mapCode[1], 0xD4E, [0xB, 0xE0]);
    mapCode[1][0xD68] = 0x14;
}

/** Applies cutscene skip to Aqua Rock (and Apojii Islands)
 * @param {MapCodeEntry} apojiiMapCode
 * @param {MapCodeEntry} rockMapCode
 */
function applyAquaRock(apojiiMapCode, rockMapCode) {
    apojiiMapCode[0] = true;
    rockMapCode[0] = true;

    // ASM for skipping the entrance unlock cutscene
    applyMapCode(apojiiMapCode[1], 0x9AA, [0x3E, 0xE0]);
    applyMapCode(apojiiMapCode[1], 0x2198, [0x9E, 0x50, 0xD0]);
    applyMapCode(rockMapCode[1], 0x16AA, [0x87, 0xE0]);
}

/**
 * Applies cutscene skip to the various Eastern Sea islands
 * @param {MapCodeEntry} mapCode 
 */
function applyEasternSeaIsles(mapCode) {
    mapCode[0] = true;
    
    // ASM for skipping the penguin cutscene
    applyMapCode(mapCode[1], 0x1E0C, [0x5C, 0xE0]);
    applyMapCode(mapCode[1], 0x1F02, [0x0, 0xE0]);
    applyMapCode(mapCode[1], 0x1F10, [0x0, 0xE0]);
    applyMapCode(mapCode[1], 0x1F28, [0x0, 0xE0]);

    // ASM for skipping the bird cutscene
    applyMapCode(mapCode[1], 0x5E0, [0x33, 0xE0]);
    applyMapCode(mapCode[1], 0x69C, [0x0, 0xE0]);

    // ASM for skipping the cow cutscene
    mapCode[1][0x729] = 0xD0;
    applyMapCode(mapCode[1], 0x72C, [0x14, 0xE0]);
    applyMapCode(mapCode[1], 0x760, [0x38, 0x68, 0x3, 0xF0, 0x8F, 0xFB, 0x80, 0x46, 0xA4, 0xE0]);
    applyMapCode(mapCode[1], 0x8F0, [0x15, 0xE0]);

    // ASM for skipping the dog cutscene
    applyMapCode(mapCode[1], 0xE74, [0x65, 0xE1]);
    applyMapCode(mapCode[1], 0x1150, [0x1B, 0xE0]);
    applyMapCode(mapCode[1], 0x1192, [0x0, 0xE0]);

    // ASM for skipping the turtle cutscenes
    applyMapCode(mapCode[1], 0x12AA, [0xEB, 0xE0]);
    applyMapCode(mapCode[1], 0x14B6, [0x0, 0x1C]);
    applyMapCode(mapCode[1], 0x150A, [0x14, 0x20, 0x2, 0xF0, 0xA6, 0xFC, 0x8D, 0xE1]);
    applyMapCode(mapCode[1], 0x18BC, [0xA2, 0xE0]);
    applyMapCode(mapCode[1], 0x1A0C, [0x0, 0xE0]);
    applyMapCode(mapCode[1], 0x1AA2, [0x7A, 0xE0]);
    applyMapCode(mapCode[1], 0x1BA2, [0x0, 0xE0]);
    applyMapCode(mapCode[1], 0x2848, [0x9C, 0x21, 0xDC, 0x22, 0xC0, 0x23, 0x49, 0x4, 0x52, 0x4, 0x1B, 0x2, 0x1, 0xF0, 
        0x46, 0xFB, 0x1E, 0xE0]);
    applyMapCode(mapCode[1], 0x28B4, [0x6A, 0xE0]);
    applyMapCode(mapCode[1], 0x29D4, [0x4C, 0x21, 0x2E, 0x22, 0xC0, 0x23, 0x12, 0x1, 0x6, 0x32, 0x49, 0x4, 0x12, 0x4, 
        0x1B, 0x2, 0x1, 0xF0, 0x7E, 0xFA, 0x1D, 0xE0]);
    applyMapCode(mapCode[1], 0x2A4C, [0x70, 0xE0]);
}

/**
 * Applies cutscene skip to Izumo (interior)
 * @param {MapCodeEntry} mapCode 
 */
function applyIzumo(mapCode) {
    mapCode[0] = true;

    // ASM for skipping the cutscene of giving Uzume the Dancing Idol
    applyMapCode(mapCode[1], 0x1E0A, [0x3A, 0xE0]);
    applyMapCode(mapCode[1], 0x1EF4, [0x50, 0xE0]);
    applyMapCode(mapCode[1], 0x1FBA, [0x14, 0xE0]);
}

/**
 * Applies cutscene skip to Gaia Rock
 * @param {MapCodeEntry} extMapCode 
 * @param {MapCodeEntry} intMapCode 
 */
function applyGaiaRock(extMapCode, intMapCode) {
    extMapCode[0] = true;
    intMapCode[0] = true;

    // ASM for skipping the exterior Susa cutscenes
    applyMapCode(extMapCode[1], 0x38C, [0xF, 0xE0]);
    applyMapCode(extMapCode[1], 0x8FA, [0x17, 0xE0]);

    // ASM for skipping the interior Susa cutscenes
    applyMapCode(intMapCode[1], 0x31A2, [0x6, 0xE0]);
    applyMapCode(intMapCode[1], 0x3770, [0xA, 0x20, 0x0, 0x21, 0x0, 0x22, 0x1, 0xF0, 0xA1, 0xFB, 0x1E, 0x23, 0x13, 0x22, 0x0, 
        0x93, 0x1, 0x92, 0x55, 0x20, 0x48, 0x21, 0x5, 0x22, 0x2, 0x23, 0x1, 0xF0, 0x3B, 0xFB, 0x1, 0xF0, 0xD, 0xFC, 0x1, 0xF0, 
        0x13, 0xFC, 0xA5, 0xE1]);
    intMapCode[1][0x373C] = 0x4;
    intMapCode[1][0x5F4F] = 0x19;
}

/**
 * Applies cutscene skip to the Jupiter Lighthouse aerie
 * @param {MapCodeEntry} mapCode
 */
function applyJupiterAerie(mapCode) {
    mapCode[0] = true;

    // ASM for skipping the Agatio & Karst battle cutscene
    applyMapCode(mapCode[1], 0x65C, [0x20, 0xB5, 0xA0, 0x20, 0x0, 0x1, 0x23, 0x30, 0x5, 0xF0, 0x62, 0xF8, 0x0, 0x28, 0x55, 0xD0, 0x0, 
        0x20, 0x5, 0xF0, 0x89, 0xF9, 0x4, 0x20, 0x0, 0x21, 0x0, 0x22, 0x5, 0xF0, 0x94, 0xF9, 0xAB, 0x20, 0x80, 0x1, 0x0D, 0x30, 0x5, 0x21, 
        0x5, 0xF0, 0xA2, 0xF8, 0x4, 0x20, 0x0, 0x21, 0x5, 0xF0, 0xCA, 0xF8, 0x0, 0x28, 0x0F, 0xD0, 0x80, 0x22, 0x51, 0x2, 0x12, 0x2, 0x4, 
        0x20, 0x5, 0xF0, 0xCA, 0xF8, 0x80, 0x21, 0x89, 0x0, 0x89, 0x1C, 0x9A, 0x22, 0x52, 0x0, 0x52, 0x1C, 0x4, 0x20, 0x5, 0xF0, 0xDD, 
        0xF8, 0x31, 0xE0, 0xA0, 0x20, 0x5, 0x1, 0x28, 0x0, 0x21, 0x30, 0x5, 0xF0, 0x3A, 0xF8, 0x8D, 0x20, 0x0, 0x1, 0x0F, 0x30, 0x5, 0xF0, 
        0x35, 0xF8, 0x28, 0x0, 0x25, 0x30, 0x5, 0xF0, 0x35, 0xF8, 0x80, 0x20, 0x45, 0x0, 0x28, 0x0, 0x61, 0x30, 0x5, 0xF0, 0x2F, 0xF8, 
        0x28, 0x0, 0x44, 0x30, 0x5, 0xF0, 0x2B, 0xF8, 0xFB, 0x25, 0x80, 0x20, 0x40, 0x2, 0x40, 0x19, 0x80, 0x22, 0x92, 0x4, 0x94, 0x21, 
        0xC9, 0x0, 0x89, 0x18, 0x8, 0x60, 0x2, 0x20, 0x15, 0x39, 0x8, 0x70, 0x28, 0x0, 0x5, 0x21, 0x5, 0xF0, 0x1E, 0xF9, 0x28, 0x0, 0x5, 
        0x21, 0x5, 0xF0, 0x1E, 0xF9, 0x0D, 0x20, 0x7, 0x21, 0x5, 0xF0, 0x12, 0xF9, 0x20, 0xBD]);
}

module.exports = {apply};

/**
 * @typedef {[boolean, byte[]]} MapCodeEntry
 * @typedef {Object.<string, MapCodeEntry>} MapCodeData
 */