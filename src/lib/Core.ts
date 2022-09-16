import Defaults from "./Defaults.js";
import {nodetextedit} from "./NodeTextEdit.js";

export function register(this: any, options: any){
    console.log("Core.ts - register", options, this);
    options['cy'] = this;
    options = Defaults.assignDefaults(options);
    return nodetextedit(options);
}