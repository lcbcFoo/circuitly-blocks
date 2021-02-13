import * as Blockly from "blockly/core";
import "blockly/python";
import * as utils from "../../utils/utils";
import { BaseBlock } from "../base/base";

export class ConnectionsDesignerBlock extends BaseBlock {
    name = "connections_designer";

    init = function() {
        this.appendDummyInput().appendField("Connections");
        this.appendStatementInput("CONNECTIONS").setCheck("CONNECTION");
        this.setColour(utils.COLOUR_MODULE);
        this.setTooltip("");
        this.setHelpUrl("");
    };

    blocklyToSystemVerilog(block: Blockly.Block): string {
        // The designer only exists in the module "settings" to build the
        // connections and does not generate any SV code
        let code = "";
        return code;
    }
}
