import * as Blockly from "blockly/core";
import "blockly/python";
import * as utils from "../../utils/utils";
import { BaseBlock } from "../base/base";

export class ModuleConnectionBlock extends BaseBlock {
    name = 'module_connection';

    init = function() {
        this.appendDummyInput()
            .appendField(
                new Blockly.FieldDropdown([
                    ["input", "TYPE_INPUT"],
                    ["output", "TYPE_OUTPUT"]
                ]),
                "TYPE_SELECTION"
            )
            .appendField(
                new Blockly.FieldDropdown([
                    ["1-bit", "SIGNAL_1BIT"],
                    ["2-bit", "SIGNAL_2BIT"],
                    ["4-bit", "SIGNAL_4BIT"],
                    ["8-bit", "SIGNAL_8BIT"],
                    ["16-bit", "SIGNAL_16BIT"],
                    ["32-bit", "SIGNAL_32BIT"],
                    ["64-bit", "SIGNAL_64BIT"]
                ]),
                "SIZE_SELECTION"
            )
            .appendField(new Blockly.FieldTextInput("connection_name"), "NAME");
        this.setInputsInline(true);
        this.setPreviousStatement(true, "CONNECTION");
        this.setNextStatement(true, "CONNECTION");
        this.setColour(utils.COLOUR_1BIT);
        this.setTooltip("");
        this.setHelpUrl("");
    };

    onchange = function() {
        let size = this.getFieldValue("SIZE_SELECTION");
        let colour = utils.getSignalColour(size);

        this.setColour(colour);
    };

    blocklyToSystemVerilog(block: Blockly.Block): string {
        // Code generation for module connection is handled by Module block
        let dropdown_type_selection = block.getFieldValue("TYPE_SELECTION");
        let dropdown_size_selection = block.getFieldValue("SIZE_SELECTION");
        let value_name = block.getFieldValue("NAME");
        let bitLen = utils.getSignalBitLen(dropdown_size_selection);
        let code = "";
        return code;
    }
}
