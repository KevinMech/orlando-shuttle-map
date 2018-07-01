const express = require('express');
const app = express();
const fs = require('fs');
const {promisify} = require('util');
const apiroutes = require('./routes/api');
const db = require('./lib/db.js');
const config = require('./config.json');

//use port defined by Heroku, otherwise use port defined in config
const port = process.env.PORT || config.port;

app.use('/api', apiroutes);

app.get('/', (req, res) => {
    console.log(`Get requested for ${req.path} from ${req.ip}!`);
    res.send('Welcome! This is under construction at the moment.');
});

//Connect to database, then start listening for connections if successful
let dbsuccess = db.connect()
.then((dbsuccess)=>{
    if(dbsuccess){
        poppulate();
        app.listen(port, () => {
            console.log(`Now listening on port ${port}...`);
        });
    }
});

//Write geojson files to database
async function poppulate(){
    const directory = './geojson';
    const readdir = promisify(fs.readdir)
    try{
        console.log('Poppulating database with geo data...');
        let files = await readdir(directory);
        files.forEach(file =>{
            console.log(`Reading ${file}...`)
            db.addBusRoute(file);
        });
        console.log('Poppulation complete!');
    }
    catch(err){
        console.log('Failed to Read Directory!');
        console.log(err);
    }
}
