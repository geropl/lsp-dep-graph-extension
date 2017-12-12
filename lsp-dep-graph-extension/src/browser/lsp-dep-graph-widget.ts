
import { VirtualWidget } from '@theia/core/lib/browser';
import { h } from '@phosphor/virtualdom';

export class LspDepGraphWidget extends VirtualWidget {
    // onRender: DisposableCollection;
    // protected onUpdateRequest(msg: Message): void;

    constructor() {
        super();

        this.id = "lsp-dep-graph";
        this.title.label = "test1";
    }

    render(): h.Child {
        return h.div({ }, "hello world!");
    }
}