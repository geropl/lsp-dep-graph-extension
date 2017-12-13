import URI from "@theia/core/lib/common/uri";
import {
    Position
} from '@theia/editor/lib/browser';
import { SModelRootSchema } from "sprotty/lib";
import { injectable } from "inversify";

@injectable()
export class LspDepGraphGenerator {


    generate(uri: URI, position: Position): Promise<SModelRootSchema> {
        return Promise.resolve({
            type: "graph",
            id: "dep-graph-" + uri.toString(),
            children: [
                {
                    type: "node",
                    id: "firstChild"
                }
            ]
        })
    }
}