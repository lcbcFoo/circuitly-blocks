import * as Blockly from "blockly/core"; 
import "blockly/python";
import * as utils from "../../utils/utils";

export function load(workspace) {
    Blockly.Blocks["assign"] = {
        init: function() {
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
    };

    (Blockly as any).Python["assign"] = function(block) {
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
    };
}
