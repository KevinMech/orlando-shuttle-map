const { Client } = require('pg');
const fs = require('fs');
const objecthash = require('object-hash');
const { promisify } = require('util');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

function FileObj(name, stops, routes) {
    this.name = name;
    this.stops = stops;
    this.routes = routes;
}

function hashFile(file) {
    return new Promise((resolve) => {
        console.log(`hashing ${file.name}...`);
        const hash = objecthash(file, { algorithm: 'md5' });
        file.hash = hash;
        console.log(`Hash: ${file.hash}`);
        resolve(file);
    });
}

function hashFiles(files) {
    return new Promise((resolve) => {
        console.log('Hashing files...');
        const promises = [];
        let filecntr = 0;
        files.forEach((file) => {
            promises.push(hashFile(file));
            filecntr++;
        });
        Promise.all(promises).then((result) => {
            console.log(`Finished reading ${filecntr} files!`);
            resolve(result);
        });
    });
}

function parseFile(fileroot) {
    return new Promise((resolve) => {
        let name;
        let stops;
        let routes;
        for (let i = 0; i < fileroot.length; i++) {
            if (fileroot[i].type === 'Feature') {
                name = fileroot[i].properties.name;
            }
            if (fileroot[i].geometry.type === 'MultiPoint') {
                stops = fileroot[i].geometry.coordinates;
            }
            if (fileroot[i].geometry.type === 'LineString') {
                routes = fileroot[i].geometry.coordinates;
            }
        }
        const file = new FileObj(name, stops, routes);
        console.log(`Read ${file.name} successfully!`);
        resolve(file);
    });
}

function readFiles(filenames, directory) {
    return new Promise((resolve) => {
        console.log('Reading files from directory...');
        const promises = [];
        let filecntr = 0;
        filenames.forEach((filename) => {
            const importfile = require(`.${directory}${filename}`);
            const root = importfile.features;
            promises.push(parseFile(root));
            filecntr++;
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
    let files = await readFiles(filenames, directory);
    files = await hashFiles(files);
    await addBusRoutes(files);
    resolve();
});
