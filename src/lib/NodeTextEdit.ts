import DrawingHelpers from './DrawingHelpers';
import { log } from './Logging';
import type { NodeSingular, Core, EventObjectNode } from 'cytoscape';
export default class NodeTextEdit {
  cy: Core;
  options: any;

  constructor(options: any) {
    log("NodeTextEdit.ts - constructor", options);
    this.options = options;
    this.cy = options['cy'];

    this.addCytoscapeListeners();
  }


  public addCytoscapeListeners() {

    // Show editor on node tap
    this.cy.addListener('tap', 'node', (e: EventObjectNode) => {

      // Close existing box if any open
      this.closeEditBox(this.options);

      let node = e.target;

      log("Node tap event:", e);
      log("Node tapped: ", node);
      log("Node position: ", node.renderedPosition());
      log("Rendered bounding box:", node.renderedBoundingBox());
      log("Rendered style: ", node.renderedStyle());

      if (((node.classes() as unknown) as string[]).includes("eh-handle")) {
        // Don't add edit box for cytoscape-edgehandles handles
        return;
      }

      log("Zoom: ", this.cy.zoom());
      window['cyNodeEditing'] = node;

      let editor = DrawingHelpers.showEditBox(node, this.options, this.cy);
      editor.addEventListener("keyup", ev => {
        if (ev.key == "Escape") {
          log("KeyUp - Escape: ", ev);
          this.closeEditBox(this.options);
        }
      });

    });



    this.cy.addListener('tap', e => {
      if (e.target === this.cy) {
        log("Core tap", (window['cyEditBox'], window['cyNodeEditing']))
        if (window['cyEditBox']) {
          this.closeEditBox(this.options);
        }
      }
    });
    this.cy.addListener('viewport', e => {
      if (e.target === this.cy) {

        if (window['cyEditBox']) {
          log("CY- viewport change - closing overlay");
          this.closeEditBox(this.options);
        }
      }
    }
    );

    this.cy.addListener('destroy', e => {
      if (e.target === this.cy) {

        if (window['cyEditBox']) {
          log("CY- destroy - closing overlay");
          this.closeEditBox(this.options);
        }
      }
    });
  }



  /**
   * Close editing overlay and save text to node
   */
  public closeEditBox(options: any) {
    let div = document.getElementById(window['cyEditBox']);
    log("closeEditBox - div:", div);
    if (!div) {
      window['cyEditBox'] = undefined;
      window['cyNodeEditing'] = undefined;
      return;
    }

    log("closeEditBox", div.innerText);
    if (window['cyNodeEditing']) {

      let itxt = div.innerText;
      log("Text inner:" + itxt);

      window['cyNodeEditing'].data(options.nodeLabel, itxt);
    }
    document.body.removeChild(div);
    window['cyEditBox'] = undefined;
    window['cyNodeEditing'] = undefined;
  }

  public changeEditBoxText(newText: string) {
    if (window['cyEditBox']) {
      let div = document.getElementById(window['cyEditBox']);
      log("changeEditBoxText - div:", div);
      if (div) {
        div.innerText = newText;
      }
    }
  }
}

export function nodetextedit(options: any): NodeTextEdit {
  console.log("NodeTextEdit.ts - nodetextedit", options);
  return new NodeTextEdit(options);
}
