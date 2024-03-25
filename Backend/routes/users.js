const express = require('express');
const router = express.Router();
const sql = require('../models/db')

router.get('/', (req, res) => {
    sql.query('SELECT * FROM users', (error, results, fields) => {
        if (error) {
            console.error('Error executing query:', error);
            return;
        }

        // Process the results
        console.log('Query results:', results);
    });
    res.send('Here is Users');
});

module.exports = router
