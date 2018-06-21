const express = require('express');
const app = express();
const apiroutes = require('./routes/api');
const config = require('./config.json');

//use port defined by Heroku, otherwise use port defined in config
let port = process.env.PORT || config.port;

app.get('/', (req, res) => {
    console.log(`Get requested for ${req.path} from ${req.ip}!`);
    res.send('Welcome!');
});

app.use('/api', apiroutes);

app.listen(port, () => {
    console.log(`now listening on port ${port}...`);
});
