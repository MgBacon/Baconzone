var passport = require('passport');
var auth = require('express').Router();

auth.use(passport.initialize());
auth.use(passport.session());

auth.get('/', function(req, res){
    res.render('quotes', {user: req.user});
});

//displays our signup page
auth.get('/login/local', function(req, res){
    res.render('login');
});

//sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
auth.post('register/.local', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signin'
    })
);

//sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
auth.post('/register', passport.authenticate('local-signin', {
        successRedirect: '/',
        failureRedirect: '/signin'
    })
);

//logs user out of site, deleting them from the session, and returns to homepage
auth.get('/logout', function(req, res){
    var name = req.user.username;
    console.log("LOGGIN OUT " + req.user.username)
    req.logout();
    res.redirect('/');
    req.session.notice = "You have successfully been logged out " + name + "!";
});

module.exports = auth;