import { DagreLayout, DagreLayoutOptions } from '@antv/layout';

export default class Dagre {
  static pluginName = 'dagre';
  private lf: any;
  private option: DagreLayoutOptions | undefined;

  render(lf: any) {
    this.lf = lf;
  }

  layout(option: Partial<DagreLayoutOptions> = {}) {
    const { nodes, edges, gridSize } = this.lf.graphModel;

    const nodesep = gridSize > 20 ? gridSize * 2 : 40;
    const ranksep = gridSize > 20 ? gridSize * 2 : 40;

    this.option = {
      type: 'dagre',
      rankdir: 'LR',
      align: 'DR',
      nodesep,
      ranksep,
      begin: [200, 200],
      ...option,
    };
    const layoutInstance = new DagreLayout(this.option);
    const layoutData = layoutInstance.layout({
      nodes: nodes.map((node: any) => ({
        ...node,
        id: node.id,
        size: { width: node.width, height: node.height },
        model: node,
      })),
      edges: edges.map((edge: any) => ({
        ...edge,
        source: edge.sourceNodeId,
        target: edge.targetNodeId,
        model: edge,
      })),
    });

    const newGraphData = this.processLayoutData(layoutData);
    this.lf.clearData();
    this.lf.render(newGraphData);
  }

  private processLayoutData(layoutData: any) {
    const newGraphData: any = { nodes: [], edges: [] };

    layoutData?.nodes?.forEach((node: any) => {
      const { model, x, y } = node;
      const data = { ...model.getData(), x, y };
      // 更新文本位置
      if (data.text) {
        data.text.x = x;
        data.text.y = y;
      }
      newGraphData.nodes.push(data);
    });

    layoutData?.edges?.forEach((edge: any) => {
      const { model } = edge;
      const data = model.getData();
      data.pointsList = this.calcPointsList(model, newGraphData.nodes);
      this.updateEdgeData(data);
      newGraphData.edges.push(data);
    });

    return newGraphData;
  }

  private updateEdgeData(data: any) {
    if (data.pointsList && data.pointsList.length >= 2) {
      const [first, last] = [data.pointsList[0], data.pointsList[data.pointsList.length - 1]];
      data.startPoint = { x: first.x, y: first.y };
      data.endPoint = { x: last.x, y: last.y };
    } else {
      data.startPoint = data.endPoint = undefined;
    }
    // 移除文本位置更新，因为我们希望保持原始位置
  }

  private pointFilter(points: any[]) {
    return points.filter((point, i, arr) => {
      if (i === 0 || i === arr.length - 1) return true;
      const prev = arr[i - 1],
        next = arr[i + 1];
      return (
        !(prev.x === point.x && point.x === next.x) && !(prev.y === point.y && point.y === next.y)
      );
    });
  }

  private calcPointsList(model: any, nodes: any[]) {
    if (this?.option?.rankdir !== 'LR' || model?.modelType !== 'polyline-edge') return undefined;

    const sourceNode = nodes.find((node: any) => node.id === model.sourceNodeId);
    const targetNode = nodes.find((node: any) => node.id === model.targetNodeId);

    if (!sourceNode || !targetNode) return undefined;

    // 使用原始的锚点计算方法
    const startPoint = { x: sourceNode.x, y: sourceNode.y };
    const endPoint = { x: targetNode.x, y: targetNode.y };

    return this.pointFilter([startPoint, endPoint]);
  }
}
