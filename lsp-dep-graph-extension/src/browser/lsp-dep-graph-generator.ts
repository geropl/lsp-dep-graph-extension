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
                    id: "node1",
                    label: "Some file",
                    position: {
                        x: 100,
                        y: 100
                    }
                },
                {
                    type: "node",
                    id: "node2",
                    label: "Some other file",
                    position: {
                        x: 80,
                        y: 150
                    }
                },
                {
                    type: "edge",
                    id: "edge1",
                    label: "depends on",
                    sourceId: "node1",
                    targetId: "node2"
                }
            ]
        })
    }
}