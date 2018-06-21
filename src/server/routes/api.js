const express = require('express');
const router = express.Router();

router.get('/routes', (req, res) => {
    console.log(`Get requested for ${req.path} from ${req.ip}!`);
    res.send('Routes here');
});

module.exports = router;
