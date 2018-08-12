const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const { promisify } = require('util');
const apiroutes = require('./routes/api');
const db = require('./lib/db.js');
const config = require('./config.json');

const app = express();

// Use port defined by Heroku, otherwise use port defined in config
const port = process.env.PORT || config.port;

function hashFiles(file, directory) {
    return new Promise((resolve, reject) => {
        try {
            // hash file
            const hash = crypto.createHash('md5');
            hash.setEncoding('hex');
            let hashed;
            const stream = fs.createReadStream(directory + file).on('end', () => {
                hash.end();
                hashed = hash.read();
                console.log(hashed);
            });
            stream.pipe(hash);
            resolve(hashed);
        } catch (err) {
            reject(err);
        }
    });
}

// Write geojson files to database
async function poppulate() {
    const directory = './geojson/';
    const readdir = promisify(fs.readdir);
    try {
        console.log('Poppulating database with geo data...');
        const files = await readdir(directory);
        files.forEach((file) => {
            console.log(`Reading ${file}...`);
            let hash = hashFiles(file, directory);
            console.log(hash);
            //db.addBusRoute(file);
        });
        console.log('Poppulation complete!');
    } catch (err) {
        console.log('Failed to Read Directory!');
        console.log(err);
    }
}

// Connect to database, then start listening for connections if successful
async function connectDB() {
    const dbsuccess = await db.connect();
    if (dbsuccess) {
        await poppulate();
        app.listen(port, () => {
            console.log(`Now listening on port ${port}...`);
        });
    }
}

app.use('/api', apiroutes);

app.get('/', (req, res) => {
    console.log(`Get requested for ${req.path} from ${req.ip}!`);
    res.send('Welcome! This is under construction at the moment.');
});

connectDB();