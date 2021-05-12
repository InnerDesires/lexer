$(document).ready(() => {
    myCodeMirror = CodeMirror.fromTextArea(document.getElementById('source'), { mode: 'javascript', lineNumbers: true });
    translation = CodeMirror.fromTextArea(document.getElementById('translation'), { mode: 'javascript', lineNumbers: true });
    myCodeMirror.setValue("a = 10\nprint(a)");
    update();
    $("#updateDiagram").click(() => {
        update();
    })

    document.onkeydown = function (e) {
        if (e.ctrlKey && e.keyCode == 13) {
            update();
        }
    }
    diagram.onLoad([]);
});

function update() {
    const source = myCodeMirror.getValue()
    postForTree(source, (err, nodes, data) => {
        if (err) {
            let content = '';
            if (typeof err[0].name === "undefined") {
                content += 'Lexer errors detected:\n';
                for (let i = 0; i < err.length; i++) {
                    content += `${i + 1}. ${err[i].message}, @${err[i].line}:${err[i].column}\n`
                }
            } else {
                content += 'Syntax errors detected:\n';
                for (let i = 0; i < err.length; i++) {
                    content += `${i + 1}. Name: ${err[i].name}, ${err[i].message.replace('\\n', '\n')}\n`,
                        content += `Location: line ${err[i].token.startLine}, column ${err[i].token.startOffset}\n`
                }
            }
            translation.setValue(content);
            diagram.clearData();
            return;
        }
        diagram.updateData(nodes);
        let translationString = '';
        data.RPN.forEach(arr => {
            translationString += arr.join() + '\n';
        })
        translation.setValue(translationString);
        let toInterpreter = [];
        data.RPN.forEach(arr => {
            arr.forEach(token => {
                toInterpreter.push(token);
            });
        })
        interpreter(toInterpreter);
    });
}

function postForTree(source, cb) {
    $.post("/parse_input", { source: source },
        function (res) {
            console.log(`res.err: ${res.err}`)
            console.group("Recieved answer for parsing request:");
            console.group('Request:');
            console.log(source);
            console.groupEnd()
            console.group("Answer:");
            if (res.err) {
                console.log(res.err);
                console.groupEnd()
                console.groupEnd()
                cb(res.err);
                return;
            } else {
                console.group('AST');
                console.log(res.tree);
                console.groupEnd();
                console.group('Reverse Polish Notation:');
                console.log(res.RPN);
                console.groupEnd();
            }
            console.groupEnd()
            console.groupEnd()
            let data = res.tree;
            let nodes = [];
            function traverse(node, parent) {
                let _id = ID();
                nodes.push({ key: _id, parent: parent, name: node.name || `"${node.image}"` });
                if (!node.children) {
                    return
                }
                Object.keys(node.children).forEach(param => {
                    node.children[param].forEach(child => {
                        traverse(child, _id);
                    })
                });
            }
            traverse(data, '');
            cb(res.err, nodes, res);
        });
}

let diagram = {
    onLoad: (nodes) => {
        var $ = go.GraphObject.make;
        var diagram =
            $(go.Diagram, "gojs", {
                "undoManager.isEnabled": true, // enable Ctrl-Z to undo and Ctrl-Y to redo
                layout: $(go.TreeLayout, // specify a Diagram.layout that arranges trees
                    { angle: 90, layerSpacing: 35 })
            });

        diagram.nodeTemplate =
            $(go.Node, "Auto",
                $(go.Shape, "RoundedRectangle", { fill: "white" }),
                $(go.TextBlock, { margin: 10 },
                    new go.Binding("text", "name"))
            );

        diagram.linkTemplate =
            $(go.Link, { routing: go.Link.Orthogonal, corner: 5 },
                $(go.Shape));

        diagram.model = new go.TreeModel(nodes);
        this.diagram = diagram;
    },
    updateData: (nodes) => {
        this.diagram.model = new go.TreeModel(nodes);
        this.diagram.commandHandler.zoomToFit();
    },
    clearData: () => {
        this.diagram.model = new go.TreeModel([]);
        this.diagram.commandHandler.zoomToFit();
    }
}

var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
};