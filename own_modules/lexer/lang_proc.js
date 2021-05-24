const fs = require('fs');
const lexer = require('./lexer.js')
const syntax = require('./syntax.js')
const cTable = require('console.table');
let chevrotain = require('chevrotain');

const PATHES = {
    SOURCE: 'source.mylang',
    RES: 'result.json',
    RES_MIN: 'result.min.json'
}

/* const inputText = fs.readFileSync(PATHES.SOURCE, { encoding: "utf-8" })
let lexingResult = lexer.lex(inputText);
lexer.printTable(lexingResult, { filename: PATHES.SOURCE, inputText: inputText });
const serializedGrammar = syntax.parserInstance.getSerializedGastProductions()
fs.writeFileSync('grammar.html', chevrotain.createSyntaxDiagramsCode(serializedGrammar))

let syntaxTree = syntax.parse(inputText);
fs.writeFileSync(PATHES.RES, JSON.stringify(syntaxTree, null, 2));
fs.writeFileSync(PATHES.RES_MIN, JSON.stringify(syntaxTree)); */

module.exports = {
    getSyntaxTree: function(inputText, cb) {
        if (!inputText) {
            return cb(new Error("No source input provided."));
        }
        syntax.parse(inputText, (errors, tree) => {
            if (errors) {
                return cb(errors);
            }
            return cb(null, tree);
        });
    }
}