const fs = require("fs");

var globalTreasure = [];
var globalDjinn = [];
var globalFlags = [];

function loadLocation(file, name) {
    console.log("Loading location data for " + name);
    var data = require("./locations/" + file);
    var accessReq = data.Access;
    
    data.Treasure.forEach((e) => {
        var reqs = [];
        e.Reqs.forEach((ereq) => {
            accessReq.forEach((areq) => {
                reqs.push(ereq.concat(areq));
            });
            if (accessReq.length == 0) reqs.push(ereq);
        });
        if (e.Reqs.length == 0) reqs = accessReq;
        e.Reqs = reqs;
        e.Origin = name;
        globalTreasure.push(e);
    });

    data.Djinn.forEach((e) => {
        var reqs = [];
        e.Reqs.forEach((ereq) => {
            accessReq.forEach((areq) => {
                reqs.push(ereq.concat(areq));
            });
            if (accessReq.length == 0) reqs.push(ereq);
        });
        if (e.Reqs.length == 0) reqs = accessReq;
        e.Reqs = reqs;
        e.Origin = name;
        globalDjinn.push(e);
    });

    data.Special.forEach((e) => {
        var reqs = [];
        e.Reqs.forEach((ereq) => {
            accessReq.forEach((areq) => {
                reqs.push(ereq.concat(areq));
            });
            if (accessReq.length == 0) reqs.push(ereq);
        });
        if (e.Reqs.length == 0) reqs = accessReq;
        e.Reqs = reqs;
        globalFlags.push(e);
    });
}

function initialise() {
    var start = Date.now();
    console.log();

    loadLocation("Overworld.json", "Overworld");
    loadLocation("AirsRock.json", "Air's Rock");
    loadLocation("Alhafra.json", "Alhafra");
    loadLocation("AlhafranCave.json", "Alhafran Cave");
    loadLocation("AnemosInnerSanctum.json", "Anemos Inner Sanctum");
    loadLocation("AngaraCavern.json", "Angara Cavern");
    loadLocation("AnkohlRuins.json", "Ankohl Ruins");
    loadLocation("ApojiiIslands.json", "Apojii Islands");
    loadLocation("AquaRock.json", "Aqua Rock");
    loadLocation("AttekaCavern.json", "Atteka Cavern");
    loadLocation("AttekaInlet.json", "Atteka Inlet");
    loadLocation("Champa.json", "Champa"),
    loadLocation("Contigo.json", "Contigo");
    loadLocation("Daila.json", "Daila");
    loadLocation("DehkanPlateau.json", "Dehkan Plateau");
    loadLocation("ETundariaIslet.json", "E Tundaria Islet");
    loadLocation("GabombaCatacombs.json", "Gabomba Catacombs");
    loadLocation("GabombaStatue.json", "Gabomba Statue");
    loadLocation("GaiaRock.json", "Gaia Rock");
    loadLocation("Garoh.json", "Garoh");
    loadLocation("GondowanCliffs.json", "Gondowan Cliffs");
    loadLocation("GondowanSettlement.json", "Gondowan Settlement");
    loadLocation("HesperiaSettlement.json", "Hesperia Settlement");
    loadLocation("Idejima.json", "Idejima");
    loadLocation("IndraCavern.json", "Indra Cavern");
    loadLocation("IsletCave.json", "Islet Cave");
    loadLocation("Izumo.json", "Izumo");
    loadLocation("JupiterLighthouse.json", "Jupiter Lighthouse");
    loadLocation("KaltIsland.json", "Kalt Island");
    loadLocation("KandoreanTemple.json", "Kandorean Temple");
    loadLocation("Kibombo.json", "Kibombo");
    loadLocation("KibomboMountains.json", "Kibombo Mountains");
    loadLocation("Lemuria.json", "Lemuria");
    loadLocation("LemurianShip.json", "Lemurian Ship");
    loadLocation("Loho.json", "Loho");
    loadLocation("Madra.json", "Madra");
    loadLocation("MadraCatacombs.json", "Madra Catacombs");
    loadLocation("MagmaRock.json", "Magma Rock");
    loadLocation("MarsLighthouse.json", "Mars Lighthouse");
    loadLocation("Mikasalla.json", "Mikasalla");
    loadLocation("Naribwe.json", "Naribwe");
    loadLocation("NOseniaIslet.json", "N Osenia Islet");
    loadLocation("OseniaCavern.json", "Osenia Cavern");
    loadLocation("OseniaCliffs.json", "Osenia Cliffs");
    loadLocation("Prox.json", "Prox");
    loadLocation("SeaGodShrine.json", "Shrine of the Sea God");
    loadLocation("SEAngaraIslet.json", "SE Angara Islet");
    loadLocation("SeaOfTime.json", "Sea of Time");
    loadLocation("SeaOfTimeIslet.json", "Sea of Time Islet");
    loadLocation("ShamanVillage.json", "Shaman Village");
    loadLocation("ShamanVillageCave.json", "Shaman Village Cave");
    loadLocation("SWAttekaIslet.json", "SW Atteka Islet");
    loadLocation("TaopoSwamp.json", "Taopo Swamp");
    loadLocation("TreasureIsle.json", "Treasure Isle");
    loadLocation("TundariaTower.json", "Tundaria Tower");
    loadLocation("WIndraIslet.json", "W Indra Islet");
    loadLocation("Yallam.json", "Yallam");
    loadLocation("YampiDesert.json", "Yampi Desert");
    loadLocation("YampiDesertCave.json", "Yampi Desert Cave");

    var time = Date.now() - start;
    console.log("Finished loading location data in " + time + "ms\n");
}

