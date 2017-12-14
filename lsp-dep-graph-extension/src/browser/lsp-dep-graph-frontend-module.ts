/**
 * Generated using theia-extension-generator
 */

import { LspDepGraphCommandContribution, LspDepGraphMenuContribution } from './lsp-dep-graph-contribution';
import {
    CommandContribution,
    MenuContribution
} from "@theia/core/lib/common";

import { ContainerModule } from "inversify";
import { WidgetFactory } from '@theia/core/lib/browser';
import { LspDepGraphWidgetFactory } from './lsp-dep-graph-widget-factory';
import { LspDepGraphGenerator } from './lsp-dep-graph-generator';

import '../../src/browser/styles/index.css';
import 'sprotty/css/sprotty.css';
import 'theia-sprotty/css/theia-sprotty.css';

export default new ContainerModule(bind => {
    // add your contribution bindings here

    bind(CommandContribution).to(LspDepGraphCommandContribution);
    bind(MenuContribution).to(LspDepGraphMenuContribution);

    bind(LspDepGraphWidgetFactory).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ctx.container.get(LspDepGraphWidgetFactory));

    bind(LspDepGraphGenerator).toSelf();
});

