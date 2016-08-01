var router = require('express').Router();
var pg = require('pg');

var connection = require(__dirname +"/../../config").connectionString;
console.log(connection);
router.get('/', function(req, res) {
    res.json('API main page, not much to see here');
});
/**
*   GET
*
 */
router.get('/quotes', function(req,res) {
    var quotes = [];
    pg.connect(connection, function(err, client, done) {
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({ success: false, data: err});
        }
        var query=client.query('SELECT * FROM quotes ORDER BY id ASC;', function(err, result) {
            if(err){
                return res.status(500).json({ success: false, data: err});
            }
        });
        query.on('row', function(row) {
            quotes.push(row);
        });
        query.on('end', function() {
            done();
            return res.status(200).json({quotes: quotes});
        });
    });
});
//get random quote
router.get('/quotes/random', function(req,res) {
    var quotes = [];
    pg.connect(connection, function(err, client, done) {
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({ success: false, data: err});
        }
        var query=client.query('SELECT * FROM quotes ORDER BY random() LIMIT 1;', function(err, result) {
            if(err){
                return res.status(500).json({ success: false, data: err});
            }
        });
        query.on('row', function(row) {
            quotes.push(row);
        });
        query.on('end', function() {
            done();
            return res.status(200).json({quotes: quotes});
        });
    });
});

/**
 *   POST
 *
 */
router.post('/quotes', function(req,res){
    return res.status(200).json({success: true});
});
module.exports = router;