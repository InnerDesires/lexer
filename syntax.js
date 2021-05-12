const util = require('util');

const CstParser = require("chevrotain").CstParser
const lexer = require('./lexer.js');

const cTable = require('console.table');

const tokenVocabulary = lexer.tokenVocabulary

const WhiteSpace = tokenVocabulary.WhiteSpace
const For = tokenVocabulary.For
const To = tokenVocabulary.To
const By = tokenVocabulary.By
const While = tokenVocabulary.While
const Rof = tokenVocabulary.Rof
const If = tokenVocabulary.If
const Then = tokenVocabulary.Then
const Fi = tokenVocabulary.Fi
const Identifier = tokenVocabulary.Identifier
const Real = tokenVocabulary.Real
const RealExp = tokenVocabulary.Real.Exp
const Integer = tokenVocabulary.Integer
const Equal = tokenVocabulary.Equal
const Lth = tokenVocabulary.Lth
const Gth = tokenVocabulary.Gth
const LeftParenthis = tokenVocabulary.LeftParenthis
const RightParenthis = tokenVocabulary.RightParenthis
const Plus = tokenVocabulary.Plus
const Minus = tokenVocabulary.Minus
const Not = tokenVocabulary.Not
const Multiply = tokenVocabulary.Multiply
const Divide = tokenVocabulary.Divide
const Print = tokenVocabulary.Print
const Scan = tokenVocabulary.Scan
const Power = tokenVocabulary.Power
const Or = tokenVocabulary.Or
const And = tokenVocabulary.And
const isEqual = tokenVocabulary.isEqual
let tabcount = 0;

