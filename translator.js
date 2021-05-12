const priorityDict = {
    '!': {
        priority: 11,
        orientation: 'left'
    },
    '~': {
        priority: 11,
        orientation: 'left'
    },
    '*': {
        priority: 10,
        orientation: 'left'
    },
    '/': {
        priority: 10,
        orientation: 'left'
    },
    '+': {
        priority: 5,
        orientation: 'left'
    },
    '-': {
        priority: 5,
        orientation: 'left'
    },
    '==': {
        priority: 3,
        orientation: 'left'
    },
    '<': {
        priority: 4,
        orientation: 'left'
    },
    '>': {
        priority: 4,
        orientation: 'left'
    },
    '^': {
        priority: 11,
        orientation: 'right'
    },
    '||': {
        priority: 3,
        orientation: 'left'
    },
    '&&': {
        priority: 3,
        orientation: 'left'
    },
}

function labelCreator() {
    this.index = 0;

    this.getLabel = () => {
        return `#m${this.index++}`
    };
}

let creator = new labelCreator();

function parseStatement(statement) {
    if (statement.name === 'assignStatement') {
        return statementParser[statement.name](statement.children);
    }
    if (statement.name === 'printStatement') {
        return statementParser[statement.name](statement.children);
    }
    if (statement.name === 'scanStatement') {
        return statementParser[statement.name](statement.children);
    }
    if (statement.name === 'ifStatement') {
        return statementParser[statement.name](statement.children);
    }
    if (statement.name === 'forStatement') {
        return statementParser[statement.name](statement.children);
    }
    return [];
}

const statementParser = {
    assignStatement: function (assignStatement) {
        let res = {
            type: 'assignStatement',
            ident: assignStatement.Identifier[0].image,
            expression: expressionParser(assignStatement.Expression[0])
        };
        res.expression.unshift(res.ident);
        res.expression.push('=');
        return res.expression;
    },
    forStatement: function (forStatement) {
        
        let assignStatement = statementParser['assignStatement'](forStatement.assignStatement[0].children);
        let assignIdent = assignStatement[0];
        let Statements = [];
        forStatement.Statement.forEach(statement => {
            let statementType = Object.keys(statement.children)[0];
            Statements.push(parseStatement(statement.children[statementType][0]));
        });
        let To = expressionParser(forStatement.Expression[0]);
        let By = expressionParser(forStatement.Expression[1]);
        let WhileExpression = expressionParser(forStatement.Expression[2]);

        let compareLabel = creator.getLabel();
        let endLabel = creator.getLabel();
        let resRPN = [];

        // building result RPN
        resRPN = resRPN.concat(assignStatement);
        resRPN.push(compareLabel);
        resRPN.push(':');
        resRPN.push(assignIdent);
        resRPN = resRPN.concat(To);
        resRPN.push('<');
        resRPN = resRPN.concat(WhileExpression);
        resRPN.push('&&');
        resRPN.push(endLabel);
        resRPN.push("#JF");
        Statements.forEach(statement => {
            statement.forEach(el => {
                resRPN.push(el);
            })
        })
        resRPN.push(assignIdent);
        resRPN.push(assignIdent);
        resRPN = resRPN.concat(By);
        resRPN.push('+');
        resRPN.push('=');
        resRPN.push(compareLabel);
        resRPN.push('#JMP');
        resRPN.push(endLabel);
        resRPN.push(':');
        return resRPN;
    },
    ifStatement: function (ifStatement) {
        console.log(ifStatement);
        let Expression = expressionParser(ifStatement['Expression'][0]);
        let Statements = [];
        ifStatement.Statement.forEach(statement => {
            let statementType = Object.keys(statement.children)[0];
            Statements.push(parseStatement(statement.children[statementType][0]));
        })
        let label = creator.getLabel();
        let resultArray = [];
        Expression.forEach(el => {
            resultArray.push(el);
        })
        resultArray.push(label);
        resultArray.push("#JF");
        Statements.forEach(statement => {
            statement.forEach(el => {
                resultArray.push(el);
            })
        })
        resultArray.push(label);
        resultArray.push(':');
        return resultArray;
    },
    printStatement: function (printStatement) {
        let res = {
            type: 'printStatement',
            expression: expressionParser(printStatement.Expression[0])
        };
        res.expression.push('print');
        return res.expression;
    },
    scanStatement: function (scanStatement) {
        return [scanStatement['Identifier'][0].image, scanStatement['Scan'][0].image];
    },
}

