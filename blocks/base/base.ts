import * as Blockly from "blockly/core"; 
import "blockly/python";
import * as utils from "../../utils/utils";

export interface SVFile {
    filename: string;
    content: string;
    declaredModules: string[];
}

export class BaseBlock extends Blockly.Block {
    name: string;
    blocklyToSystemVerilog(block: Blockly.Block): string | any[] {
        return ''
    }

    injectBlock(): void {
        Blockly.Blocks[this.name] = this;
        (Blockly as any).Python[this.name] = this.blocklyToSystemVerilog;
    }
}

export abstract class InstantiationBlock extends BaseBlock {
    declarationSVFile: SVFile;

    getDeclarationSvFile(): SVFile {
        return this.declarationSVFile;
    }
}
