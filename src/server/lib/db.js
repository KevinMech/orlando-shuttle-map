const { Client } = require('pg');
const fs = require('fs');
const crypto = require('crypto');
const { promisify } = require('util');

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

function hashFiles(files, directory) {
    return new Promise((resolve) => {
        const promises = [];
        files.forEach((file) => {
            console.log(`Hashing ${file}...`);
            promises.push(hashFile(file, directory));
        });
        Promise.all(promises).then((result) => {
            console.log('hashing complete!');
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
    console.log('Reading Files from directory...');
    const files = await readdir(directory);
    const hashedfiles = await hashFiles(files, directory);
    await addBusRoutes(hashedfiles);
    resolve();
});
