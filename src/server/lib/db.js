const { Client } = require('pg');
const fs = require('fs');
const crypto = require('crypto');
const { promisify } = require('util');

const client = new Client({
    user: 'kevin',
    host: 'localhost',
    database: 'bus',
    port: '5432',
});

function hashFiles(file, directory) {
    return new Promise((resolve, reject) => {
        try {
            const hash = crypto.createHash('md5');
            let hashed;
            hash.setEncoding('hex');
            const stream = fs.createReadStream(directory + file).on('end', () => {
                hash.end();
                hashed = hash.read();
                console.log(`hash: ${hashed}`);
                resolve([file, hashed]);
            });
            stream.pipe(hash);
        } catch (err) {
            reject(err);
        }
    });
}

function addBusRoute(name, hash) {
    return new Promise((resolve, reject) => {
        try {
            client.query(`INSERT INTO bus(name, hash) VALUES('${name}, ${hash}')`);
        } catch (err) {
            reject(err);
        }
    });
}

exports.connect = () => new Promise((resolve, reject) => {
    try {
        client.connect(() => {
            console.log('Connected to database successfully!');
            resolve(true);
        });
    } catch (err) {
        console.log('Error connecting to database!');
        reject(err);
    }
});

// Write geojson files to database
exports.poppulate = () => new Promise(async (resolve, reject) => {
    const directory = './geojson/';
    const readdir = promisify(fs.readdir);
    const promises = [];
    try {
        console.log('Poppulating database with geo data...');
        const files = await readdir(directory);
        for (const file of files) {
            console.log(`Reading ${file}...`);
            promises.push(hashFiles(file, directory));
        }
    } catch (err) {
        console.log('Failed to Read Directory!');
        reject(err);
    }
    Promise.all(promises).then((results) => {
        console.log(`${results}`);
        console.log('Poppulation complete!');
        // db.addBusRoute(file);
        resolve(true);
    });
});
