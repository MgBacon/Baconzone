require('dotenv').config();
var express = require('express');
var bodyParser=require("body-parser");
const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DB_URL
})

var RateLimit = require('express-rate-limit');
var apiLimiter = new RateLimit({
    windowMs: 15*60*1000, // 15 minutes 
    max: 100,
    delayMs: 0, // disabled
    statusCode: 429, // 429 status = Too Many Requests (RFC 6585)
    message: "429 Too many requests, please try again later"
});

var router=express();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.get('/', function(req, res) {
    res.json('API main page, not much to see here');
});
//TODO: use clients to pool from main pool
/**
*   GET
*
*/
router.get('/quotes', function(req,res) {
    var quotes = [];
    pool.query('SELECT * FROM quotes ORDER BY id ASC', (err, result) => {
        if(err){
            return res.status(500).json({ success: false, data: err});
        }else{
            result.rows.forEach(function(element) {
                quotes.push(element)
            }, this);
            return res.status(200).json({quotes: quotes});
        }
    });
        
});
//get random quote
router.get('/quotes/random', function(req,res) {
    var quotes = [];
    pool.query('SELECT * FROM quotes ORDER BY random() LIMIT 1', (err, result) =>  {
        if(err){
            return res.status(500).json({ success: false, data: err});
        }else{
            quotes.push(result.rows[0]);
            return res.status(200).json({quotes: quotes});
        }
    });
});

/**
 *   POST
 *
*/
router.post('/quotes',apiLimiter, (req,res) =>{
    var quote=req.body.quote;
    var author=req.body.author;
    var year=req.body.year;
    if(!validParameter(quote) || !validParameter(author) || !validParameter(year)){
        return res.status(400).json({ success: false, data: 'Missing parameters: Expecting a quote, an author and a year parameter'});
    }
    var data = {quote: quote.trim(),author: author.trim(),year: year.trim()};
    console.log(data);
    pool.query("SELECT quote FROM quotes WHERE quote=$1",[data.quote], (err,result) => {
            console.log(result.rows.length + ' rows were found');
            if(err){
                console.log(err);
                return res.status(500).json({sucess: false, data: err})
            }else{
                if(result.rows.length>0){
                return res.status(208).json({success: false, data: 'Quote already exists!'})
                }else {
                pool.query("INSERT INTO quotes(quote, author,year,date) values($1, $2, $3, $4)", [data.quote, data.author, data.year,new Date()]);
                console.log(new Date() + ': Added quote: ' + data.quote - data.author + data.year);
                    return res.status(200).json({
                        success: true, data: {
                            quote: data.quote,
                            author: data.author,
                            year: data.year
                        }
                    });
                }
            }
    })
});
module.exports = router;
//Subs
/*
function getSubs(){
    pool.query("SELECT discordchannel,youtubechannel FROM subs",[data.quote]), (result) => {
            console.log(result.rows.length + ' rows were found');
            if(result.rows.length>0){
                return res.status(208).json({success: false, data: 'Quote already exists!'})
            }else {
                client.query("INSERT INTO quotes(quote, author,year,date) values($1, $2, $3, $4)", [data.quote, data.author, data.year,new Date()]);
                console.log(new Date() + ': Added quote: ' + data.quote - data.author + data.year);
                return res.status(200).json({
                    success: true, data: {
                        quote: data.quote,
                        author: data.author,
                        year: data.year
                    }
                });
            }
    }
}
function getSubForYoutubeChannel(youtubeChannelID){

}
function getSubsForYoutubeChannel(discordChannelID){
    
}
*/
function validParameter(parameter){
    if(parameter===""|| parameter===null || parameter ===NaN || parameter===undefined){
        return false;
    }else{
        return true;
    }
}
