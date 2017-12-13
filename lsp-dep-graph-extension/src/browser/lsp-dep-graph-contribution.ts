import { LspDepGraphWidget } from './lsp-dep-graph-widget';
import { createSprottyContainer } from './sprotty-di-config';
import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService } from "@theia/core/lib/common";
import { FrontendApplication, WidgetManager } from "@theia/core/lib/browser";
import { EDITOR_CONTEXT_MENU, EditorManager } from "@theia/editor/lib/browser";
import { LspDepGraphGenerator } from "./lsp-dep-graph-generator";
import { TYPES, LocalModelSource } from 'sprotty/lib';

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
    @inject(EditorManager) protected readonly editorManager: EditorManager;
    @inject(LspDepGraphGenerator) protected readonly generator: LspDepGraphGenerator;

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(LspDepGraphCommand, {
            execute: async () => {
                if(this.editorManager.activeEditor){
                    const widget = await this.widgetManager.getOrCreateWidget<LspDepGraphWidget>(FACTORY_ID);
                    this.frontendApp.shell.addToMainArea(widget);

                    const baseId = widget.svgId;
                    const container = createSprottyContainer(baseId);

                    const uri = this.editorManager.activeEditor.editor.uri;
                    const position = this.editorManager.activeEditor.editor.cursor;
                    const model = await this.generator.generate(uri, position);
                    const modelSource = container.get<LocalModelSource>(TYPES.ModelSource);
                    modelSource.setModel(model);
                }
            }
        });
    }
}

@injectable()
export class LspDepGraphMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(EDITOR_CONTEXT_MENU, {
            commandId: LspDepGraphCommand.id,
            label: 'Show call hierarchy'
        });
    }
}

