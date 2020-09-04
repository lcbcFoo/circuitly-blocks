import * as Blockly from "blockly/core"; 
import "blockly/python";
import  * as utils  from '../../utils/utils'

export function load(workspace) {
    // Define module
    Blockly.Blocks['module'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldTextInput("module_name"), "NAME");
            this.appendDummyInput()
                .appendField("Connections");
            this.appendStatementInput("CONNECTIONS")
                .setCheck("CONNECTION");
            this.appendDummyInput()
                .appendField("Internal signals");
            this.appendStatementInput("SIGNALS")
                .setCheck("SIGNAL");
            this.appendDummyInput()
                .appendField("Implementation");
            this.appendStatementInput("IMPLEMENTATION")
                .setCheck("LOGIC");
            this.setInputsInline(false);
            this.setColour(utils.COLOUR_MODULE);
            this.setTooltip("Build an and block. Should output C = A AND B");
            this.setHelpUrl("");
            this.setMutator(new Blockly.Mutator(['module_connection']));

            this.connections = [];
            this.declaredSignals = [[], [], [], [], [], [], []];
            this.isMenuOpen = false;
            this.nameRegex = new RegExp('^[a-zA-Z\_\][\w\_]*$')
        },
        /**
         * Create XML to represent whether the 'pxchecked' should be present.
         * @return {Element} XML storage element.
         * @this Blockly.Block
         */
        mutationToDom: function() {
            let container = document.createElement('mutation');
            return container;
        },
        /**
         * Parse XML to restore the 'pxchecked'.
         * @param {!Element} xmlElement XML storage element.
         * @this Blockly.Block
         */
        domToMutation: function(xmlElement) {
        },
        decompose: function(workspace) {
            this.isMenuOpen = true;
            let topBlock = workspace.newBlock('connections_designer');
            topBlock.initSvg();
            let nextConn = topBlock.getInput('CONNECTIONS').connection

            let connections = this.connections;
            for (let i = 0; i < connections.length; i++) {
                let newBlock = workspace.newBlock('module_connection');
                newBlock.initSvg();
                newBlock.render();
                newBlock.getField('NAME').setValue(connections[i]['name']);
                newBlock.getField('TYPE_SELECTION').setValue(connections[i]['type']);
                newBlock.getField('SIZE_SELECTION').setValue(connections[i]['size']);
                nextConn.connect(newBlock.previousConnection);
                nextConn = newBlock.nextConnection;
            }

            return topBlock;
        },
        compose: function(topBlock) {
            this.isMenuOpen = false;
            let nextConn = topBlock.getInput('CONNECTIONS').connection;
            let connections = [];
            while (nextConn && nextConn.targetBlock()) {
                let connectionBlock = nextConn.targetBlock();
                let type = connectionBlock.getFieldValue('TYPE_SELECTION');
                let size = connectionBlock.getFieldValue('SIZE_SELECTION');
                let name = connectionBlock.getFieldValue('NAME');
                connections.push({'type' : type, 'size' : size, 'name' : name});
                nextConn = connectionBlock.nextConnection;
            }

            this.updateShape_(connections);
        },

        updateShape_: function(connections) {
            // Make sure there are no connections
            this.cleanOldConnections_();

            let nextConn = this.getInput('CONNECTIONS').connection;

            // Loop through all connections creating their blocks.
            for (let i = 0; i < connections.length; i++) {
                let newBlock = workspace.newBlock('module_connection');
                newBlock.initSvg();
                newBlock.render();
                newBlock.getField('NAME').setValue(connections[i]['name']);
                newBlock.getField('TYPE_SELECTION').setValue(connections[i]['type']);
                newBlock.getField('SIZE_SELECTION').setValue(connections[i]['size']);
                connections[i]['block'] = newBlock;
                nextConn.connect(newBlock.previousConnection);
                nextConn = newBlock.nextConnection;
            }

            // Lastly, register in the module block its connections
            this.connections = connections;
        },
        cleanOldConnections_: function() {
            for (let i = 0; i < this.connections.length; i++) {
                this.connections[i]['block'].dispose(true);
            }
        },
        saveConnections: function(containerBlock) {
        },
        onchange: function() {
            // Update connections (inputs/outputs)
            let connections = [];
            let nextConn = this.getInput('CONNECTIONS').connection;
            while (nextConn.targetBlock() != null) {
                let block = nextConn.targetBlock();
                let type = block.getFieldValue('TYPE_SELECTION');
                let size = block.getFieldValue('SIZE_SELECTION');
                let name = block.getFieldValue('NAME');
                connections.push({'type' : type, 'size' : size, 
                    'name' : name, 'block' : block});
                nextConn = block.nextConnection;
            }
            this.connections = connections;

            // Update declared signals
            let declaredSignals = [];
            nextConn = this.getInput('SIGNALS').connection;
            while (nextConn.targetBlock() != null) {
                let block = nextConn.targetBlock();
                let size = block.getFieldValue('SIZE_SELECTION');
                let name = block.getFieldValue('NAME');
                declaredSignals.push({'size' : size, 'name' : name,
                    'block' : block});
                nextConn = block.nextConnection;
            }
            this.declaredSignals = declaredSignals;
        },
        signalExists: function(name) {
            // Check if a declared signal has that name
            for (let i = 0; i < this.declaredSignals.length; i++) {
                for (let j = 0; j < this.declaredSignals[i].length; j++) {
                    if (this.declaredSignals[i][j].name === name) {
                        return [true, 'signal', this.declaredSignals[i][j]];
                    }
                }
            }

            // Check if a connection has that name
            for (let i = 0; i < this.connections.length; i++) {
                if (this.connections[i]['name'] === name) {
                    return [true, 'connection', this.connections[i]]; 
                }
            }

            return [false, 'none', {}];
        },
        isValidName: function(name) {
            if (!this.nameRegex.test(name)) {
                return false;
            }

            let exists = this.signalExists(name);

            if (exists[0]) {
                return false;
            }
            return true;
        },
        getSvDependencies: function() {
            let descendants = this.getDescendants();
            console.log(descendants);
            let deps = [];

            // List types of descendants excluding those which are reserved
            // type.
            for (let i = 0; i < descendants.length; i++) {
                console.log(descendants[i].type)
                if (!utils.reservedTypes.includes(descendants[i].type)) {
                    deps.push(descendants[i].type);
                }
            }
            return deps;
        },
        getConnections: function() {
            return this.connections;
        },
        makeSignalList: function(size) {
            let signals = []
            // List connections
            for (let i = 0; i < this.connections.length; i++) {
                if (this.connections[i].size === size) {
                    let name = this.connections[i].name;
                    signals.push([name, name]);
                }
            }
            // List signals
            for (let i = 0; i < this.declaredSignals.length; i++) {
                if (this.declaredSignals[i].size === size) {
                    let name = this.declaredSignals[i].name;
                    signals.push([name, name]);
                }
            }

            // If there is at least one valid signal
            if (signals.length > 0) {
                return signals;
            }

            return [['<no valid signal>', 'SIGNAL_INVALID']];
        }
    };

    (Blockly as any).Python['module'] = function(block) {
        console.log(block);
        let text_name = block.getFieldValue('NAME');
        let statements_connections = (Blockly as any).Python.statementToCode(block, 'CONNECTIONS');
        let statements_signals = (Blockly as any).Python.statementToCode(block, 'SIGNALS');
        let statements_implementation = (Blockly as any).Python.statementToCode(block, 'IMPLEMENTATION');
        // TODO: Assemble Python into code variable.
        let code = 'module ' + text_name + '(\n';
        // Compose input/outputs declarations
        let conns = block.connections;
        for (let i = 0; i < conns.length; i++) {
            code += '    ';
            let type = conns[i]['type'];
            let size = conns[i]['size'];
            let name = conns[i]['name'];
            let bitLen = utils.getSignalBitLen(size);

            if (bitLen === 1) {
                if (type === "TYPE_INPUT") {
                    code += 'input ' + name;
                }
                else {
                    code += 'output ' + name;
                }
            }
            else {
                if (type === "TYPE_INPUT") {
                    code += 'input [' + (bitLen - 1) + ':0] ' + name;
                }
                else {
                    code += 'output [' + (bitLen - 1) + ':0] ' + name;
                }
            }

            if (i < conns.length - 1) {
                code += ',';
            }
            code += '\n';
        }
        code += ');\n\n';

        // Declare signals
        let signals = this.declaredSignals
        for (let i = 0; i < signals.length; i++) {
            let size = signals[i]['size'];
            let name = signals[i]['name'];
            let bitLen = utils.getSignalBitLen(size);
            code += '    wire ';
            if (bitLen === 1) {
                code += name;
            }
            else {
                code += '[' + (bitLen - 1) + ':0] ' + name;
            }
            code += ';\n'

        }
        if (signals.length >= 1) {
            code += '\n\n';
        }
        code += statements_implementation + '\n';
        code += 'endmodule';

        // Generate new blockly block to instantiate module
        // code += '\n\ntest block instantiation gen\n\n'

        // // Block definition
        // code += 'Blockly.Blocks[\'' + text_name + '\'] = {\n' +
        //         '   init: function() {\n' +
        //         '       this.appendDummyInput()\n' +
        //         '           .appendField(\"' + text_name + '\");\n';

        // for (let i = 0; i < conns.length; i++) {
        //     let type = conns[i]['type'];
        //     let size = conns[i]['size'];
        //     let name = conns[i]['name'];
        //     let bitLen = utils.getSignalBitLen(size);
        //     let tip = '';
        //     if (type === "TYPE_INPUT") {
        //         tip = 'in';
        //     }
        //     else {
        //         tip = 'out'
        //     }
        //     let label = tip + ' ' + name;
        //     code += '       this.appendValueInput(\"' + name + '\")\n';
        //     code += '           .setCheck(\"SIGNAL\")\n';
        //     code += '           .appendField(\"' + label + '\");\n';
        // }

        // code += '       this.setInputsInline(true);\n' +
        //         '       this.setPreviousStatement(true, "LOGIC");\n' +
        //         '       this.setNextStatement(true, "LOGIC");\n' +
        //         '       this.setColour(90);\n' + 
        //         '       this.setTooltip(\"' + text_name + '\");\n' + 
        //         '       this.setHelpUrl("");\n' + 
        //         '   }\n' + 
        //         '};\n\n';

        // // Block code generation
        // code += '(Blockly as any).Python[\"' + text_name + '\"] = function(block) {\n';
        // code += '    let block_name = utils.get_temp_name(\"' + text_name + '\");\n';
        // code += '    let code = \"  ' + text_name + ' \" + block_name + \"(\";\n';
        
        // // Generate all variables
        // for (let i = 0; i < conns.length; i++) {
        //     let type = conns[i]['type'];
        //     let size = conns[i]['size'];
        //     let name = conns[i]['name'];
        //     let bitLen = utils.getSignalBitLen(size);
        //     let varName = 'val_' + name;
        //     code += '    let ' + varName + ' = ' +
        //         '(Blockly as any).Python.valueToCode(block, \"' + name + '\", ' +
        //         '(Blockly as any).Python.ORDER_ATOMIC);\n';
        //     code += '    code += ' + varName + ';\n';

        //     if (i < conns.length - 1) {
        //         code += '    code += \", \"\n';
        //     }
        //     else {
        //         code += '    code += \");\n\";\n';
        //     }
        // }
        // code += '    return code';
        // code += '}'
        return code;
    };
}
