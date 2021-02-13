import * as Blockly from "blockly/core";
import "blockly/python";
import * as utils from "../../utils/utils";
import {BaseBlock} from "../base/base";

export class NandBlock extends BaseBlock {
    name = 'NAND';

    init = function() {
        this.appendDummyInput().appendField("NAND");
        this.appendValueInput("a")
            .setCheck("SIGNAL")
            .appendField("in a");
        this.appendValueInput("b")
            .setCheck("SIGNAL")
            .appendField("in b");
        this.appendValueInput("c")
            .setCheck("SIGNAL")
            .appendField("out c");
        this.setInputsInline(true);
        this.setPreviousStatement(true, "LOGIC");
        this.setNextStatement(true, "LOGIC");
        this.setColour(utils.COLOUR_LOGIC);
        this.setTooltip("NAND");
        this.setHelpUrl("");
    }

    blocklyToSystemVerilog(block: Blockly.Block): string {
        let value_a = (Blockly as any).Python.valueToCode(
            block,
            "a",
            (Blockly as any).Python.ORDER_ATOMIC
        );
        let value_b = (Blockly as any).Python.valueToCode(
            block,
            "b",
            (Blockly as any).Python.ORDER_ATOMIC
        );
        let value_c = (Blockly as any).Python.valueToCode(
            block,
            "c",
            (Blockly as any).Python.ORDER_ATOMIC
        );
        // nand must be used in lower case to invoke the SV primitive
        let name = utils.get_temp_name("nand");
        let code =
            "  nand " +
            name +
            "(" +
            value_c +
            ", " +
            value_b +
            ", " +
            value_a +
            ");\n";
        return code;
    }
}
