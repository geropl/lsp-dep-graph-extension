import { WidgetFactory, Widget } from "@theia/core/lib/browser";
import { injectable } from "inversify";
import { LspDepGraphWidget } from "./lsp-dep-graph-widget";
import { FACTORY_ID } from "./lsp-dep-graph-contribution";

@injectable()
export class LspDepGraphWidgetFactory implements WidgetFactory {
    id = FACTORY_ID;

    constructor(){
    }
    
    createWidget(options?: any): Promise<Widget> {
        
        const widget = new LspDepGraphWidget("lsp-dep-graph-blah");

        return Promise.resolve(widget);
    }
    
}