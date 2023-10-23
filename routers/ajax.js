const express = require('express');
const fs = require('fs');
const nodePackage = require('./../package.json');
const config = require('./../modules/config.js');

const router = express.Router();

const versionSuffix = nodePackage.version.replace(/\./g, '_');
const allowedPermaChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";


// Initialise randomiser
const randomiser = require('./../randomiser/randomiser.js');
console.log("Randomiser initialised\n");


/**
 * Parses the encoded randomiser settings sent by the client
 * @param {string} str 
 * @returns {number[]}
 */
function parseSettings(str) {
    var array = new Uint8Array(11);
    str = str.padEnd(array.length * 2, '0');

    for (var i = 0; i < array.length; ++i) {
        var byte = str.slice(0, 2);
        array[i] = parseInt(byte, 16);
        str = str.slice(2);
    }

    return array;
}

/**
 * Creates a random permalink filename
 * @returns {string}
 */
function generatePermalink() {
    while (true) {
        var link = "";
        while (link.length < 12) {
            var i = Math.floor(Math.random() * allowedPermaChars.length);
            link += allowedPermaChars[i];
        }
        
        if (!fs.existsSync(`./permalinks/${link}.meta`))
            return link;
    }
}

//==================================================
// AJAX endpoint for randomising a normal seed
//==================================================
router.get('/randomise_ajax', (req, res) => {
    if (!req.xhr) return res.redirect('/');
    res.type('application/octet-stream');

    var seed = req.query.seed;
    var settings = req.query.settings;
    if (isNaN(Number(seed)) || !settings.match(/^[a-f0-9]+$/i)) {
        res.status(403);
        return res.send();
    }

    var filename = `./output_cache/${seed}-${settings}-${versionSuffix}`;

    fs.readFile(filename + ".ups", (err, data) => {
        if (!err) {
            res.send(data);
        } else {
            try {
                randomiser.randomise(seed, parseSettings(settings), filename + ".log", (patch) => {
                    fs.writeFile(filename + ".ups", patch, (err) => { 
                        if (err) console.log(err); 
                    });
                    res.send(Buffer.from(patch));
                });
            } catch (error) {
                console.log("=== RANDOMISATION ERROR ===");
                console.log(`Parameters: settings=${settings}; seed=${seed}`);
                console.log(error);
            }
        }
    });
});

//==================================================
// AJAX endpoint for fetching the spoiler log
//==================================================
router.get('/spoiler_ajax', (req, res) => {
    if (!req.xhr) return res.redirect('/');
    res.type('application/octet-stream');

    var seed = req.query.seed;
    var settings = req.query.settings;
    if (isNaN(Number(seed)) || !settings.match(/^[a-f0-9]+$/i)) {
        res.status(403);
        return res.send();
    }

    var filename = `./output_cache/${seed}-${settings}-${versionSuffix}`;

    fs.readFile(filename + ".log", (err, data) => {
        if (err) {
            res.type('application/json');
            res.send({error: "Spoiler log not found"});
        } else {
            res.send(data);
        }
    });
});

//==================================================
// AJAX endpoint for randomising a permalink seed
//==================================================
router.get('/create_perma_ajax', (req, res) => {
    if (!req.xhr) return res.redirect('/');
    res.type('application/json');

    var seed = req.query.seed;
    var settings = req.query.settings;
    if (isNaN(Number(seed)) || !settings.match(/^[a-f0-9]+$/i)) {
        res.status(403);
        return res.send();
    }

    var permalink = generatePermalink();
    var logPath = `./temp/${permalink}.log`;

    try {
        randomiser.randomise(seed, parseSettings(settings), logPath, (patch) => {
            fs.writeFile(`./permalinks/${permalink}.ups`, patch, (err) => { 
                if (err) 
                    console.log(err); 
                else {
                    var version = nodePackage.version;
                    if (!config.get("production"))
                        version += ' (dev-env)';

                    var meta = `settings=${settings}\nversion=v${version}\ntime=${new Date().getTime()}`;
                    fs.writeFile(`./permalinks/${permalink}.meta`, meta, (err) => {
                        if (err) 
                            console.log(err);
                        else {
                            fs.readFile(logPath, (err, data) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    res.send(permalink + data);
                                    fs.unlink(logPath, (err) => {
                                        if (err) console.log(err)
                                    });
                                }
                            });
                        }
                    });
                }
            }); 
        });
    } catch (error) {
        console.log("=== RANDOMISATION ERROR ===");
        console.log(`Parameters: settings=${settings}; seed=${seed}`);
        console.log(error);
    }
});

//==================================================
// AJAX endpoint for fetching a permalink UPS file
//==================================================
router.get('/fetch_perma_ajax', (req, res) => {
    if (!req.xhr) return res.redirect('/');
    res.type('application/octet-stream');

    fs.readFile(`./permalinks/${req.query.id}.ups`, (err, data) => {
        if (!err) {
            res.send(data);
        }
    });
});

module.exports = router;