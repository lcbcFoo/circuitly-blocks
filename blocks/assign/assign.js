import * as Blockly from "blockly/core";
import "blockly/python";
import * as utils from "../../utils/utils";
export function load(workspace) {
    Blockly.Blocks["assign"] = {
        init: function () {
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
    Blockly.Python["assign"] = function (block) {
        var value_dest = Blockly.Python.valueToCode(block, "dest", Blockly.Python.ORDER_ATOMIC);
        var value_src = Blockly.Python.valueToCode(block, "src", Blockly.Python.ORDER_ATOMIC);
        var code = "assign " + value_dest + " = " + value_src + ";\n";
        return code;
    };
}
//# sourceMappingURL=assign.js.map