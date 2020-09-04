import * as Blockly from "blockly/core";
import "blockly/python";
import * as utils from "./utils/utils";
import { load as module_load } from "./blocks/module/module";
import { load as module_connection_load } from "./blocks/module_connection/module_connection";
import { load as create_signal_load } from "./blocks/create_signal/create_signal";
import { load as signal_getter_load } from "./blocks/signal_getter/signal_getter";
import { load as connections_designer_load } from "./blocks/connections_designer/connections_designer";
import { load as splitter_loader } from "./blocks/splitter/splitter";
import { load as concat_loader } from "./blocks/concat/concat";
import { load as assign_loader } from "./blocks/assign/assign";
import { load as bits_select_loader } from "./blocks/bits_select/bits_select";
import { load as NAND_loader } from "./blocks/NAND/NAND";

// TODO: this should be able to search for logic models in logic directory
import { load as AND_loader } from "./logic/AND/AND";
import { load as OR_loader } from "./logic/OR/OR";
import { load as XOR_loader } from "./logic/XOR/XOR";
import { load as NOR_loader } from "./logic/NOR/NOR";
import { load as NOT_loader } from "./logic/NOT/NOT";

export function prepareCircuitlyBlocks(
    blocklyDiv: string,
    workspaceId: string,
    toolboxId: string
) {
    //////////////////////////////////////////////////////////////////////////////
    // Blockly setup

    // Get toolbox and workspace
    let toolbox = document.getElementById(toolboxId);
    let workspaceBlocks = document.getElementById(workspaceId);

    // Inject blockly workspace
    let options = {
        toolbox: toolbox,
        collapse: true,
        comments: true,
        disable: true,
        maxBlocks: Infinity,
        trashcan: true,
        horizontalLayout: false,
        toolboxPosition: "start",
        css: true,
        media: "https://blockly-demo.appspot.com/static/media/",
        rtl: false,
        scrollbars: true,
        sounds: true,
        oneBasedIndex: true
    };

    let workspace = Blockly.inject(blocklyDiv, options);
    // TODO: create a more suitable theme. Reference
    // https://developers.google.com/blockly/guides/configure/web/themes
    workspace.setTheme((Blockly as any).Themes.Dark);

    // Load circuitly blocks
    module_load(workspace);
    module_connection_load(workspace);
    create_signal_load(workspace);
    signal_getter_load(workspace);
    connections_designer_load(workspace);
    splitter_loader(workspace);
    concat_loader(workspace);
    assign_loader(workspace);
    bits_select_loader(workspace);
    NAND_loader(workspace);

    AND_loader(workspace);
    NOT_loader(workspace);
    OR_loader(workspace);
    XOR_loader(workspace);
    NOR_loader(workspace);

    // Load blocks to workspace
    Blockly.Xml.domToWorkspace(workspaceBlocks, workspace);
}
