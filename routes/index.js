const { json } = require('express');
const express = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

let router = express.Router();
let auth = require('../own_modules/auth')
let db = require('../own_modules/db/');

const isAuth = auth.isAuth;
const attachCurrentUser = auth.attachCurrentUser;
const roleRequired = auth.roleRequired;

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('login');
});

router.get('/login', isAuth, attachCurrentUser, function (req, res, next) {
    if (req.currentUser) {
        res.redirect('welcome');
    }
    res.render('login', { data: null, error: null });
});

router.get('/logout', isAuth, attachCurrentUser, function (req, res, next) {
    res.clearCookie('jwt');
    res.render('login', { data: null, error: null });
});

router.post('/login', (req, res) => {
    auth.login(req.body)
        .then(userData => {
            res.cookie('jwt', userData.token, { httpOnly: true, secure: true, maxAge: 3600000 });
            res.redirect('welcome');
        })
        .catch(error => {
            console.log(error);
            res.render('login', { error: error, data: null })
        })
})

router.get('/welcome', isAuth, attachCurrentUser, (req, res) => {
    let data = {
        userData: { name: req.currentUser ? req.currentUser.name : "test" },
        admin: req.currentUser ? (req.currentUser.role === 'admin' ? true : false) : false
    }
    res.render('welcome', data);
})

router.get('/users', isAuth, attachCurrentUser, roleRequired('admin'), (req, res) => {
    res.render('users',);
})

router.get('/getUsers', isAuth, attachCurrentUser, roleRequired('admin'), (req, res) => {
    db.user.find({})
        .then(users => {
            console.log(users)
            res.json(users);
        })
        .catch(error => {
            console.log(error)
            res.json(error);
        })

})

router.param('lexerid', function (req, res, next, id) {
    console.log('CALLED ONLY ONCE')
    next()
})

router.get('/lexer/:lexerid/', (req, res) => {
    res.render('lexer');
})


router.post('/lexer/:lexerid/execute', (req, res) => {

});


router.post('/createUser', isAuth, attachCurrentUser, roleRequired('admin'), (req, res) => {
    /* const userData = {
        email: "a@f.com",
        password: 'af',
        name: 'Тертишний Владислав Юрійович',
        role: 'student'
    } */
    auth.signUp(req.body)
        .then(newUser => {
            res.json({ error: null, data: newUser });
        })
        .catch(error => {
            res.json({ error: error, data: null });
        })
})

router.post('/createAutomaton', isAuth, attachCurrentUser, roleRequired('admin'), (req, res) => {
    /* const userData = {
        email: "a@f.com",
        password: 'af',
        name: 'Тертишний Владислав Юрійович',
        role: 'student'
    } */
    let newAutomatonData = req.body;
    newAutomatonData.author = req.currentUser._id;
    db.automaton.create(newAutomatonData)
        .then(newAutomaton => {
            res.json({ error: null, data: newAutomaton });
        })
        .catch(error => {
            console.log(error);
            res.json({ error: error, data: null });
        })
})


/* let lang_proc = require('../own_modules/lexer/lang_proc.js')
let translator = require('../own_modules/lexer/translator.js')
const fs = require('fs'); 
router.post('/parse_input', (req, res, next) => {
    lang_proc.getSyntaxTree(req.body.source, (errors, syntaxTree) => {
        if (errors) {
            return res.json({ err: errors });
        } else {
            return res.json({ tree: syntaxTree, RPN: translator.translate(syntaxTree) });
        }
    });
}) 
 */

module.exports = router;