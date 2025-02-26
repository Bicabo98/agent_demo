// 创建一个简单的全局状态存储
interface NodeState {
    isNewNode: boolean;
    [key: string]: any; // 其他可能的状态
  }
  
  // 使用节点ID作为键的全局状态对象
  const nodeStateStore: Record<string, NodeState> = {};
  
  // 提供操作状态的方法
  export const setNodeState = (nodeId: string, state: Partial<NodeState>) => {
    console.log(`设置节点 ${nodeId} 的状态:`, state);
    nodeStateStore[nodeId] = {
      ...nodeStateStore[nodeId] || { isNewNode: false },
      ...state
    };
    console.log(`设置后的状态存储:`, nodeStateStore);
  };
  
  export const getNodeState = (nodeId: string): NodeState => {
    console.log(`获取节点 ${nodeId} 的状态, 当前存储:`, nodeStateStore);
    return nodeStateStore[nodeId] || { isNewNode: false };
  };
  
  // 添加一个函数来检查是否存在新节点
  export const hasNewNode = (): boolean => {
    return Object.values(nodeStateStore).some(state => state.isNewNode);
  };
  
  // 添加一个函数来获取第一个新节点的ID
  export const getNewNodeId = (): string | null => {
    for (const [id, state] of Object.entries(nodeStateStore)) {
      if (state.isNewNode) {
        return id;
      }
    }
    return null;
  };
  
  export default nodeStateStore;