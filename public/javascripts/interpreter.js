


function getType(token) {
    switch (true) {
        case /^#m\d+$/.test(token):
            return 'label'
        case /([a-zA-Z]|_|\$)(\w*\d*_*\$*)*/.test(token):
            return 'ident';
        case /0|-?[1-9]\d*/.test(token):
            return 'number';
        case /-?[0-9]\d*(\.\d*)?/.test(token):
            return 'number'
    }
    return 'error';
}

function interpreter(input) {
    // input is an array of tokens : operands, operators, labels and jump commands 
    let stack = [];
    let indentsTable = {};
    let labels = {};
    // filling labels dictionary
    input.forEach((token, index) => {
        if (/^#m\d+$/.test(token)) {
            if (input[index + 1] === ':') {
                labels[token] = {
                    index
                }
            }
        }
    })

    let currentIndex = 0;
    let keywords = {
        "print": {
            process: function () {
                let token = stack.pop();
                switch (token.type) {
                    case 'ident':
                        if (typeof indentsTable[token.str] === 'undefined') {
                            // @error 
                        } else {
                            console.log(indentsTable[token.str]);
                        }
                        break;
                    case 'number':
                        console.log(token.str);
                        break;
                    default:
                    //@error
                }
            }
        },
        "scan": {
            process: function () {
                let token = stack.pop();
                if (token.type !== "ident") {
                    // @error
                    return;
                }
                let buffer = prompt(`Enter the value for ${token.str}`);
                while (isNaN(parseFloat(buffer))) {
                    buffer = prompt(`Enter the value for ${token.str}`);
                }
                indentsTable[token.str] = parseFloat(buffer);
            }
        },
        "#JF": {
            process: function () {
                let token = stack.pop();
                let tokenPrev = stack.pop();
                if (token.type !== "label") {
                    // @error
                    return;
                }
                if (!labels[token.str]) {
                    // @error
                    return;
                }
                if (tokenPrev.type == "ident") {
                    if (indentsTable[tokenPrev.str]) {
                        if (!isNan(parseFloat(indentsTable[tokenPrev.str]))) {
                            if (parseFloat(indentsTable[tokenPrev.str])) {
                                currentIndex = labels[token.str].index + 1;
                            }
                        } else {
                            // @error
                            return;
                        }
                    } else {

                    }
                }
                if (tokenPrev.type == "number") {
                    if (!parseFloat(tokenPrev.str)) {
                        currentIndex = labels[token.str].index + 1;
                    }
                } else {
                    // @error
                    return;
                }
            }
        },
        "#JMP": {
            process: function () {
                let token = stack.pop();
                if (token.type !== 'label') {
                    // @error
                    return;
                }
                if (!labels[token.str]) {
                    // @error
                    return;
                }
                currentIndex = labels[token.str].index + 1;
            }
        },
        "=": {
            process: function () {
                let token = stack.pop();
                let tokenIdent = stack.pop();
                if (token.type !== 'number') {
                    // @error
                    return;
                }
                if (tokenIdent.type !== 'ident') {
                    // @error
                    return;
                }
                indentsTable[tokenIdent.str] = parseFloat(token.str);
            }
        },
        "<": {
            process: function () {
                let token = stack.pop();
                let tokenPrev = stack.pop();

                let a;
                let b;

                if (token.type == "ident") {
                    if (typeof indentsTable[token.str] === undefined) {
                        // @error
                        return;
                    }
                    a = parseFloat(indentsTable[token.str]);
                } else if (token.type == "number") {
                    a = parseFloat(token.str);
                }

                if (tokenPrev.type == "ident") {
                    if (typeof indentsTable[tokenPrev.str] === undefined) {
                        // @error
                        return;
                    }
                    b = parseFloat(indentsTable[tokenPrev.str]);
                } else if (tokenPrev.type == "number") {
                    b = parseFloat(tokenPrev.str);
                }
                stack.push({ type: 'number', str: (b < a) ? 1 : 0 });
            }
        },
        ">": {
            process: function () {
                let token = stack.pop();
                let tokenPrev = stack.pop();

                let a;
                let b;

                if (token.type == "ident") {
                    if (typeof indentsTable[token.str] === undefined) {
                        // @error
                        return;
                    }
                    a = parseFloat(laindentsTablebels[token.str]);
                } else if (token.type == "number") {
                    a = parseFloat(token.str);
                }

                if (tokenPrev.type == "ident") {
                    if (typeof indentsTable[tokenPrev.str] === undefined) {
                        // @error
                        return;
                    }
                    b = parseFloat(indentsTable[tokenPrev.str]);
                } else if (tokenPrev.type == "number") {
                    b = parseFloat(tokenPrev.str);
                }
                stack.push({ type: 'number', str: (b > a) ? 1 : 0 });
            }
        },
        "+": {
            process: function () {
                let token = stack.pop();
                let tokenPrev = stack.pop();

                let a;
                let b;

                if (token.type == "ident") {
                    if (typeof indentsTable[token.str] === undefined) {
                        // @error
                        return;
                    }
                    a = parseFloat(indentsTable[token.str]);
                } else if (token.type == "number") {
                    a = parseFloat(token.str);
                }

                if (tokenPrev.type == "ident") {
                    if (typeof indentsTable[tokenPrev.str] === undefined) {
                        // @error
                        return;
                    }
                    b = parseFloat(indentsTable[tokenPrev.str]);
                } else if (tokenPrev.type == "number") {
                    b = parseFloat(tokenPrev.str);
                }
                stack.push({ type: 'number', str: a + b });
            },
        },
        "-": {
            process: function () {
                let token = stack.pop();
                let tokenPrev = stack.pop();

                let a;
                let b;

                if (token.type == "ident") {
                    if (typeof indentsTable[token.str] === undefined) {
                        // @error
                        return;
                    }
                    a = parseFloat(indentsTable[token.str]);
                } else if (token.type == "number") {
                    a = parseFloat(token.str);
                }

                if (tokenPrev.type == "ident") {
                    if (typeof indentsTable[tokenPrev.str] === undefined) {
                        // @error
                        return;
                    }
                    b = parseFloat(indentsTable[tokenPrev.str]);
                } else if (tokenPrev.type == "number") {
                    b = parseFloat(tokenPrev.str);
                }
                stack.push({ type: 'number', str: b - a });
            }
        },
        "!": {

        },
        "*": {
            process: function () {
                let token = stack.pop();
                let tokenPrev = stack.pop();

                let a;
                let b;

                if (token.type == "ident") {
                    if (typeof indentsTable[token.str] === undefined) {
                        // @error
                        return;
                    }
                    a = parseFloat(indentsTable[token.str]);
                } else if (token.type == "number") {
                    a = parseFloat(token.str);
                }

                if (tokenPrev.type == "ident") {
                    if (typeof indentsTable[tokenPrev.str] === undefined) {
                        // @error
                        return;
                    }
                    b = parseFloat(indentsTable[tokenPrev.str]);
                } else if (tokenPrev.type == "number") {
                    b = parseFloat(tokenPrev.str);
                }
                stack.push({ type: 'number', str: a * b });
            }
        },
        "/": {
            process: function () {
                let token = stack.pop();
                let tokenPrev = stack.pop();

                let a;
                let b;

                if (token.type == "ident") {
                    if (typeof indentsTable[token.str] === undefined) {
                        // @error
                        return;
                    }
                    a = parseFloat(indentsTable[token.str]);
                } else if (token.type == "number") {
                    a = parseFloat(token.str);
                }

                if (tokenPrev.type == "ident") {
                    if (typeof indentsTable[tokenPrev.str] === undefined) {
                        // @error
                        return;
                    }
                    b = parseFloat(indentsTable[tokenPrev.str]);
                } else if (tokenPrev.type == "number") {
                    b = parseFloat(tokenPrev.str);
                }
                stack.push({ type: 'number', str: b * a });
            }
        },
        "~": {

        },
        "||": {
            process: function () {
                let token = stack.pop();
                let tokenPrev = stack.pop();

                let a;
                let b;

                if (token.type == "ident") {
                    if (typeof indentsTable[token.str] === undefined) {
                        // @error
                        return;
                    }
                    a = parseFloat(indentsTable[token.str]);
                } else if (token.type == "number") {
                    a = parseFloat(token.str);
                }

                if (tokenPrev.type == "ident") {
                    if (typeof indentsTable[tokenPrev.str] === undefined) {
                        // @error
                        return;
                    }
                    b = parseFloat(indentsTable[tokenPrev.str]);
                } else if (tokenPrev.type == "number") {
                    b = parseFloat(tokenPrev.str);
                }
                stack.push({ type: 'number', str: (b || a) ? 1 : 0 });
            }
        },
        "&&": {
            process: function () {
                let token = stack.pop();
                let tokenPrev = stack.pop();

                let a;
                let b;

                if (token.type == "ident") {
                    if (typeof indentsTable[token.str] === undefined) {
                        // @error
                        return;
                    }
                    a = parseFloat(indentsTable[token.str]);
                } else if (token.type == "number") {
                    a = parseFloat(token.str);
                }

                if (tokenPrev.type == "ident") {
                    if (typeof indentsTable[tokenPrev.str] === undefined) {
                        // @error
                        return;
                    }
                    b = parseFloat(indentsTable[tokenPrev.str]);
                } else if (tokenPrev.type == "number") {
                    b = parseFloat(tokenPrev.str);
                }
                stack.push({ type: 'number', str: (b && a) ? 1 : 0 });
            }
        },
        "==": {

        }

    }
    while (currentIndex < input.length) {
        // looking what's the type of current token

        const currentToken = input[currentIndex];
        // checking if it's an operator;
        if (keywords[currentToken]) {
            keywords[currentToken].process();
        } else {
            let type = getType(currentToken);
            switch (type) {
                case "ident":
                    stack.push({ type: 'ident', str: currentToken });
                    break;
                case "number":
                    stack.push({ type: 'number', str: currentToken });
                    break;
                case "label":
                    if (input[currentIndex + 1] == ":") {
                        currentIndex += 2;
                        continue;
                    } else {
                        stack.push({ type: 'label', str: currentToken });
                    }
                    break;
            }
        }
        currentIndex += 1;
    }
}