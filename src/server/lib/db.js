const { Client } = require('pg');
const fs = require('fs');
const objecthash = require('object-hash');
const { promisify } = require('util');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

function hashFile(file) {
    return new Promise((resolve) => {
        console.log('Hashing...');
        const hash = objecthash(file, { algorithm: 'md5' });
        file[0].properties.hash = hash;
        console.log(`Hash: ${file[0].properties.hash}`);
        resolve(file);
    });
}

function readFiles(filenames, directory) {
    return new Promise((resolve) => {
        console.log('Reading files from directory...');
        const promises = [];
        let filecntr = 0;
        filenames.forEach((filename) => {
            console.log(`Reading ${filename}...`);
            let importfile = require(`.${directory}${filename}`);
            let file = importfile.features;
            promises.push(hashFile(file));
            filecntr += 1;
            console.log(`Read ${filename} successfully!`);
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
