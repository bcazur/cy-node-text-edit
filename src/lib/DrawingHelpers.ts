import { log } from "./Logging";
import type { NodeSingular } from 'cytoscape';

export default class DrawingHelpers {
    public static showEditBox(node: NodeSingular, options: any, cy: cytoscape.Core) {

        log("Showing edit box", cy);

        let cyContainer = cy.container();
        let cyPos = DrawingHelpers.getPosition(cyContainer as HTMLElement);
        log("Cy pos: ", cyPos);

        let pos = node.renderedBoundingBox();
        let style = node.renderedStyle();

        // Create the content-editable div that will allow text edit
        var cont = document.createElement("div");
        cont.id = "edit_" + (new Date()).getTime();

        // Set position  
        cont.style.position = 'fixed';
        cont.style.top = cyPos.y + (pos.y1) + 'px';
        cont.style.minHeight = (pos.h) + 'px';
        cont.style.zIndex = options.zIndex;

        if (style.textMaxWidth) {
            let iw = parseFloat(style.textMaxWidth.substr(0, style.textMaxWidth.length - 2));
            log("Parsed width:", iw);
            if (iw > options.maxTextWidth) {
                iw = options.maxTextWidth;
                log("Capped width:", iw);
            }
            cont.style.width = iw + "px";
            cont.style.left = (cyPos.x + pos.x1 + (pos.w - iw) / 2) + 'px';
        } else {
            cont.style.width = "400";
            cont.style.left = cyPos.x + (pos.x1 - 200) + 'px';
        }

        log("Options:", options);
        cont.innerText = `${ node.data(options.nodeLabel)}`;
        cont.contentEditable = "true";

        // Set style to match node
        cont.style.resize = 'both';
        cont.style.backgroundColor = options.backgroundColor;
        cont.style.opacity = options.backgroundOpacity;
        cont.style.fontFamily = style.fontFamily;
        cont.style.fontSize = style.fontSize;
        cont.style.fontWeight = style.fontWeight;
        cont.style.textAlign = style['text-halign'] || 'center';
        cont.style.lineHeight = (style['line-height'] || 1) + 'rem';

        if (cont.style.justifyContent == 'left') {
            cont.style.left = (pos.x1) + 'px';
        }

        if (options.pasteAsPlainText) {
            cont.addEventListener('paste', (e) => {
                log("Intercepted paste - transforming to plain text");
                e.preventDefault();
                if (e.clipboardData) {
                    const text = e.clipboardData.getData('text/plain');
                    window.document.execCommand('insertText', false, text);
                }
            });
        }

        document.body.appendChild(cont);

        // After overlay added, focus and set selection
        cont.focus();
        window['cyEditBox'] = cont.id;

        DrawingHelpers.setCursorToEnd(cont, options.selectAllText);

        return cont;
    }

    // Helper function to get an element's exact position
    // Source: https://www.kirupa.com/html5/get_element_position_using_javascript.htm
    private static getPosition(el: HTMLElement) {
        var xPos = 0;
        var yPos = 0;

        while (el) {
            if (el.tagName == "BODY") {
                // deal with browser quirks with body/window/document and page scroll
                var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
                var yScroll = el.scrollTop || document.documentElement.scrollTop;

                xPos += (el.offsetLeft - xScroll + el.clientLeft);
                yPos += (el.offsetTop - yScroll + el.clientTop);
            } else {
                // for all other non-BODY elements
                xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
                yPos += (el.offsetTop - el.scrollTop + el.clientTop);
            }

            el = el.offsetParent as HTMLElement;
        }
        return {
            x: xPos,
            y: yPos
        };
    }

    private static setCursorToEnd(el: HTMLElement, selectAllText: boolean) {
        var range = document.createRange();
        var sel = window.getSelection();
        range.selectNodeContents(el);
        if (!selectAllText) {
            range.collapse(false);
        }
        if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
        el.focus();
    }
}