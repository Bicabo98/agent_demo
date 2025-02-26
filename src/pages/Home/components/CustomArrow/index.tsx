import { BezierEdge, BezierEdgeModel } from '@logicflow/core';

class CustomBezierEdgeModel extends BezierEdgeModel {
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.stroke = '#13c2c2';
    style.strokeWidth = 2;
    style.strokeDasharray = '3 2';
    return style;
  }

  getTextStyle() {
    const style = super.getTextStyle();
    style.color = '#13c2c2';
    style.fontSize = 12;
    style.background = {
      fill: '#f5f5f5',
    };
    return style;
  }

  // 确保箭头方向正确
  initEdgeData(data) {
    super.initEdgeData(data);
    this.sourceAnchorId = data.sourceAnchorId;
    this.targetAnchorId = data.targetAnchorId;
    // 确保箭头指向目标节点
    this.arrowConfig = {
      markerEnd: 'arrow',
      markerStart: '',
    };
  }

  getArrowStyle() {
    const style = super.getArrowStyle();
    style.stroke = '#13c2c2';
    style.fill = '#13c2c2';
    return style;
  }
}

export default {
  type: 'myBezier',
  view: BezierEdge,
  model: CustomBezierEdgeModel,
}; 