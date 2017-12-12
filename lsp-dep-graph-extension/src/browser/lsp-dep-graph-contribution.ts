import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService } from "@theia/core/lib/common";
import { CommonMenus } from "@theia/core/lib/browser";

export const LspDepGraphCommand = {
    id: 'LspDepGraph.command',
    label: "Shows a message"
};

@injectable()
export class LspDepGraphCommandContribution implements CommandContribution {

    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(LspDepGraphCommand, {
            execute: () => this.messageService.info('Hello World!')
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