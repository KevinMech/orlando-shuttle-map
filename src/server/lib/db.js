const fs = require('fs');
const {Client} = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

exports.connect = async() =>{
    try {
        await client.connect();
        console.log('Connected to database successfully!');
        return true;
    } catch (err) {
        console.log('Error connecting to database!');
        console.log(err);
        return false;    
    }
}

exports.generate = async() =>{
    const directory = './geojson';
    console.log('Reading directory...');
    try{
        await fs.readdir(directory, (err, files)=>{
            files.forEach(file =>{
                //Insert information from file
                client.query(`INSERT INTO bus(name) VALUES (${file})`);
            })
        });
    }
    catch(err){
        console.log(`Could not insert files from ${directory} into database!`);
        console.log(err);
    }
}
