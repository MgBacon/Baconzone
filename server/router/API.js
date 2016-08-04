var router = require('express').Router();
var bodyParser=require("body-parser");
var pg = require('pg');
var escape = require('escape-html');

var connection = require(__dirname +"/../../config").connectionString;
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
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
            row.quote=escape(row.quote);
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
            row.quote=escape(row.quote);
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
    var data = {quote: req.body.quote.trim(),author: req.body.author.trim(),year: req.body.year.trim()};
    pg.connect(connection, function(err, client, done) {
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({ success: false, data: err});
        }
        console.log(new Date()+': Added quote: '+[data.quote,data.author.trim(),data.year.trim()]);
        client.query("INSERT INTO quotes(quote, author,year) values($1, $2, $3)", [data.quote, data.author, data.year]);
        done();
        return res.status(200).json({ success: true, data: data});
    });
});
module.exports = router;