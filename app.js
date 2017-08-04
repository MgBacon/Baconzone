var fs=require('fs');
var path = require('path');
var express=require('express');
var app=express();
var exphbs=require('express-handlebars');
var morgan=require('morgan');
var database=require('./server/router/API');
var auth=require('./server/router/Auth');


app.disable("x-powered-by");
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Setting up the loggers
var access_logfile = fs.createWriteStream('./access.log', {flags: 'a'});
var type="[:date[clf]] :method :remote-addr Status: :status Path: :url :response-time ms :res[body] :";
app.use(morgan(type,{stream: access_logfile }));
app.use(morgan('dev'));

//set up APIs
app.use('/api/v1',database);
app.use('/auth/',auth);


app.get('/', function (req, res) {
    res.render('home');
});

app.get('/about', function (req, res) {
    res.render('about');
});

app.get('/api', function (req, res) {
    res.render('api');
});
app.get('/quotes', function (req, res) {
    res.render('quotes');
});

app.get('/farmbot', function (req, res) {
    res.render('farmbot');
})
app.get('/moetrash', function (req, res) {
    res.sendFile(path.join(__dirname+"/moetrash.html"));
})

//discord auth stuff
var session  = require('express-session');
var passport = require('passport');
var Strategy = require('./lib').Strategy;
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
var scopes = ['identify', /* 'connections', (it is currently broken) */ 'guilds', 'guilds.join'];

passport.use(new Strategy({
    clientID: process.env.DISCORD_CLIENTID,
    clientSecret: process.env.clientSecret,
    callbackURL: 'http://localhost:3000/callback',
    scope: scopes
}, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
        return done(null, profile);
    });
}));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.get('/discord', passport.authenticate('discord', { scope: scopes }), function(req, res) {});
app.get('/callback',
    passport.authenticate('discord', { failureRedirect: '/' }), function(req, res) { res.redirect('/info') } // auth success
);
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
app.get('/info', checkAuth, function(req, res) {
    //console.log(req.user)
    res.json(req.user);
});


function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send('not logged in :(');
}

//if nothing is found, end up here
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

//starting the server
var port=3000;
app.listen(port);
console.log("Express has been started on port "+port);