import { RectangularNodeView, RenderingContext, SNode } from "sprotty/lib";
import { VNode } from "snabbdom/vnode";
import * as snabdom from "snabbdom-jsx";

const JSX = {createElement: snabdom.svg};

export class DependencyNodeView extends RectangularNodeView {
    render(node: SNode, context: RenderingContext): VNode {
        return <g>
                <rect class-sprotty-node={true} class-mouseover={node.hoverFeedback} class-selected={node.selected}
                      x="0" y="0" width={node.bounds.width} height={node.bounds.height}></rect>
                <text x={node.bounds.width/2} y={node.bounds.height/2 + 5} class-text={true}>FOO</text>
            </g>
            
    }
}