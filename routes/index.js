var express = require('express');
var router = express.Router();
let lang_proc = require('../lang_proc.js')
let translator = require('../translator.js')
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Express' });
});

router.post('/login', (req, res) => {
    res.redirect(301, '/welcome');
})

router.get('/welcome', (req, res) => {
    res.render('welcome');
})

router.get('/lexer', (req, res) => {
    res.render('lexer');
})

router.post('/parse_input', (req, res, next) => {
    lang_proc.getSyntaxTree(req.body.source, (errors, syntaxTree) => {
        if (errors) {
            return res.json({ err: errors });
        } else {
            return res.json({ tree: syntaxTree, RPN: translator.translate(syntaxTree) });
        }
    });
})

module.exports = router;