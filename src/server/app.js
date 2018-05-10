const express = require('express');
const app = express();
const apiroutes = require('./routes/api');
const config = require('./config.json');

app.get('/', (req, res) => {
    console.log(`Get requested for ${req.path} from ${req.ip}!`);
    res.send('Welcome!');
});

app.use('/api', apiroutes);

app.listen(config.port, () => {
    console.log(`now listening on port ${config.port}...`);
});
