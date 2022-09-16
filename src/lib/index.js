import * as core from "$lib/Core";
 
import {default as cytoscape} from 'cytoscape';

export default function register(){
    
    cytoscape('core', 'nodetextedit', core.register);
  }