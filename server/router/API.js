require('connect-flash');
var express = require('express');
var bodyParser=require("body-parser");
var pg = require('pg');
var escape = require('escape-html');

var RateLimit = require('express-rate-limit');
var apiLimiter = new RateLimit({
    windowMs: 15*60*1000, // 15 minutes 
    max: 0,
    delayMs: 0, // disabled
    statusCode: 429, // 429 status = Too Many Requests (RFC 6585)
    message: "429 Too many requests, please try again later"
    //TODO: do proper handler, not direct lib hack
});
var router=express();
var connection = require(__dirname +"/../../config").connectionString;

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
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
router.post('/quotes',apiLimiter, function(req,res){
    var quote=req.body.quote;
    var author=req.body.author;
    var year=req.body.year;
    if((quote===undefined||quote==="") || (author===undefined||author==="") || (year===undefined||year==="")){
        return res.status(510).json({ success: false, data: 'Missing parameters: Expecting a quote, an author and a year parameter'});
    }
    var data = {quote: quote.trim(),author: author.trim(),year: year.trim()};
    pg.connect(connection, function(err, client, done) {
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({ success: false, data: err});
        }
        var query=client.query("SELECT quote FROM quotes WHERE quote=$1",[data.quote]);
        query.on('end', function(result) {
            done();
            console.log(result.rows.length + ' rows were found');
            if(result.rows.length>0){
                return res.status(208).json({success: false, data: 'Quote already exists!'})
            }else {
                client.query("INSERT INTO quotes(quote, author,year) values($1, $2, $3)", [data.quote, data.author, data.year]);
                done();
                console.log(new Date() + ': Added quote: ' + data.quote - data.author + data.year);
                return res.status(200).json({
                    success: true, data: {
                        quote: data.quote,
                        author: data.author,
                        year: data.year
                    }
                });
            }
        });
    });
});

module.exports = router;