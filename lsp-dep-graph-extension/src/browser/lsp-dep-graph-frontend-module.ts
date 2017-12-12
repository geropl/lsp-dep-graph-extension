/**
 * Generated using theia-extension-generator
 */

import { LspDepGraphCommandContribution, LspDepGraphMenuContribution, FACTORY_ID } from './lsp-dep-graph-contribution';
import {
    CommandContribution,
    MenuContribution
} from "@theia/core/lib/common";

import { ContainerModule } from "inversify";
import { WidgetFactory } from '@theia/core/lib/browser';
import { LspDepGraphWidget } from './lsp-dep-graph-widget';

export default new ContainerModule(bind => {
    // add your contribution bindings here

    bind(CommandContribution).to(LspDepGraphCommandContribution);
    bind(MenuContribution).to(LspDepGraphMenuContribution);

    bind(LspDepGraphWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
            id: FACTORY_ID,
            createWidget: () => ctx.container.get(LspDepGraphWidget)
        })
    );

});