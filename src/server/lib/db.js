const { Client } = require('pg');
const fs = require('fs');
const crypto = require('crypto');
const { promisify } = require('util');
const test = require('../geojson/route13.json');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

function File(name, hash) {
    this.name = name;
    this.hash = hash;
}

function hashFile(file, directory) {
    return new Promise((resolve) => {
        console.log('Hashing file...');
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
    });
}

function readFiles(filenames, directory) {
    return new Promise((resolve) => {
        console.log('Reading Files from directory...');
        const promises = [];
        let filecntr = 0;
        filenames.forEach((filename) => {
            console.log(`Reading ${filename}...`);
            let file = require('.' + directory + filename);
            promises.push(hashFile(filename, directory));
            filecntr += 1;
        });
        Promise.all(promises).then((result) => {
            console.log(`Finished reading ${filecntr} files!`);
            resolve(result);
        });
    });
}

function addBusRoutes(files) {
    return new Promise((resolve) => {
        console.log('Poppulating database with geo data...');
        files.forEach((file) => {
            console.log(`Added ${file.name} to the database!`);
            try {
                client.query(`INSERT INTO bus(name, hash) VALUES('${file.name}', '${file.hash}')`);
                resolve();
            } catch (err) {
                console.log(`Failed to add ${file.name} to database!`);
            }
        });
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
exports.poppulate = () => new Promise(async (resolve) => {
    const directory = './geojson/';
    const readdir = await promisify(fs.readdir);
    const filenames = await readdir(directory);
    const files = await readFiles(filenames, directory);
    await addBusRoutes(files);
    resolve();
});
