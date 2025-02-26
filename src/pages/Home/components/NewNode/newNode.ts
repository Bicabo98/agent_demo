import { BaseNodeModel, LogicFlow } from '@logicflow/core';
import { register } from '@logicflow/react-node-registry';
import { v4 as uuid } from 'uuid';
import NewNode from '.';
import '@logicflow/core/lib/style/index.css';
import '@logicflow/extension/lib/style/index.css';

export function registerNewNode(lf: LogicFlow) {
  class NewNodeModel extends BaseNodeModel {
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
          message: '新节点'
        },
      ];
      
      // 设置节点属性
      this.setProperties({
        ...this.properties,
        isNewNode: true,
        style: {
          fill: '#ffffff',
          stroke: '#ffffff',
          strokeWidth: 3,
          radius: 8,
        }
      });
      
      return this;
    }
  }
  
  register(
    {
      type: 'new-node',
      component: NewNode,
      model: NewNodeModel,
    },
    lf,
  );
} 