function expressionParser(expression, builder) {
    if (!builder) {
        let builder = new PolisBuilder();
        traverseExpression(builder);
        return builder.end();
    } else {
        traverseExpression(builder);
    }

    function traverseExpression(builder) {
        operandParser(expression.children.Operand[0], builder);
        for (let i = 1; i < expression.children.Operand.length; i++) {
            operatorParser(expression.children.Operator[i - 1], builder);
            operandParser(expression.children.Operand[i], builder);
        }
    }

}

function operandParser(operand, builder) {
    let operandType = Object.keys(operand.children)[0]
    if (operandType === 'OperandWithUnary') {
        operandWithUnaryParser(operand.children.OperandWithUnary[0], builder);
    } else if (operandType === "OperandSimple") {
        operandSimpleParser(operand.children.OperandSimple[0], builder);
    }
}


function operandSimpleParser(operand, builder) {
    let operandType = Object.keys(operand.children)[0];
    if (operandType === "ParenthisExpression") {
        parenthisExpressionParser(operand.children[operandType][0], builder)
        return;
    }
    if (operandType === "Identifier") {
        builder.next({ type: "operand", str: operand.children[operandType][0].image })
    }
    if (operandType === "Number") {
        let numberType = Object.keys(operand.children[operandType][0].children)[0];
        builder.next({ type: "operand", str: operand.children[operandType][0].children[numberType][0].image })
    }
}

function operatorParser(operator, builder) {
    let operatorType = Object.keys(operator.children)[0];
    builder.next({ type: 'operator', str: operator.children[operatorType][0].image })
}

function operandWithUnaryParser(operand, builder) {
    operandSimpleParser(operand.children['OperandSimple'][0], builder);
    if (operand.children['Not']) {
        builder.next({ type: 'operator', str: '!' })
    }
    if (operand.children['Minus']) {
        builder.next({ type: 'operator', str: '~' })
    }
}

function parenthisExpressionParser(expression, builder) {
    builder.next({ type: "leftBracket", str: '(' });
    expressionParser(expression.children['Expression'][0], builder);
    builder.next({ type: "rightBracket", str: ')' });
}

class PolisBuilder {
    constructor() {
        this.operatorStack = [];
        this.outputQueue = [];
    }
    next(token) {
        switch (token.type) {
            case "operator":
                while (this.operatorStack.length > 0 && this.operatorStack[this.operatorStack.length - 1] !== '(' &&
                    (priorityDict[this.operatorStack[this.operatorStack.length - 1]].priority > priorityDict[token.str].priority ||
                        (priorityDict[this.operatorStack[this.operatorStack.length - 1]].priority === priorityDict[token.str].priority && priorityDict[token.str].orientation === 'left'))) {
                    this.outputQueue.push(this.operatorStack.pop());
                }
                this.operatorStack.push(token.str);
                break;
            case "operand":
                this.outputQueue.push(token.str);
                break;
            case "leftBracket":
                this.operatorStack.push(token.str);
                break;
            case "rightBracket":
                while (this.operatorStack[this.operatorStack.length - 1] !== "(") {
                    this.outputQueue.push(this.operatorStack.pop());
                }
                this.operatorStack.pop();
                break;
        }
    }
    end() {
        while (this.operatorStack.length !== 0)
            this.outputQueue.push(this.operatorStack.pop());
        return this.outputQueue;
    }
}
module.exports = {
    test: function () {
        test();
    },
    translate: function (AST) {
        let statementsArray = [];
        AST.children.Statement.forEach(statement => {
            let statementType = Object.keys(statement.children)[0];
            statementsArray.push(parseStatement(statement.children[statementType][0]));
        })
        return statementsArray;
    }
}


function test() {
    let builder = new PolisBuilder();
    let testExpr = [
        {
            type: 'leftBracket',
            str: '('
        },
        {
            type: 'operand',
            str: '2'
        },
        {
            type: 'operator',
            str: '+'
        },
        {
            type: 'operand',
            str: '4'
        },
        {
            type: 'rightBracket',
            str: ')'
        },
        {
            type: 'operator',
            str: '*'
        },
        {
            type: 'operand',
            str: '6'
        },
    ];
    for (let i = 0; i < testExpr.length; i++) {
        builder.next(testExpr[i]);
    }
    console.log(builder.end());

}
