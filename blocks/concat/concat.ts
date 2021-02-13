import * as Blockly from "blockly/core";
import "blockly/python";
import * as utils from "../../utils/utils";
import { BaseBlock } from "../base/base";

export class ConcatBlock extends BaseBlock {
    name = "concat";

    init = function() {
        this.appendDummyInput().appendField("concat");
        this.appendValueInput("source_1").setCheck("SIGNAL");
        this.appendDummyInput().appendField("+");
        this.appendValueInput("source_2").setCheck("SIGNAL");
        this.appendDummyInput().appendField("into");
        this.appendValueInput("target").setCheck("SIGNAL");
        this.setInputsInline(true);
        this.setPreviousStatement(true, "LOGIC");
        this.setNextStatement(true, "LOGIC");
        this.setColour(utils.COLOUR_CONCAT);
        this.setTooltip(
            "Merge two signals of same size into a 2 times larger one."
        );
        this.setHelpUrl("");
    };

    blocklyToSystemVerilog(block: Blockly.Block): string {
        let value_source_1 = (Blockly as any).Python.valueToCode(
            block,
            "source_1",
            (Blockly as any).Python.ORDER_ATOMIC
        );
        let value_source_2 = (Blockly as any).Python.valueToCode(
            block,
            "source_2",
            (Blockly as any).Python.ORDER_ATOMIC
        );
        let value_target = (Blockly as any).Python.valueToCode(
            block,
            "target",
            (Blockly as any).Python.ORDER_ATOMIC
        );

        let targetBlock = block.getInput("target").connection.targetBlock();
        let s1_block = block.getInput("source_1").connection.targetBlock();
        let s2_block = block.getInput("source_2").connection.targetBlock();

        // TODO: Add size restriction and tips
        if (targetBlock) {
            let sizeTarget = targetBlock.getFieldValue("SIZE_SELECTION");
            let targetBitLen = utils.getSignalBitLen(sizeTarget);
        } else {
            return "";
        }
        if (s1_block) {
            let size_s1 = s1_block.getFieldValue("SIZE_SELECTION");
        } else {
            return "";
        }
        if (s2_block) {
            let size_s2 = s2_block.getFieldValue("SIZE_SELECTION");
        } else {
            return "";
        }

        let code =
            "  assign " +
            value_target +
            " = {" +
            value_source_1 +
            ", " +
            value_source_2 +
            "};\n";
        return code;
    }
}
