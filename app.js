var express=require('express');
var exphbs=require('express-handlebars');
var morgan=require('morgan');
var database=require('./server/router/API');
var auth=require('./server/router/Auth');
var fs = require('fs');



var port=3000;

var app=express();
app.disable("x-powered-by");
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Setting up the loggers
var access_logfile = fs.createWriteStream('./access.log', {flags: 'a'});
var type="[:date[clf]] :remote-addr Status: :status Path: :url :response-time ms :res[body]";
app.use(morgan(type,{stream: access_logfile }));
app.use(morgan('dev'));

app.use('/api/v1',database);
app.use('/auth/',auth);

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
app.listen(port);
console.log("Express has been started on port "+port);