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
    res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
    res.render('login', { data: null, error: null });
});

router.post('/login', (req, res) => {
    auth.login(req.body)
        .then(userData => {
            res.cookie('jwt', userData.token, { httpOnly: true, secure: true, maxAge: 3600000 });
            res.redirect('welcome');
        })
        .catch(error => {
            res.render('login', { error: error, data: null })
        })
})
router.post('/createUser', (req, res) => {
    const userData = {
        email: "asd@gmail.com",
        password: 'asd',
        name: 'Стативка Юрій Іванович',
        role: 'admin'
    }
    auth.signUp(userData)
        .then(newUser => {
            res.render('login', { data: newUser });
        })
        .catch(error => {
            res.render('login', { data: error });
        })
})


router.get('/welcome', (req, res) => {
    res.render('welcome', { userData: { name: 'Влад' } });
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