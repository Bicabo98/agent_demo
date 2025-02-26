import { BaseNodeModel, LogicFlow } from '@logicflow/core';
import { register } from '@logicflow/react-node-registry';
import { v4 as uuid } from 'uuid';
import ChildNode from '.';
import { setNodeState } from './nodeStateStore';
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
      
      // Log the incoming data to see what's available
      console.log("Node initNodeData received:", JSON.stringify(data, null, 2));
      
      // 确保 properties 存在
      if (!this.properties) {
        this.properties = {};
      }

      // 从数据中获取 isNewNode
      const isNewNode = data.properties?.isNewNode;
      
      console.log(`节点 ${this.id} 初始化, isNewNode=`, isNewNode);
      
      // 设置节点属性
      this.setProperties({
        ...this.properties,
        isNewNode: isNewNode,
        style: isNewNode ? {
          fill: '#ffffff',
          stroke: '#ffffff',
          strokeWidth: 3,
          radius: 8,
        } : {
          fill: '#ffffff',
          stroke: '#ffffff',
          strokeWidth: 2,
          radius: 8,
        }
      });
      
      // 确保使用正确的 ID 更新全局状态存储
      console.log(`更新状态存储, 节点ID=${this.id}, isNewNode=${isNewNode}`);
      setNodeState(this.id, { isNewNode: !!isNewNode }); // 使用双感叹号确保是布尔值
    }
    // 添加一个方法来更新节点的训练状态
    updateTrainingStatus(isTraining: boolean) {
      console.log(`更新节点 ${this.id} 的训练状态, isTraining=`, isTraining);
      
      this.setProperties({
        ...this.properties,
        isNewNode: isTraining,
        style: isTraining ? {
          fill: '#ffffff',
          stroke: '#ffffff',
          strokeWidth: 3,
          radius: 8,
        } : {
          fill: '#ffffff',
          stroke: '#ffffff',
          strokeWidth: 2,
          radius: 8,
        }
      });
      
      // 更新全局状态存储
      console.log(`更新状态存储, 节点ID=${this.id}, isNewNode=${isTraining}`);
      setNodeState(this.id, { isNewNode: isTraining });
      
      return this;
    }
    getIsNewNode() {
      return this.properties?.isNewNode || false;
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
