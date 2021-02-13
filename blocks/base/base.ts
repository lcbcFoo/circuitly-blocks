import * as Blockly from "blockly/core"; 
import "blockly/python";
import * as utils from "../../utils/utils";

export interface SVFile {
    filename: string;
    content: string;
    declaredModules: string[];
}

export class BaseBlock extends Blockly.Block {
    public static displayName: string;

    public static blocklyToSystemVerilog(block: Blockly.Block): string | any[] {
        return ''
    }

    public static injectBlock(): void {
        Blockly.Blocks[this.displayName] = this;
        (Blockly as any).Python[this.displayName] = this.blocklyToSystemVerilog;
    }
}

export abstract class InstantiationBlock extends BaseBlock {
    declarationSVFile: SVFile;

    getDeclarationSvFile(): SVFile {
        return this.declarationSVFile;
    }
}
