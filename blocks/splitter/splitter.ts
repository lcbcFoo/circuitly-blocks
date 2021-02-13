import * as Blockly from "blockly/core";
import "blockly/python";
import * as utils from "../../utils/utils";
import { BaseBlock } from "../base/base";

export class SplitterBlock extends BaseBlock {
    name = "splitter";

    init = function() {
        this.appendDummyInput().appendField("split");
        this.appendValueInput("source").setCheck("SIGNAL");
        this.appendDummyInput().appendField("into");
        this.appendValueInput("target_1").setCheck("SIGNAL");
        this.appendDummyInput().appendField("+");
        this.appendValueInput("target_2").setCheck("SIGNAL");
        this.setInputsInline(true);
        this.setPreviousStatement(true, "LOGIC");
        this.setNextStatement(true, "LOGIC");
        this.setColour(utils.COLOUR_SPLITTER);
        this.setTooltip("Split in half a signal into 2 other signals.");
        this.setHelpUrl("");

        // TODO: add sizes validator
    };

    blocklyToSystemVerilog(block: Blockly.Block): string | any[] {
        let value_source = (Blockly as any).Python.valueToCode(
            block,
            "source",
            (Blockly as any).Python.ORDER_ATOMIC
        );
        let value_target_1 = (Blockly as any).Python.valueToCode(
            block,
            "target_1",
            (Blockly as any).Python.ORDER_ATOMIC
        );
        let value_target_2 = (Blockly as any).Python.valueToCode(
            block,
            "target_2",
            (Blockly as any).Python.ORDER_ATOMIC
        );

        let sourceBlock = block.getInput("source").connection.targetBlock();
        let t1_block = block.getInput("target_1").connection.targetBlock();
        let t2_block = block.getInput("target_2").connection.targetBlock();
        let sourceBitLen: number;

        if (sourceBlock) {
            let sizeSource = sourceBlock.getFieldValue("SIZE_SELECTION");
            let sourceBitLen = utils.getSignalBitLen(sizeSource);
        } else {
            return "";
        }
        if (t1_block) {
            let size_t1 = t1_block.getFieldValue("SIZE_SELECTION");
        } else {
            return "";
        }
        if (t2_block) {
            let size_t2 = t2_block.getFieldValue("SIZE_SELECTION");
        } else {
            return "";
        }

        let code =
            "  assign " +
            value_target_1 +
            " = " +
            value_source +
            "[" +
            (sourceBitLen - 1) +
            ":" +
            sourceBitLen / 2 +
            "];\n";
        code +=
            "  assign " +
            value_target_2 +
            " = " +
            value_source +
            "[" +
            (sourceBitLen / 2 - 1) +
            ":0];\n";
        return code;
    }
}
