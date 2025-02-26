import { BezierEdge, BezierEdgeModel, h } from '@logicflow/core';

class CustomArrow extends BezierEdge {
  getStartArrow() {
    const pathAttr = {
      stroke: '#296dff',
      strokeWidth: 1,
    };

    return h('rect', {
      ...pathAttr,
      width: 1,
      height: 6,
      x: -2,
      y: -3,
    });
  }

  getEndArrow() {
    const pathAttr = {
      stroke: '#296dff',
      strokeWidth: 1,
    };

    return h('rect', {
      ...pathAttr,
      width: 1,
      height: 6,
      x: 1,
      y: -3,
    });
  }
}

class CustomEdgeMode extends BezierEdgeModel {
  initEdgeData(data: any) {
    super.initEdgeData(data);
    const startPoint = data.startPoint;
    const endPoint = data.endPoint;
    if (startPoint && endPoint) {
      let offset;
      const pointsList = [];
      if (startPoint.x < endPoint.x) {
        offset = 50;
      } else {
        offset = 100;
      }
      pointsList.push(
        startPoint,
        { x: startPoint.x + offset, y: startPoint.y },
        { x: endPoint.x - offset, y: endPoint.y },
        endPoint,
      );
      this.pointsList = pointsList;
    }
    this.offset = 10;
  }
  getData() {
    const data = super.getData();
    data.sourceAnchorId = this.sourceAnchorId;
    data.targetAnchorId = this.targetAnchorId;
    return data;
  }
}

export default {
  type: 'custom-arrow',
  model: CustomEdgeMode,
  view: CustomArrow,
};