function multab() {
    let res = '';
    for (let index = 0; index < tabcount; index++) {
        res += '\t'
    }
    return res;
}
class parser extends CstParser {
    constructor() {
        super(tokenVocabulary);
        const $ = this;

        $.RULE("Program", () => {

            $.MANY(() => {
                $.SUBRULE($.Statement)
            })

        })
        $.RULE("Statement", () => {
            console.log(`${multab(tabcount++)}statement`);
            $.OR([
                { ALT: () => $.SUBRULE($.assignStatement) },
                { ALT: () => $.SUBRULE($.forStatement) },
                { ALT: () => $.SUBRULE($.ifStatement) },
                { ALT: () => $.SUBRULE($.printStatement) },
                { ALT: () => $.SUBRULE($.scanStatement) },
            ])
            tabcount--;
        })
        $.RULE("assignStatement", () => {
            console.log(`${multab(++tabcount)} assign`);
            $.CONSUME(Identifier)
            $.CONSUME(Equal)
            $.SUBRULE($.Expression)
            tabcount--
        })
        $.RULE("forStatement", () => {
            console.log(`${multab(tabcount++)}for statement`);
            $.CONSUME(For)
            $.SUBRULE($.assignStatement)
            $.CONSUME(To)
            $.SUBRULE($.Expression)
            $.CONSUME(By)
            $.SUBRULE1($.Expression)
            $.CONSUME(While)
            $.SUBRULE2($.Expression)
            $.MANY(() => {
                $.SUBRULE($.Statement)
            })
            $.CONSUME(Rof)
            tabcount--;
        })

        $.RULE('printStatement', () => {
            console.log(`${multab(tabcount++)}print statement`);
            $.CONSUME(Print)
            $.CONSUME(LeftParenthis)
            $.SUBRULE($.Expression)
            $.CONSUME(RightParenthis)
            tabcount--;
        });
        $.RULE('scanStatement', () => {
            console.log(`${multab(tabcount++)}print statement`);
            $.CONSUME(Scan)
            $.CONSUME(LeftParenthis)
            $.CONSUME(Identifier)
            $.CONSUME(RightParenthis)
            tabcount--;
        });

        $.RULE('ifStatement', () => {
            console.log(`${multab(tabcount++)}if statement`);
            $.CONSUME(If)
            $.SUBRULE($.Expression)
            $.CONSUME(Then)
            $.SUBRULE($.Statement)
            $.MANY(() => {
                $.SUBRULE1($.Statement)
            })
            $.CONSUME(Fi)
            tabcount--;
        });

        $.RULE("Expression", () => {
            console.log(`${multab(tabcount++)}expression`);
            $.SUBRULE($.Operand)
            $.MANY(() => {
                $.SUBRULE($.Operator)
                $.SUBRULE1($.Operand)
            })
            tabcount--;
        })
        $.RULE("ParenthisExpression", () => {
            $.CONSUME(LeftParenthis)
            $.SUBRULE($.Expression)
            $.CONSUME(RightParenthis)
        })

        $.RULE("Operand", () => {
            console.log(`${multab(tabcount++)}operand`);
            $.OR([
                { ALT: () => $.SUBRULE($.OperandSimple) },
                { ALT: () => $.SUBRULE($.OperandWithUnary) }
            ])
            tabcount--;
        })

        $.RULE("OperandSimple", () => {
            $.OR([
                { ALT: () => $.CONSUME(Identifier) },
                { ALT: () => $.SUBRULE($.Number) },
                { ALT: () => $.SUBRULE($.ParenthisExpression) }
            ])
        })
        $.RULE("OperandWithUnary", () => {
            $.OR([
                { ALT: () => $.CONSUME(Minus) },
                { ALT: () => $.CONSUME(Not) },
            ])
            $.SUBRULE($.OperandSimple);
        })



        $.RULE("Number", () => {

            $.OR([
                { ALT: () => $.CONSUME(Integer) },
                { ALT: () => $.CONSUME(Real) },
            ])

        })
        $.RULE("Operator", () => {
            console.log(`${multab(tabcount++)}operator`);
            $.OR([
                { ALT: () => $.CONSUME(Plus) },
                { ALT: () => $.CONSUME(Minus) },
                { ALT: () => $.CONSUME(Multiply) },
                { ALT: () => $.CONSUME(Divide) },
                { ALT: () => $.CONSUME(Power) },
                { ALT: () => $.CONSUME(Or) },
                { ALT: () => $.CONSUME(isEqual) },
                { ALT: () => $.CONSUME(And) },
                { ALT: () => $.CONSUME(Gth) },
                { ALT: () => $.CONSUME(Lth) },
            ])
            tabcount--;
        })
        this.performSelfAnalysis()
    }
}

const parserInstance = new parser();

///
const path = require("path")
const fs = require("fs")
const chevrotain = require("chevrotain")

const serializedGrammar = parserInstance.getSerializedGastProductions()

// create the HTML Text
const htmlText = chevrotain.createSyntaxDiagramsCode(serializedGrammar)

// Write the HTML file to disk
const outPath = path.resolve(__dirname, "./")
fs.writeFileSync(outPath + "/generated_diagrams.html", htmlText)
/////////

module.exports = {
    parserInstance: parserInstance,

    parser: parser,

    parse: function (inputText, cb) {
        const lexResult = lexer.lex(inputText)
        if (lexResult.err) {
            return cb(lexResult.err);
        }
        // ".input" is a setter which will reset the parser's internal's state.
        parserInstance.input = lexResult.tokens
        console.log(mulStr('=', 80));
        console.log('Simplified view:');
        let syntaxResult = parserInstance.Program()
        //console.log(util.inspect(syntaxResult, { compact: false, depth: 100, breakLength: 80 }))
        /* console.log(mulStr('=', 80));
        console.log('Detailed view in JSON format:');

        console.log(JSON.stringify(syntaxResult)) */
        if (parserInstance.errors.length > 0) {
            return cb(parserInstance.errors, null);
        }
        cb(null, syntaxResult);
    }
}


function mulStr(str = '-', n = 0) {
    let res = str;
    while (n > 0) {
        res += str;
        n--;
    }
    return res;
}