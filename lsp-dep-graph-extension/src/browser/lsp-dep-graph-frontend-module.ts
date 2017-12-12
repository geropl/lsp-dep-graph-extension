/**
 * Generated using theia-extension-generator
 */

import { LspDepGraphCommandContribution, LspDepGraphMenuContribution } from './lsp-dep-graph-contribution';
import {
    CommandContribution,
    MenuContribution
} from "@theia/core/lib/common";

import { ContainerModule } from "inversify";

export default new ContainerModule(bind => {
    // add your contribution bindings here
    
    bind(CommandContribution).to(LspDepGraphCommandContribution);
    bind(MenuContribution).to(LspDepGraphMenuContribution);
    
});