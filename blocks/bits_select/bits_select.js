import * as Blockly from "blockly/core";
import "blockly/python";
import * as utils from "../../utils/utils";
export function load(workspace) {
    Blockly.Blocks['bits_select'] = {
        init: function () {
            this.appendValueInput("dest")
                .setCheck("SIGNAL")
                .appendField("assign");
            this.appendValueInput("src")
                .setCheck("SIGNAL")
                .appendField("=");
            this.appendDummyInput()
                .appendField("[")
                .appendField(new Blockly.FieldNumber(0, 0, 64, 1), "bit_higher");
            this.appendDummyInput()
                .appendField(":")
                .appendField(new Blockly.FieldNumber(0, 0, 64, 1), "bit_lower")
                .appendField("]");
            this.setInputsInline(true);
            this.setPreviousStatement(true, "LOGIC");
            this.setNextStatement(true, "LOGIC");
            this.setColour(utils.COLOUR_BITS_SELECT);
            this.setTooltip("Assign inner bits from a wider signal to another.");
            this.setHelpUrl("");
        }
    };
}
Blockly.Python['bits_select'] = function (block) {
    var value_dest = Blockly.Python.valueToCode(block, 'dest', Blockly.Python.ORDER_ATOMIC);
    var value_src = Blockly.Python.valueToCode(block, 'src', Blockly.Python.ORDER_ATOMIC);
    var number_bit_higher = block.getFieldValue('bit_higher');
    var number_bit_lower = block.getFieldValue('bit_lower');
    var code = 'assign ' + value_dest + ' = ' + value_src;
    // TODO: check if bits numbers are valid
    code += ' [' + number_bit_higher + ':' + number_bit_lower + '];\n';
    return code;
};
//# sourceMappingURL=bits_select.js.map