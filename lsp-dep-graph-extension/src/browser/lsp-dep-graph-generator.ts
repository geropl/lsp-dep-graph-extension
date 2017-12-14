import URI from "@theia/core/lib/common/uri";
import { Position } from '@theia/editor/lib/browser';
import { SModelRootSchema, SNodeSchema, SGraphSchema, SEdgeSchema, SLabelSchema } from "sprotty/lib";
import { injectable } from "inversify";
import {
    ILanguageClient, ReferencesRequest, DocumentSymbolRequest, SymbolInformation, Range
} from "@theia/languages/lib/browser";

export interface DependencyNode extends SNodeSchema {
    uri: string
    textPos: Position
}

const MAX_NODES = 50;

@injectable()
export class LspDepGraphGenerator {

    async generate(uri: URI, position: Position, languageClient: ILanguageClient): Promise<SModelRootSchema> {
        const root: SGraphSchema = {
            type: 'graph',
            id: 'dependencies',
            children: []
        }
        const nodesToExamine: DependencyNode[] = []
        // TODO find a proper label for the initial node using a definition request
        nodesToExamine.push({
            type: 'node',
            id: 'start_node',
            uri: uri.toString(),
            textPos: position
        })
        do {
            const currentNode = nodesToExamine.splice(0, 1)[0]
            const deps = await this.searchDeps(currentNode, languageClient)
            for (const depNode of deps) {
                root.children.push(depNode)
                const edge: SEdgeSchema = {
                    type: 'edge',
                    id: 'edge_' + root.children.length,
                    sourceId: depNode.id,
                    targetId: currentNode.id
                }
                root.children.push(edge)
                nodesToExamine.push(depNode)
            }
        } while (nodesToExamine.length > 0 && root.children.length < MAX_NODES)
        return root
    }

    protected async searchDeps(startNode: DependencyNode, languageClient: ILanguageClient): Promise<DependencyNode[]> {
        const deps: DependencyNode[] = []
        const references = await languageClient.sendRequest(ReferencesRequest.type, {
            textDocument: { uri: startNode.uri },
            position: startNode.textPos
        })
        for (const reference of references) {
            const symbols = await languageClient.sendRequest(DocumentSymbolRequest.type, {
                textDocument: { uri: reference.uri }
            })
            let bestMatch: SymbolInformation | undefined;
            for (const symbol of symbols) {
                if (this.includesRange(symbol.location.range, reference.range)
                    && (bestMatch === undefined
                        || this.includesRange(bestMatch.location.range, symbol.location.range))) {
                    bestMatch = symbol;
                }
            }
            if (bestMatch !== undefined) {
                // TODO match with previously found symbols to detect cycles
                const label = bestMatch.containerName
                    ? bestMatch.containerName + ' - ' + bestMatch.name
                    : bestMatch.name;
                deps.push({
                    type: 'node',
                    id: startNode.id + '<<' + deps.length,
                    uri: reference.uri,
                    textPos: bestMatch.location.range.start,
                    children: [
                        <SLabelSchema> {
                            type: 'label',
                            id: startNode.id + '<<' + deps.length + '_label',
                            text: label
                        }
                    ]
                })
            }
        }
        return deps
    }

    protected includesRange(range1: Range, range2: Range): boolean {
        return (range1.start.line < range2.start.line
            || range1.start.line === range2.start.line && range1.start.character <= range2.start.character)
            && (range1.end.line > range2.end.line
            || range1.end.line === range2.end.line && range1.end.character >= range2.end.character)
    }
}