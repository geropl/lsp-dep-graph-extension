import { RectangularNodeView, RenderingContext, SNode, PolylineEdgeView, Point, SEdge, toDegrees, angle } from "sprotty/lib";
import { VNode } from "snabbdom/vnode";
import * as snabdom from "snabbdom-jsx";

const JSX = { createElement: snabdom.svg };

export class DependencyNodeView extends RectangularNodeView {
    render(node: SNode, context: RenderingContext): VNode {
        return <g>
            <rect class-dep-node={true}
                class-mouseover={node.hoverFeedback}
                class-selected={node.selected}
                x="0" y="0"
                rx="3" ry="3"
                width={node.bounds.width * 2}
                height={node.bounds.height}>
            </rect>
            <text x={node.bounds.width / 2}
                y={node.bounds.height / 2 + 5}
                class-text={true}
                class-node-text={true}>{node.id}</text>
            { context.renderChildren(node) }
        </g>
    }
}

export class DependencyEdgeView extends PolylineEdgeView {
    protected renderAdditionals(edge: SEdge, segments: Point[], context: RenderingContext): VNode[] {
        const p1 = segments[segments.length - 2];
        const p2 = segments[segments.length - 1];
        return [
            <path class-dep-edge={true} class-dep-arrow={true} d="M 0,0 L 10,-4 L 10,4 Z"
                transform={`rotate(${toDegrees(angle(p2, p1))} ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`} />
        ]
    }
}