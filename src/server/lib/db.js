const { Client } = require('pg');

const client = new Client({
    user: 'kevin',
    host: 'localhost',
    database: 'bus',
    port: '5432',
});

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

exports.addBusRoute = (name, hash) => new Promise((resolve, reject) => {
    try {
        client.query(`INSERT INTO bus(name, hash) VALUES('${name}, ${hash}')`);
    } catch (err) {
        reject(err);
    }
});
