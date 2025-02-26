import { BaseNodeModel, LogicFlow } from '@logicflow/core';
import { register } from '@logicflow/react-node-registry';
import NewWhiteNode from '.';

export function registerNewWhiteNode(lf: LogicFlow) {
  class NewWhiteNodeModel extends BaseNodeModel {
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
      
      // 检查文本是否包含训练信息
      const text = data.text?.value || '';
      const hasTrainingInfo = text.includes('\n');
      
      // 根据是否有训练信息设置高度
      const height = hasTrainingInfo ? 70 : 48;
      
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
      return this;
    }
    
    // 重写 getText 方法，确保文本正确显示
    getText() {
      const textValue = this.text.value;
      return {
        value: textValue,
        x: this.x,
        y: this.y,
      };
    }
  }
  
  register(
    {
      type: 'new-white-node',
      component: NewWhiteNode,
      model: NewWhiteNodeModel,
    },
    lf,
  );
} 