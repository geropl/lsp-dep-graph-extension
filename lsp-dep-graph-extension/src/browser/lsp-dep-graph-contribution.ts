import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService } from "@theia/core/lib/common";
import { CommonMenus, FrontendApplication, WidgetManager } from "@theia/core/lib/browser";

export const LspDepGraphCommand = {
    id: 'LspDepGraph.command',
    label: "Shows a message"
};

export const FACTORY_ID = "lsp-dep-graph-widget";

@injectable()
export class LspDepGraphCommandContribution implements CommandContribution {

    @inject(MessageService) protected readonly messageService: MessageService;
    @inject(FrontendApplication) protected readonly frontendApp: FrontendApplication;
    @inject(WidgetManager) protected readonly widgetManager: WidgetManager;

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(LspDepGraphCommand, {
            execute: async () => {
                const widget = await this.widgetManager.getOrCreateWidget(FACTORY_ID);
                this.frontendApp.shell.addToMainArea(widget);
            }
        });
    }
}

@injectable()
export class LspDepGraphMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.EDIT_FIND, {
            commandId: LspDepGraphCommand.id,
            label: 'Say Hello'
        });
    }
}

