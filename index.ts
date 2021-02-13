import * as Blockly from "blockly/core";
import "blockly/python";
import * as utils from "./utils/utils";
import {ModuleBlock} from "./blocks/module/module";
import {ModuleConnectionBlock} from "./blocks/module_connection/module_connection";
import {CreateSignalBlock} from "./blocks/create_signal/create_signal";
import {SignalGetterBlock} from "./blocks/signal_getter/signal_getter";
import {ConnectionsDesignerBlock} from "./blocks/connections_designer/connections_designer";
import {SplitterBlock} from "./blocks/splitter/splitter";
import {ConcatBlock} from "./blocks/concat/concat";
import {AssignBlock} from "./blocks/assign/assign";
import {BitsSelectBlock} from "./blocks/bits_select/bits_select";
import {NandBlock} from "./blocks/NAND/NAND";

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
    let moduleBlock = new ModuleBlock();
    moduleBlock.injectBlock(workspace);
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
