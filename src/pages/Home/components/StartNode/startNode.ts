import { BaseNodeModel, LogicFlow } from '@logicflow/core';
import { register } from '@logicflow/react-node-registry';
import { v4 as uuid } from 'uuid';
import StartNode from '.';

export function registerStartNode(lf: LogicFlow) {
  class CustomNodeModel extends BaseNodeModel {
    createId() {
      return uuid().replace(/-/g, '');
    }
    getDefaultAnchor() {
      const { id, x, y, width } = this;
      const anchors = [];
      anchors.push({
        x: x + width / 2,
        y,
        id: `start_outgoing`,
        type: 'outgoing',
      });
      return anchors;
    }
    initNodeData(data: any) {
      super.initNodeData(data);
      const width = 140;
      const height = 48;
      this.width = width;
      this.height = height;
      this.radius = 8;
      this.anchorsOffset = [
        [width/2, 0]
      ];
      this.sourceRules = [
        {
          validate: (source: any) => source.id === data.id,
          message: '起始节点只能作为开始'
        },
      ];
    }
  }
  register(
    {
      type: 'start',
      component: StartNode,
      model: CustomNodeModel,
    },
    lf,
  );
}
