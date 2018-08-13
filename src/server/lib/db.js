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

function File(name, hash) {
    this.name = name;
    this.hash = hash;
}

function hashFile(file, directory) {
    return new Promise((resolve, reject) => {
        try {
            const hash = crypto.createHash('md5');
            let hashed;
            hash.setEncoding('hex');
            const stream = fs.createReadStream(directory + file).on('end', () => {
                hash.end();
                hashed = hash.read();
                const fileobj = new File(file, hashed);
                console.log(`hashed ${fileobj.name}: ${fileobj.hash}`);
                resolve(fileobj);
            });
            stream.pipe(hash);
        } catch (err) {
            reject(err);
        }
    });
}

function hashFiles(files, directory) {
    return new Promise((resolve, reject) => {
        try {
            const promises = [];
            files.forEach((file) => {
                console.log(`Hashing ${file}...`);
                promises.push(hashFile(file, directory));
            });
            Promise.all(promises).then((result) => {
                console.log('hashing complete!');
                resolve(result);
            });
        } catch (err) {
            reject(err);
        }
    });
}

function addBusRoute(name, hash) {
    return new Promise((resolve, reject) => {
        try {
            console.log('Poppulating database with geo data...');
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
    try {
        console.log('Reading Files from directory...');
        const files = await readdir(directory);
        await hashFiles(files, directory);
        resolve(true);
    } catch (err) {
        console.log('Failed to Read Directory!');
        reject(err);
    }
});
