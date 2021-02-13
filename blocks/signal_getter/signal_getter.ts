import * as Blockly from "blockly/core";
import "blockly/python";
import * as utils from "../../utils/utils";
import { BaseBlock } from "../base/base";

export class SignalGetterBlock extends BaseBlock {
    name = "signal_getter";

    init = function() {
        this.first = true;
        this.appendDummyInput()
            .appendField("")
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
            );
        this.appendDummyInput().appendField(
            new Blockly.FieldDropdown(this.makeSignalList.bind(this)),
            "SIGNAL_NAME"
        );
        this.setInputsInline(true);
        this.setOutput(true, "SIGNAL");
        this.setColour(utils.COLOUR_1BIT);
        this.setTooltip("");
        this.setHelpUrl("");
    };

    onchange = function() {
        ///////////////////////////////////////////////////////////
        // TODO check next Blockly version cf issue
        // https://github.com/google/blockly/issues/2926
        // On first time this block is created by domToWorkspace, UI will
        // show INVALID_SIGNAL even with correct dropdown value. Force UI
        // to show default value from the block being imported to
        // workspace by rendering all entries in dropdown and then
        // setting the correct one.
        // This causes a warning on new blocks that are from
        // domToWorkspace, but no incorrect behavior occurs in this case.
        // see https://github.com/lcbcFoo/circuitly/issues/3
        if (this.first) {
            this.first = false;
            let v = this.getFieldValue("SIGNAL_NAME");
            let fields = this.getField("SIGNAL_NAME").getOptions(false);
            for (let i = 0; i < fields.length && i < 2; i++) {
                this.getField("SIGNAL_NAME").setValue(fields[i][0]);
            }
            this.getField("SIGNAL_NAME").setValue(v);
        }
        ///////////////////////////////////////////////////////////

        // Update color depending on size selected
        let size = this.getFieldValue("SIZE_SELECTION");
        let colour = utils.getSignalColour(size);

        this.setColour(colour);
    }

    makeSignalList() {
        // Is attached to a module
        let root = this.getRootBlock();
        if (root.type === "module") {
            return (root as any).makeSignalList(
                this.getFieldValue("SIZE_SELECTION")
            );
        }

        // Not attached to any module yet
        return [["<invalid signal>", "SIGNAL_INVALID"]];
    }

    blocklyToSystemVerilog(block: Blockly.Block): string | any[] {
        let dropdown_size_selection = block.getFieldValue("SIZE_SELECTION");
        let dropdown_signal_name = block.getFieldValue("SIGNAL_NAME");
        // TODO: Assemble Python into code variable.
        let code = dropdown_signal_name;
        // TODO: Change ORDER_NONE to the correct strength.
        return [code, (Blockly as any).Python.ORDER_ATOMIC];
    }
}
