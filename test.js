var express = require('express');
var exphbs  = require('express-handlebars');
var database = require('./server/router/API');
var auth= require('./server/router/Auth');

var app=express();
app.disable("x-powered-by");

app.use('/api/v1',database);
app.use('/auth/',auth);

app.use(express.static(__dirname + '/public'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//simple logger is simple
app.use(function (req,resp,next) {
    console.log(new Date()+ ": URL: "+req.url+" requested by IP:"+req.ip);
    next();
});
app.get('/', function (req, res) {
    res.render('home');
});
app.get('/about', function (req, res) {
    res.render('about');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/register', function (req, res) {
    res.render('register');
});

app.get('/api', function (req, res) {
    res.render('api');
});
app.get('/quotes', function (req, res) {
    res.render('quotes');
});

app.use(function (req,resp) {
    resp.type("text/html");
    resp.status(404);
    resp.render("404");
});
app.use(function (error, req,resp) {
    console.error(error.stack);
    resp.status(500);
    resp.render("500");
});
app.listen(3000,function(){
    console.log("Express has been started on port"+app.port);
});