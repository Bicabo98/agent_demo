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
      
      // 确保 properties 存在
      if (!this.properties) {
        this.properties = {};
      }

      // 从数据中获取 isNewNode
      const isNewNode = data.properties?.isNewNode;
      
      // 设置节点属性
      this.setProperties({
        ...this.properties,
        isNewNode: isNewNode, // 明确设置 isNewNode
        style: isNewNode ? {
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
      
      
    }
    
    // 添加一个方法来更新节点的训练状态
    updateTrainingStatus(isTraining: boolean) {
      console.log(" isTraining=",isTraining)
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
