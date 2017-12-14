import { DependencyNodeView, DependencyEdgeView } from './sprotty-views';
import { ContainerModule, Container } from "inversify";
import { TYPES, LocalModelSource, SGraphFactory, defaultModule, selectModule, moveModule, boundsModule, undoRedoModule, viewportModule, hoverModule, fadeModule, exportModule, expandModule, openModule, buttonModule, modelSourceModule, overrideViewerOptions, ViewRegistry, SGraphView } from "sprotty/lib";

const depGraphDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    rebind(TYPES.IModelFactory).to(SGraphFactory).inSingletonScope();
    bind(TYPES.ModelSource).to(LocalModelSource).inSingletonScope();
})

export function createSprottyContainer(baseId: string): Container {
    const container = new Container();
    container.load(defaultModule, selectModule, moveModule, boundsModule, undoRedoModule, viewportModule,
        hoverModule, fadeModule, exportModule, expandModule, openModule, buttonModule, modelSourceModule,
        depGraphDiagramModule);
    overrideViewerOptions(container, {
        baseDiv: baseId
    });

    const viewRegistry = container.get<ViewRegistry>(TYPES.ViewRegistry);
    viewRegistry.register('graph', SGraphView);
    viewRegistry.register('edge', DependencyEdgeView);
    viewRegistry.register('node', DependencyNodeView);

    return container;
}

