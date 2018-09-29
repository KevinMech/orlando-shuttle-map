const pgp = require('pg-promise')();
const fs = require('fs');
const objecthash = require('object-hash');
const { promisify } = require('util');

const cn = {
    host: process.env.DATABASE_URL,
    ssl: true,
    poolsize: 20,
};

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

function addBusRoutes(files, db) {
    return new Promise((resolve, reject) => {
        console.log('Poppulating database with geo data...');
        files.forEach(async (file) => {
            try {
                await db.none('INSERT INTO bus(name, hash) VALUES($1, $2)', [file.name, file.hash]);
                await file.stops.forEach((stop) => {
                    db.none('INSERT INTO bus_stop(bus_id, longitude, latitude) VALUES((SELECT id FROM bus WHERE name = $1), $2, $3)', [file.name, stop[0], stop[1]]);
                });
                await file.routes.forEach((route) => {
                    db.none('INSERT INTO bus_route(bus_id, longitude, latitude) VALUES((SELECT id FROM bus WHERE name = $1, $2, $3)', [file.name, route[0], route[1]]);
                });
                console.log(`Added ${file.name} to the database!`);
                resolve();
            } catch (err) {
                console.log(`Failed to add ${file.name} to database!`);
                reject(err);
            }
        });
    });
}

// Write geojson files to database
exports.Poppulate = () => new Promise(async (resolve) => {
    const db = pgp(cn);
    const directory = './geojson/';
    const readdir = await promisify(fs.readdir);
    const filenames = await readdir(directory);
    let files = await readFiles(filenames, directory);
    files = await hashFiles(files);
    try {
        await addBusRoutes(files, db);
    } catch (err) {
        console.log(err);
    }
    resolve();
});
