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

exports.addBusRoute = async (name) => {
    try {
        client.query(`INSERT INTO bus(name) VALUES('${name}')`);
    } catch (err) {
        console.log('Failed to add bus route to database!');
        console.log(err);
    }
};
