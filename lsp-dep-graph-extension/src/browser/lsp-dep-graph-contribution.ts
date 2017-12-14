import { LspDepGraphWidget } from './lsp-dep-graph-widget';
import { createSprottyContainer } from './sprotty-di-config';
import { injectable, inject, named } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService, ContributionProvider } from "@theia/core/lib/common";
import { FrontendApplication, WidgetManager } from "@theia/core/lib/browser";
import { EDITOR_CONTEXT_MENU, EditorManager, TextEditor } from "@theia/editor/lib/browser";
import { LanguageClientContribution, ILanguageClient } from "@theia/languages/lib/browser"
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
    @inject(ContributionProvider) @named(LanguageClientContribution)
        protected readonly langClientContributions: ContributionProvider<LanguageClientContribution>;

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(LspDepGraphCommand, {
            execute: async () => {
                if (this.editorManager.activeEditor) {
                    const widget = await this.widgetManager.getOrCreateWidget<LspDepGraphWidget>(FACTORY_ID);
                    this.frontendApp.shell.addToMainArea(widget);

                    const editor = this.editorManager.activeEditor.editor;
                    const languageClient = await this.getLanguageClient(editor);

                    const model = await this.generator.generate(editor.uri, editor.cursor, languageClient);
                    const container = createSprottyContainer(widget.svgId);
                    const modelSource = container.get<LocalModelSource>(TYPES.ModelSource);
                    modelSource.setModel(model);
                }
            }
        });
    }

    protected getLanguageClient(editor: TextEditor): Promise<ILanguageClient> {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            let done = false;
            for (const langClientContrib of this.langClientContributions.getContributions()) {
                langClientContrib.languageClient.then(languageClient => {
                    if (!done && Date.now() - startTime < 1000
                            && languageClient.languages.match([editor.document.languageId], editor.document)) {
                        resolve(languageClient);
                        done = true;
                    }
                })
            }
        })
    }
}

@injectable()
export class LspDepGraphMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(EDITOR_CONTEXT_MENU, {
            commandId: LspDepGraphCommand.id,
            label: 'Show Dependency Graph'
        });
    }
}
