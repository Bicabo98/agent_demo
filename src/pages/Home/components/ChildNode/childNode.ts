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
      
      // 处理 isNewNode 属性
      if (data.properties && data.properties.isNewNode) {
        // 可以在这里设置新节点的特殊样式属性
        this.setProperties({
          ...this.properties,
          isNewNode: true,
          style: {
            fill: '#f5f0ff',
            stroke: '#722ed1',
            strokeWidth: 3,
            radius: 8,
          }
        });
        
        // 如果需要，可以修改文本
        if (this.text && this.text.value) {
          this.text.value = `${this.text.value} 🔄`;
        }
      }
    }
    
    // 添加一个方法来更新节点的训练状态
    updateTrainingStatus(isTraining: boolean) {
      this.setProperties({
        ...this.properties,
        isNewNode: isTraining,
        style: isTraining ? {
          fill: '#f5f0ff',
          stroke: '#722ed1',
          strokeWidth: 3,
          radius: 8,
        } : {
          fill: '#f0f2f5',
          stroke: '#1890ff',
          strokeWidth: 2,
          radius: 8,
        }
      });
      
      // 更新文本
      if (this.text && this.text.value) {
        const baseText = this.text.value.replace(' 🔄', '');
        this.text.value = isTraining ? `${baseText} 🔄` : baseText;
      }
      
      return this;
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
