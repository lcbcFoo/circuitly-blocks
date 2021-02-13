import * as Blockly from "blockly/core"; 
import "blockly/python";
import * as utils from "../../utils/utils";
import {BaseBlock} from "../base/base";

export class AssignBlock extends BaseBlock {
    name = 'assign';

    init = function(): void {
        this.appendValueInput("dest")
            .setCheck("SIGNAL")
            .appendField("assign");
        this.appendValueInput("src")
            .setCheck("SIGNAL")
            .appendField("=");
        this.setInputsInline(true);
        this.setPreviousStatement(true, "LOGIC");
        this.setNextStatement(true, "LOGIC");
        this.setColour(utils.COLOUR_ASSIGN);
        this.setTooltip("");
        this.setHelpUrl("");
    }

    blocklyToSystemVerilog(block: Blockly.Block): string {
        let value_dest = (Blockly as any).Python.valueToCode(
            block,
            "dest",
            (Blockly as any).Python.ORDER_ATOMIC
        );
        let value_src = (Blockly as any).Python.valueToCode(
            block,
            "src",
            (Blockly as any).Python.ORDER_ATOMIC
        );
        let code = "assign " + value_dest + " = " + value_src + ";\n";
        return code;
    }
}
