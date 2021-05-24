let chevrotain = require('chevrotain');

const cTable = require('console.table');
const createToken = chevrotain.createToken


const Identifier = createToken({ name: "Identifier", pattern: /([a-zA-Z]|_|\$)(\w*\d*_*\$*)*/ })

// We specify the "longer_alt" property to resolve keywords vs identifiers ambiguity.
// See: https://github.com/SAP/chevrotain/blob/master/examples/lexer/keywords_vs_identifiers/keywords_vs_identifiers.js

const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: chevrotain.Lexer.SKIPPED
})


const Integer = createToken({ name: "Integer", pattern: /0|-?[1-9]\d*/ })
const Real = createToken({ name: "Real", pattern: /-?[0-9]\d*(\.\d*)?/ })

const Print = createToken({ name: "Print", pattern: /print/ })
const Scan = createToken({ name: "Scan", pattern: /scan/ })
const For = createToken({ name: "For", pattern: /for/ })
const To = createToken({ name: "To", pattern: /to/ })
const By = createToken({ name: "By", pattern: /by/ })
const While = createToken({ name: "While", pattern: /while/ })
const Rof = createToken({ name: "Rof", pattern: /rof/ })
const If = createToken({ name: "If", pattern: /if/ })
const Then = createToken({ name: "Then", pattern: /then/ })
const Fi = createToken({ name: "Fi", pattern: /fi/ })
const Equal = createToken({ name: "Equal", pattern: /=/ })
const Lth = createToken({ name: "Lth", pattern: /</ })
const Gth = createToken({ name: "Gth", pattern: />/ })
const LeftParenthis = createToken({ name: "LeftParenthis", pattern: /\(/ })
const RightParenthis = createToken({ name: "RightParenthis", pattern: /\)/ })
const Plus = createToken({ name: "Plus", pattern: /\+/ })
const Minus = createToken({ name: "Minus", pattern: /-/ })
const Not = createToken({ name: "Not", pattern: /!/ })
const Multiply = createToken({ name: "Multiply", pattern: /\*/ })
const Divide = createToken({ name: "Divide", pattern: /\// })
const Power = createToken({ name: "Power", pattern: /\^/ })
const Or = createToken({ name: "Or", pattern: /\|\|/ })
const And = createToken({ name: "And", pattern: /&&/ })
const isEqual = createToken({ name: "isEqual", pattern: /==/ })

// note we are placing WhiteSpace first as it is very common thus it will speed up the lexer.
let allTokens = [
    WhiteSpace,
    // "keywords" appear before the Identifier
    For, To, By, While, Rof, If, Then, Fi, Print, Scan,
    // The Identifier must appear after the keywords because all keywords are valid identifiers.
    Identifier,
    Real,Integer, 
    isEqual, Equal, LeftParenthis, RightParenthis, Not, Lth, Gth, Plus, Minus, Multiply, Divide, Power, Or, And
]
let SelectLexer = new chevrotain.Lexer(allTokens)

let tokenVocabulary = {};
allTokens.forEach(tokenType => {
    tokenVocabulary[tokenType.name] = tokenType
});

module.exports = {
    tokenVocabulary: tokenVocabulary,

    lex: function (inputText) {
        const lexingResult = SelectLexer.tokenize(inputText)

        if (lexingResult.errors.length > 0) {
            lexingResult.err = lexingResult.errors;
        }
        return lexingResult
    },
    printTable: function (lexingResult, src) {
        let toPrint = lexingResult.tokens.map(el => {
            return {
                image: el.image,
                startOffset: el.startOffset,
                endOffset: el.endOffset,
                startLine: el.startLine,
                endLine: el.endLine,
                startColumn: el.startColumn,
                endColumn: el.endColumn,
                tokenTypeIdx: el.tokenTypeIdx,
                tokenTypeName: el.tokenType.name,
                pattern: el.tokenType.PATTERN
            }
        })
        if (src.filename && src.inputText) {
            console.log(`Вміст файлу ${src.filename}:`)
            console.log(src.inputText + '\n\\EOF')
        }
        console.table(toPrint)
    }
}