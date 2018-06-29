const express = require('express');
const app = express();
const apiroutes = require('./routes/api');
const config = require('./config.json');
const {Client} = require('pg');


//use port defined by Heroku, otherwise use port defined in config
let port = process.env.PORT || config.port;

//Connect to Database
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

client.connect((err) =>{
    if(err) console.log("Error connecting to database! Error:${err");
    else console.log("Connected to database successfully!");
});

app.get('/', (req, res) => {
    console.log(`Get requested for ${req.path} from ${req.ip}!`);
    res.send('Welcome!');
});

app.use('/api', apiroutes);

app.listen(port, () => {
    console.log(`now listening on port ${port}...`);
});
