import { BaseNodeModel, LogicFlow } from '@logicflow/core';
import { register } from '@logicflow/react-node-registry';
import { v4 as uuid } from 'uuid';
import ChildNode from '.';
import '@logicflow/core/lib/style/index.css';
import '@logicflow/extension/lib/style/index.css';

export function registerChildNode(lf: LogicFlow) {
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
        [width/2, 0],
        [-width/2,0]
      ];
      this.sourceRules = [
        {
          validate: (source: any) => true,
          message: '子节点'
        },
      ];
    }
  }
  register(
    {
      type: 'assignment',
      component: ChildNode,
      model: CustomNodeModel,
    },
    lf,
  );
}
