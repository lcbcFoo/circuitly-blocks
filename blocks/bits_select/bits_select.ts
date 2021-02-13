import * as Blockly from "blockly/core"; 
import "blockly/python";
import * as utils from "../../utils/utils";
import {BaseBlock} from "../base/base";

export class BitsSelectBlock extends BaseBlock {
    name = 'bits_select';

    init = function() {
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

    blocklyToSystemVerilog(block: Blockly.Block) {
    let value_dest = (Blockly as any).Python.valueToCode(block, 'dest', (Blockly as any).Python.ORDER_ATOMIC);
    let value_src = (Blockly as any).Python.valueToCode(block, 'src', (Blockly as any).Python.ORDER_ATOMIC);
    let number_bit_higher = block.getFieldValue('bit_higher');
    let number_bit_lower = block.getFieldValue('bit_lower');
    let code = 'assign ' + value_dest + ' = ' + value_src;
    // TODO: check if bits numbers are valid
    code += ' [' + number_bit_higher + ':' + number_bit_lower + '];\n';
    return code;
    }
}