function clone() {
    return [JSON.parse(JSON.stringify(globalTreasure)),
        JSON.parse(JSON.stringify(globalDjinn)),
        JSON.parse(JSON.stringify(globalFlags))];
}

function isAccessible(location, progressFlags) {
    if (location.Reqs.length == 0) return true;

    var result = false;
    location.Reqs.forEach((reqList) => {
        var accessible = true;
        reqList.forEach((req) => {
            if (req.startsWith("AnyDjinn_") && location.Type == "Boss" && progressFlags.includes("NoBossLogic"))
                return;
            if (!progressFlags.includes(req))
                accessible = false;
        });
        if (accessible) {
            result = true;
        }
    });
    return result;
}

function getAccessibleItems(instance, progressFlags) {
    var djinnNum = 0;
    for (var i = progressFlags.length - 1; i >= 0; --i) {
        if (progressFlags[i].startsWith('AnyDjinn_')) {
            djinnNum = Number(progressFlags[i].substring(9));
            break;
        }
    }

    var charNum = 0;
    for (var i = progressFlags.length - 1; i >= 0; --i) {
        if (['Isaac', 'Garet', 'Ivan', 'Mia', 'Jenna', 'Sheba', 'Piers'].includes(progressFlags[i])) {
            ++charNum;
        }
        if (progressFlags[i].startsWith('PC_')) {
            var lastPcNum = Number(progressFlags[i].substring(3));
            charNum += lastPcNum;
            while (charNum > lastPcNum) {
                progressFlags.push('PC_' + ++lastPcNum);
            }
            break;
        }
    }
    if (charNum == 0) {
        progressFlags.push('PC_1');
    }

    var updated = true;
    while (updated) {
        updated = false;

        instance[2].forEach((f) => {
            if ((!progressFlags.includes(f.Name)) && isAccessible(f, progressFlags)) {
                updated = true;
                progressFlags.push(f.Name);
            }
        });

        instance[1].forEach((d) => {
            if ((!progressFlags.includes(d.Addr)) && isAccessible(d, progressFlags)) {
                updated = true;
                progressFlags.push(d.Addr);
                progressFlags.push('AnyDjinn_' + ++djinnNum);
            }
        });
    }

    var slots = [];
    instance[0].forEach((t) => {
        if (isAccessible(t, progressFlags)) slots.push(t.Addr);
    });
    return slots;
}

function markLocationMapNames(itemLocations) {
    globalTreasure.forEach((treasure) => {
        itemLocations[treasure.Addr].forEach((loc) => {
            loc['mapName'] = treasure.Origin;
        });
    });
}

function prepCharacterShuffleLocations(locations, itemLocations) {
    const itemMapping = {
        '0x2': 'Sheba', '0x3': 'Sheba', '0x101': 'Mia', '0x102': 'Ivan', '0x103': 'Garet', '0x104': 'Isaac', '0x105': 'Piers', '0x106': 'Piers'
    };
    const djinnMapping = {
        '0x30': 'PC_4', '0x31': 'PC_5', '0x32': 'PC_6', '0x33': 'PC_7', '0x34': 'PC_7', '0x35': 'PC_8', '0x44': 'PC_5', '0x45': 'PC_6', '0x46': 'PC_6',
        '0x47': 'PC_7', '0x48': 'PC_7', '0x49': 'PC_8', '0x4d': 'PC_3', '0x4e': 'PC_3', '0x58': 'PC_4', '0x59': 'PC_5', '0x5a': 'PC_6', '0x5b': 'PC_7',
        '0x5c': 'PC_8', '0x5d': 'PC_8', '0x6c': 'PC_4', '0x6d': 'PC_5', '0x6e': 'PC_6', '0x6f': 'PC_7', '0x70': 'PC_8', '0x71': 'PC_8'
    };
    const bossMapping = {
        'Boss_AquaHydra': 'PC_3', 'Boss_Serpent': 'PC_3', 'Boss_Avimander': 'PC_3', 'Boss_Poseidon': 'PC_4', 'Boss_Moapa': 'PC_4',
        'Boss_FlameDragons': 'PC_4', 'Boss_Parents': 'PC_4', 'Boss_StarMagician': 'PC_8', 'Boss_Sentinel': 'PC_8', 'Boss_Valukar': 'PC_8',
        'Boss_Dullahan': 'PC_8'
    };
    
    locations[0].filter((loc) => Object.keys(itemMapping).includes(loc.Addr)).forEach((loc) => {
        loc.Origin = itemMapping[loc.Addr];
        loc.Reqs = [[loc.Origin]];
        itemLocations[loc.Addr].forEach((t) => t['mapName'] = loc.Origin);
    });
    locations[1].filter((loc) => Object.keys(djinnMapping).includes(loc.Addr)).forEach((loc) => {
        loc.Origin = '???';
        loc.Reqs = [[djinnMapping[loc.Addr]]];
    });
    locations[2].filter((loc) => Object.keys(bossMapping).includes(loc.Name)).forEach((loc) => {
        loc.Reqs.forEach((req) => req.push(bossMapping[loc.Name]));
    });
}

initialise();

module.exports = {clone, getAccessibleItems, markLocationMapNames, prepCharacterShuffleLocations};