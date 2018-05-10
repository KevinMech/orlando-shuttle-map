const express = require('express');
const app = express();

const config = require('./config.json');

app.get('/', (req, res) => {
    console.log('Get request received!');
    res.send('Welcome!');
});

app.listen(config.port, () => {
    console.log(`now listening on port ${config.port}...`);
});
