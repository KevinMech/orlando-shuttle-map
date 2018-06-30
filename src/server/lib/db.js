const {Client} = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

exports.connect = async() =>{
    try {
        await client.connect();
        console.log("Connected to database successfully!");
        return true;
    } catch (err) {
        console.log(`Error Connecting to database! ${err}`);
        return false;    
    }
}
