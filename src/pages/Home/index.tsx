import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';
import './index.less';
import React, { useEffect, useRef, useState } from 'react';
import { LogicFlow } from '@logicflow/core';
import useStateRef from 'react-usestateref';
import { registerStartNode } from '@/pages/Home/components/StartNode/startNode';
import { registerChildNode } from '@/pages/Home/components/ChildNode/childNode';
import CustomArrow from './components/registerEdge/index';
import Dagre from './components/tools/dagre';
import { Card, Col, Descriptions, Flex, message, Popover, Row, Statistic, Typography, Button, Modal, Select } from 'antd';
import { Pie as AntPie } from '@ant-design/charts';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, Legend, Tooltip, Label, ResponsiveContainer } from 'recharts';


const getRandomAlgorithm = () => {
  const algorithms = [
    'Transformer', 'BERT', 'GPT', 'LSTM', 'CNN', 
  ];
  return algorithms[Math.floor(Math.random() * algorithms.length)];
};

const getRandomDataset = () => {
  const datasets = [
    'ImageNet', 'COCO', 'CIFAR-10', 'MNIST', 'WikiText',
  ];
  return datasets[Math.floor(Math.random() * datasets.length)];
};

const getRandomBuilder = () => {
  const builders = [
    'DeepMind', 'OpenAI', 'Google Research', 'Facebook AI', 'Microsoft Research',
  ];
  return builders[Math.floor(Math.random() * builders.length)];
};

const HomePage: React.FC = () => {
  const refContainer = useRef(null);
  const [lf, setLf, lfRef] = useStateRef<LogicFlow | null>(null);
  const [infoData, setInfoData] = useState<any>({});
  const [showChatModel, setShowChatModel] = useState({ showModel: false, data: {} });
  const [nodeInfoData, setNodeInfoData] = useState<any>({});
  const [showModelEvolution, setShowModelEvolution] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [percentages, setPercentages] = useState({
    Based: 0,
    AIGO: 0,
    DATASET: 0,
    Builder: 0,
    Validator: 0,
  });
  const [currentModelContributions, setCurrentModelContributions] = useState(null);
  const infoDefaultData: any = {
    TotalModels: 5,
    DataSets: 3,
    LaunchedModels: 3,
    Validator:10,
    Builder: 4,
  };
  const [modelsContributions, setModelsContributions] = useState<{[key: string]: any}>({});
  const [baseContribution, setBaseContribution] = useState({
    Based: 40,
    AIGO: 20,
    DATASET: 20,
    Builder: 10,
    Validator: 10,
  });
  const [baseContribution1, setBaseContribution1] = useState<any>({});
  const baseContributionRef = useRef(baseContribution);
  const [countdown, setCountdown] = useState(0);
  const [countdownNodeId, setCountdownNodeId] = useState('');
  const [manuallyModifiedNodes, setManuallyModifiedNodes] = useState<string[]>([]);

  const modelsContributionsRef = useRef<{[key: string]: any}>({});
  const totalModelsRef = useRef(5);
  const [showNodeDetails, setShowNodeDetails] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // 将函数定义移到这里，在使用之前
  const generate25DigitID = () => {
    // 时间戳部分（13位）
    const timestamp = Date.now().toString();
    // 加密安全随机数部分（12位）
    const buffer = new Uint8Array(12);
    crypto.getRandomValues(buffer);
    const randomPart = Array.from(buffer, (byte) =>
      (byte % 10).toString(), // 转换为0-9的数字字符
    ).join('');
    // 组合成25位字符串
    return timestamp + randomPart;
  };

  const [testPrimitiveData, setTestPrimitiveData] = useState([
    {
      nodeData: {
        nodeId: generate25DigitID(),
        name: 'Base Model',
      },
      children: [
        {
          nodeData: {
            nodeId: generate25DigitID(),
            name: 'V2',
          },
          children: [
            {
              nodeData: {
                nodeId: generate25DigitID(),
                name: 'V2.1',
                  },
                  children: [],
                },
                {
                  nodeData: {
                    nodeId: generate25DigitID(),
                name: 'V2.2',
                  },
                  children: [],
            },
          ],
        },
        {
          nodeData: {
            nodeId: generate25DigitID(),
            name: 'V3',
                  },
                  children: [],
                },
              ],
            },
  ]);

  const random4Digits = () => {
    return Math.floor(1000 + Math.random() * 9000);
  }
  const modelData = (model: any) => {
    if (!model?.name) {
      model.name = "";
    }

    const calculateContributions = (modelName: string) => {
      let level = 0;
      let basedPercent = baseContributionRef.current.Based;
      let datasetPercent = baseContributionRef.current.DATASET;

      if (modelName === 'Base Model') {
        return baseContributionRef.current;
      }

      if (modelName.startsWith('V2')) {
        level = 1;
        if (modelName.includes('.')) {
          level = 2;
        }
      } else if (modelName.startsWith('V3')) {
        level = 1;
        if (modelName.includes('.')) {
          level = 2;
        }
      }

      const reduction = level * 5;
      basedPercent = baseContributionRef.current.Based - reduction;
      datasetPercent = baseContributionRef.current.DATASET + reduction;

    return {
        Based: basedPercent,
        AIGO: baseContributionRef.current.AIGO,
        DATASET: datasetPercent,
        Builder: baseContributionRef.current.Builder,
        Validator: baseContributionRef.current.Validator,
      };
    };

    const contributionData = calculateContributions(model.name);

    const commonData = {
      dataset: {
        id: 'asdfasdfasdf',
        name: 'clinical-data-50k',
        contributors: [
          {
            name: 'Alice',
            rate: '10%',
          },
          {
            name: 'Bob',
            rate: '50%',
          },
          {
            name: 'Charlie',
            rate: '40%',
          },
        ],
      },
      training: {
        id: 'asdfasdfasdf',
        type: 'SFT',
        author: 'Bob',
        date: '2020-01-01',
        fingerPrint: '0xdc93112d09a205d1caa35b3756b227392176bee8a1afd03cff51c51cd6c3423f',
        accuracy: 0.8,
      },
    };

    // 确保每个节点都有 Incentives 数据
    const incentives = [
        {
          modelId: '',
          name: `${model?.name}.3`,
          rate: '15%',
          reward: `${random4Digits()}`,
        },
        {
          modelId: '',
          name: `${model?.name}.2`,
          rate: '15%',
          reward: `${random4Digits()}`,
        },
        {
          modelId: '',
          name: `${model?.name}.1`,
          rate: '20%',
          reward: `${random4Digits()}`,
        },
        {
          modelId: '',
          name: model?.name,
          rate: '50%',
          reward: `${random4Digits()}`,
        },
    ];

    return {
      modelId: '',
      name: model?.name,
      parentModel: model?.name === 'Base Model' ? '' : 
                  model?.name.startsWith('V2.') ? 'V2' : 
                  'Base Model',
      ...commonData, 
      Incentives: incentives, // 确保 Incentives 被正确设置
      contributions: contributionData,
    };
  };
  const transformTreeToFlowData = (trees: any[]) => {
    const nodes = [];
    const edges = [];
    let edgeIdCounter = 0;
  
    // 圆形布局参数
    const centerX = 400; // 圆心X坐标
    const centerY = 300; // 圆心Y坐标
    const radius = 200;  // 圆的半径

    // 递归处理节点
    function processNode(node, parentId = null, depth = 0, angle = 0, totalNodes = 1) {
      const angleStep = (2 * Math.PI) / totalNodes;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
  
      const flowNode = {
        id: node.nodeData.nodeId,
        type: depth === 0 ? 'start' : 'assignment',
        x,
        y,
        properties: {
          name: node.nodeData.name,
          desc: '',
          frontend_status: '1',
          width: 140,
          height: 40,
          rawData: node,
          isNewNode: node.nodeData.isNewNode, // 确保这个属性被传递
          style: {
            fill: node.nodeData.isNewNode ? '#f5f0ff' : '#f0f2f5', // 为新节点设置不同的背景色
            stroke: node.nodeData.isNewNode ? '#722ed1' : '#1890ff', // 为新节点设置不同的边框色
            strokeWidth: node.nodeData.isNewNode ? 3 : 2, // 为新节点设置更粗的边框
            radius: 20,
          },
        },
        text: {
          x,
          y,
          value: node.nodeData.name + (node.nodeData.isNewNode ? ' 🔄' : ''), // 为新节点添加图标
        },
      };

      nodes.push(flowNode);

      if (parentId) {
        edges.push({
          id: `edge_${edgeIdCounter++}`,
          type: 'myBezier',
          properties: {
            edgeType: depth === 1 ? 'start' : 'nextStep',
          },
          sourceNodeId: parentId,
          targetNodeId: node.nodeData.nodeId,
          startPoint: { x: x - 50, y },
          endPoint: { x, y },
          pointsList: [
            { x: x - 50, y },
            { x: x - 20, y },
            { x: x - 30, y },
            { x, y },
          ],
        });
      }

      const childCount = node.children.length;
      node.children.forEach((child, index) => {
        processNode(child, node.nodeData.nodeId, depth + 1, angle + index * angleStep, childCount);
      });
    }

    trees.forEach(tree => {
      processNode(tree, null, 0, 0, tree.children.length);
    });

    return { nodes, edges };
  };

  const countTotalNodes = () => {
    let count = 0;
    const countNodes = (tree) => {
      count++; 
      tree.children.forEach(child => countNodes(child)); 
    };
    
    testPrimitiveData.forEach(tree => countNodes(tree));

    totalModelsRef.current = count;
    return count;
  };

  useEffect(() => {
    const initialTotalModels = countTotalNodes();
    totalModelsRef.current = initialTotalModels; 
    
    setInfoData({
      ...infoDefaultData,
      TotalModels: initialTotalModels
    });
    
    const initialData = {};
    testPrimitiveData.forEach(tree => {
      const stack = [tree];
      while (stack.length > 0) {
        const node = stack.pop();
        initialData[node.nodeData.name] = modelData(node.nodeData);
        node.children.forEach(child => stack.push(child));
      }
    });
    setModelsContributions(initialData);
    setNodeInfoData(initialData['Base Model']);
  }, []);

  useEffect(() => {
    if (lf) {
      const { nodes, edges } = transformTreeToFlowData(testPrimitiveData);
      lf.render({ nodes, edges });
      // @ts-ignore
      lf?.extension.dagre.layout({
        nodesep: 15,
        ranksep: 35,
      });
    }
  }, [lf, testPrimitiveData]);

  const lfEvent = (logicFlow: LogicFlow) => {
    let clickTimer: NodeJS.Timeout | null = null;
    let lastClickTime = 0;
    const CLICK_DELAY = 300;

    logicFlow.on('node:click', (data) => {
      const now = Date.now();
      if (now - lastClickTime < CLICK_DELAY) {
        if (clickTimer) {
          clearTimeout(clickTimer);
          clickTimer = null;
        }
        return;
      }
      clickTimer = setTimeout(() => {
        const nodeId = data?.data?.id;
        const nodeName = data?.data?.properties?.rawData?.nodeData?.name;
        if (!nodeName) {
          return;
        }

        setSelectedNodeId(nodeId);

        console.log("测试点击1 =",manuallyModifiedNodes)
        
        let modelInfo;
        const isModified = manuallyModifiedNodes.includes(nodeName);
        if (nodeName && modelsContributionsRef.current[nodeName]) {
          modelInfo = JSON.parse(JSON.stringify(modelsContributionsRef.current[nodeName]));
          if (isModified) {
            modelInfo.isManuallyModified = true;

          }
        } 
        else if (nodeName && modelsContributions[nodeName]) {

          modelInfo = JSON.parse(JSON.stringify(modelsContributions[nodeName]));
          if (isModified) {
            modelInfo.isManuallyModified = true;
          }
        } else {
          modelInfo = modelData(data?.data?.properties?.rawData?.nodeData);
          const updatedContributions = {
            ...modelsContributions,
            [nodeName]: modelInfo
          };

          modelsContributionsRef.current = updatedContributions; 
          setModelsContributions(updatedContributions);
        }
        if (!modelInfo.name) {
          modelInfo.name = nodeName;
        }

        setNodeInfoData(modelInfo);
        setShowNodeDetails(true); 
        setShowChatModel({
          showModel: true,
          data: data?.data?.properties?.rawData,
        });
        
        clickTimer = null;
      lastClickTime = now;
      }, CLICK_DELAY);
    });

    logicFlow.on('node:dbclick', (data) => {
      console.log("测试双击1")
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
      }

      const nodeId = data?.data?.id;
      const nodeName = "Base Model";
      if (!nodeName) {
        message.error('cannot get node info');
        return;
      }

      setSelectedNodeId(nodeId);
      
      let modelInfo;
      const isModified = manuallyModifiedNodes.includes(nodeName);
      if (nodeName && modelsContributionsRef.current[nodeName]) {

        modelInfo = JSON.parse(JSON.stringify(modelsContributionsRef.current[nodeName]));

        if (isModified) {
          modelInfo.isManuallyModified = true;
        }
      }

      else if (nodeName && modelsContributions[nodeName]) {
        modelInfo = JSON.parse(JSON.stringify(modelsContributions[nodeName]));
        if (isModified) {
          modelInfo.isManuallyModified = true;
        }
      } else {
        modelInfo = modelData(data?.data?.properties?.rawData?.nodeData);
        const updatedContributions = {
          ...modelsContributions,
          [nodeName]: modelInfo
        };
        modelsContributionsRef.current = updatedContributions; 
        setModelsContributions(updatedContributions);
      }
      if (!modelInfo.name) {
        modelInfo.name = nodeName;
      }
      
      if (!modelInfo.contributions) {
        message.error('modelInfo.contributions is empty');
        return;
      }
      
      setNodeInfoData(modelInfo);
      setShowNodeDetails(true); 
      setShowModelEvolution(true);
    });
  };

  const resetAllNodesStyle = (lf) => {
    if (!lf || !lf.getGraphData) return;
    
    const graphData = lf.getGraphData();
    graphData.nodes.forEach(node => {
      lf.setProperties(node.id, { selected: false });
    });
  };

  const highlightNode = (lf, nodeId) => {
    if (!lf || !lf.setProperties) return;
    
    try {
      lf.setProperties(nodeId, { selected: true });
    } catch (error) {
      console.error("highlight node failed", error);
    }
  };

  useEffect(() => {
    return () => {
      if (lf && selectedNodeId) {
        resetAllNodesStyle(lf);
      }
    };
  }, [lf, selectedNodeId]);

  useEffect(() => {
    if (lf && selectedNodeId) {
      setTimeout(() => {
        highlightNode(lf, selectedNodeId);
      }, 100);
    }
  }, [lf, testPrimitiveData]);

  useEffect(() => {
    if (refContainer?.current) {
      const logicFlow = new LogicFlow({
        container: refContainer?.current,
        isSilentMode: true,
        grid: {
          size: 10,
          /**
           * 网格是否可见
           */
          visible: false,

          config: {
            /**
             * 网格的颜色
             */
            color: '#f5f5f5',
          },
        },
        background: {
          backgroundColor: '#f5f5f5',
        },
        textEdit: false,
        autoResize: true,
        plugins: [Dagre],

      });


      logicFlow.on('graph:rendered', () => {
        logicFlow.fitView(200);
      });

      registerStartNode(logicFlow);
      registerChildNode(logicFlow);
      logicFlow.setDefaultEdgeType('myBezier');
      logicFlow.register(CustomArrow);
      setLf(logicFlow);
      lfEvent(logicFlow);

    }
    return () => {
      if (lfRef?.current) {
        lfRef?.current?.clearData();
      }
    };
  }, [refContainer?.current]);



  const renderNodeDetails = (nodeData) => {
    const colorMap = {
      Based: '#5B8FF9',
      AIGO: '#5AD8A6',
      DATASET: '#5D7092',
      Builder: '#F6BD16',
      Validator: '#E8684A',
      ModelName: '#0056b3',
    };

    return (
      <Descriptions size={'small'} column={1}>
        <Descriptions.Item label={<span style={{ color: colorMap.ModelName }}>Model Name</span>}>
          <span style={{ color: colorMap.ModelName }}>
            {nodeData?.name}
          </span>
      </Descriptions.Item>

        <Descriptions.Item label={<span style={{ color: colorMap.Based }}>Based</span>}>
          <span style={{ color: colorMap.Based }}>
            {nodeData?.contributions?.Based}%
          </span>
        </Descriptions.Item>
        <Descriptions.Item label={<span style={{ color: colorMap.AIGO }}>AIGO</span>}>
          <span style={{ color: colorMap.AIGO }}>
            {nodeData?.contributions?.AIGO}%
          </span>
        </Descriptions.Item>
        <Descriptions.Item label={<span style={{ color: colorMap.DATASET }}>DATASET</span>}>
          <span style={{ color: colorMap.DATASET }}>
            {nodeData?.contributions?.DATASET}%
          </span>
        </Descriptions.Item>
        <Descriptions.Item label={<span style={{ color: colorMap.Builder }}>Builder</span>}>
          <span style={{ color: colorMap.Builder }}>
            {nodeData?.contributions?.Builder}%
          </span>
        </Descriptions.Item>
        <Descriptions.Item label={<span style={{ color: colorMap.Validator }}>Validator</span>}>
          <span style={{ color: colorMap.Validator }}>
            {nodeData?.contributions?.Validator}%
          </span>
        </Descriptions.Item>
      </Descriptions>
    );
  };

  const renderContributionPieChart = (nodeData) => {
    if (!nodeData || !nodeData.contributions) {
      console.log("No contributions data available");
      return null;
    }

    const data = [
      { name: 'Based', value: parseInt(nodeData.contributions.Based, 10) || 0 },
      { name: 'AIGO', value: parseInt(nodeData.contributions.AIGO, 10) || 0 },
      { name: 'DATASET', value: parseInt(nodeData.contributions.DATASET, 10) || 0 },
      { name: 'Builder', value: parseInt(nodeData.contributions.Builder, 10) || 0 },
      { name: 'Validator', value: parseInt(nodeData.contributions.Validator, 10) || 0 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
    const total = data.reduce((a, b) => a + b.value, 0);

    // 简洁的内部百分比标签
    const renderCustomizedInnerLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
      const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
      
      if (percent < 0.05) return null;
      
      return (
        <text 
          x={x} 
          y={y} 
          fill="white" 
          textAnchor="middle" 
          dominantBaseline="central"
          style={{ 
            fontWeight: 'bold', 
            fontSize: percent > 0.1 ? '16px' : '12px',
            textShadow: '0px 0px 2px rgba(0,0,0,0.7)'
          }}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    };

    return (
      <div style={{ 
        width: '100%', 
        height: 300, 
        display: 'flex',
        justifyContent: 'center' // 居中显示
      }}>
        {/* 增加容器宽度 */}
        <div style={{ width: '80%', height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedInnerLabel}
                outerRadius={90}
                innerRadius={45}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${(value / total * 100).toFixed(0)}%`, name]} 
              />
              <Legend 
                layout="horizontal" 
                align="center" 
                verticalAlign="bottom"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const handleContributionWeightClick = () => {
    if (!nodeInfoData) {
        message.error('nodeInfoData is empty');
        return;
    }

    const nodeNames = Object.keys(modelsContributions);

    const initialPercentages = nodeNames.reduce((acc, name) => {
        acc[name] = modelsContributions[name]?.contributions?.Based || 0;
        
        // 确保 Incentives 数组存在并且有元素
        if (modelsContributions[name]?.Incentives?.length > 0) {
            modelsContributions[name].Incentives[0].reward = `${random4Digits()}`;
        } else {
            // 如果 Incentives 不存在或为空，初始化它
            modelsContributions[name].Incentives = [{
                modelId: '',
                name: `${name}.1`,
                rate: '100%',
                reward: `${random4Digits()}`,
            }];
        }
        
        return acc;
    }, {});

    setPercentages(initialPercentages);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    const total = Object.values(percentages).reduce((sum, value) => sum + value, 0);
    if (total !== 100) {
        message.error('Total must be 100%');
        return;
    }

    // 更新每个节点的 Based 值
    const updatedContributions = { ...modelsContributions };
    Object.keys(percentages).forEach(nodeName => {
        if (updatedContributions[nodeName]) {
            updatedContributions[nodeName].contributions.Based = percentages[nodeName];
        }
    });

    modelsContributionsRef.current = updatedContributions;
    setModelsContributions(updatedContributions);
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handlePercentageChange = (value: number, key: string) => {
    setPercentages((prev) => ({
        ...prev,
        [key]: value,
    }));

    // 更新对应节点的 reward 值
    const updatedContributions = { ...modelsContributions };
    if (updatedContributions[key]) {
        updatedContributions[key].Incentives[0].reward = `${random4Digits()}`;
    }
    setModelsContributions(updatedContributions);
  };


  useEffect(() => {
    console.log("Updated baseContribution =", baseContribution);
  }, [baseContribution]);

  useEffect(() => {
    baseContributionRef.current = baseContribution;
  }, [baseContribution]);

  const handleStartButtonClick = (nodeData) => {
    setIsAnimating(true);
    setTimeout(() => {
      createNewNode(nodeData);
      setIsAnimating(false);
    }, 5000); // 动画持续时间为5秒
  };

  const createNewNode = (parentNodeData) => {
    const newNodeId = generate25DigitID();
    const parentName = parentNodeData.name;

    const existingChildNames = [];
    const findExistingChildren = (tree, targetParentName) => {
      if (tree.nodeData.name === targetParentName) {
        tree.children.forEach(child => {
          existingChildNames.push(child.nodeData.name);
        });
        return true;
      }
      
      for (let i = 0; i < tree.children.length; i++) {
        if (findExistingChildren(tree.children[i], targetParentName)) {
          return true;
        }
      }
      
      return false;
    };
    
    testPrimitiveData.forEach(tree => {
      findExistingChildren(tree, parentName);
    });
    
    let newNodeName;
  
    if (parentName === 'Base Model') {
      const vNodes = [];
      const collectVNodes = (tree) => {
      const stack = [tree];
      while (stack.length > 0) {
        const node = stack.pop();
          if (node.nodeData.name !== 'Base Model' && 
              node.nodeData.name.match(/^V\d+$/)) { 
            vNodes.push(node.nodeData.name);
          }
        node.children.forEach(child => stack.push(child));
      }
      };
      
      testPrimitiveData.forEach(tree => collectVNodes(tree));
    
      let maxVNumber = 0;
      vNodes.forEach(name => {
        const match = name.match(/^V(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxVNumber) {
            maxVNumber = num;
          }
        }
      });

      newNodeName = `V${maxVNumber + 1}`;
    } else if (parentName.includes('.')) {
      let suffix = 1;
      while (existingChildNames.includes(`${parentName}.${suffix}`)) {
        suffix++;
      }
      newNodeName = `${parentName}.${suffix}`;
    } else {
      let suffix = 1;
      while (existingChildNames.includes(`${parentName}.${suffix}`)) {
        suffix++;
      }
      newNodeName = `${parentName}.${suffix}`;
    }
    
    const parentContributions = parentNodeData.contributions;

    const newBasedValue = Math.floor(parentContributions.Based / 2);
    
    const remainingValue = 100 - (newBasedValue + parentContributions.AIGO + parentContributions.Builder + parentContributions.Validator);
    
    const newContributions = {
      Based: newBasedValue,
      AIGO: parentContributions.AIGO,
      DATASET: remainingValue,
      Builder: parentContributions.Builder,
      Validator: parentContributions.Validator,
    };
    
    const newNodeData = {
      nodeData: {
        nodeId: newNodeId,
        name: newNodeName,
        isNewNode: true,
      },
      children: [],
    };
    
    const updatedPrimitiveData = JSON.parse(JSON.stringify(testPrimitiveData));
    const addChildToNode = (node, parentName) => {
      if (node.nodeData.name === parentName) {
        node.children.push(newNodeData);
        return true;
      }
      
      for (let i = 0; i < node.children.length; i++) {
        if (addChildToNode(node.children[i], parentName)) {
          return true;
        }
      }
      
      return false;
    };
    let nodeAdded = false;
    updatedPrimitiveData.forEach(tree => {
      if (addChildToNode(tree, parentName)) {
        nodeAdded = true;
      }
    });
    
    if (!nodeAdded) {
      console.error(`Can't find parent node: ${parentName}`);
      return;
    }
    

    const newModelInfo = {
      modelId: '',
      name: newNodeName,
      parentModel: parentName,
      dataset: {
        id: 'asdfasdfasdf',
        name: 'clinical-data-50k',
        contributors: [
          { name: 'Alice', rate: '10%' },
          { name: 'Bob', rate: '50%' },
          { name: 'Charlie', rate: '40%' },
        ],
      },
      training: {
        id: 'asdfasdfasdf',
        type: 'SFT',
        author: 'Bob',
        date: '2020-01-01',
        fingerPrint: '0xdc93112d09a205d1caa35b3756b227392176bee8a1afd03cff51c51cd6c3423f',
        accuracy: 0.8,
      },
      Incentives: [
        {
          modelId: '',
          name: `${newNodeName}.3`,
          rate: '15%',
          reward: `${random4Digits()}`,
        },
        {
          modelId: '',
          name: `${newNodeName}.2`,
          rate: '15%',
          reward: `${random4Digits()}`,
        },
        {
          modelId: '',
          name: `${newNodeName}.1`,
          rate: '20%',
          reward: `${random4Digits()}`,
        },
        {
          modelId: '',
          name: newNodeName,
          rate: '50%',
          reward: `${random4Digits()}`,
        },
      ],
      contributions: newContributions,
    };
    
    const updatedContributions = {
      ...modelsContributions,
      [newNodeName]: {
        ...newModelInfo,
        isManuallyModified: true,
        isNewNode: true
      }
    };
    
    setTestPrimitiveData(updatedPrimitiveData);
    setModelsContributions(updatedContributions);
    const newTotalModels = countTotalNodes();
    totalModelsRef.current = newTotalModels;
    setInfoData(prev => ({
      ...prev,
      TotalModels: newTotalModels
    }));
    
    if (lf) {
      const { nodes, edges } = transformTreeToFlowData(updatedPrimitiveData);
      lf.render({ nodes, edges });
      // @ts-ignore
      lf?.extension.dagre.layout({
        nodesep: 15,
        ranksep: 35,
      });
    }
    setManuallyModifiedNodes(prev => [...prev, newNodeName]);

    // 设置一个定时器，在1小时后移除 isNewNode 标记
    setTimeout(() => {
      // 找到新创建的节点并更新其属性
      const node = lf.getNodeModelById(newNodeId);
      if (node && typeof node.updateTrainingStatus === 'function') {
        node.updateTrainingStatus(false);
      }
      
      // 更新数据模型
      const updatedPrimitiveData = JSON.parse(JSON.stringify(testPrimitiveData));
      const updateNodeInTree = (node) => {
        if (node.nodeData.nodeId === newNodeId) {
          node.nodeData.isNewNode = false;
          return true;
        }
        
        for (let i = 0; i < node.children.length; i++) {
          if (updateNodeInTree(node.children[i])) {
            return true;
          }
        }
        
        return false;
      };
      
      updatedPrimitiveData.forEach(tree => {
        updateNodeInTree(tree);
      });
      
      setTestPrimitiveData(updatedPrimitiveData);
      
      // 更新 modelsContributions
      const updatedContributions = { ...modelsContributions };
      if (updatedContributions[newNodeName]) {
        updatedContributions[newNodeName].isNewNode = false;
        setModelsContributions(updatedContributions);
      }
    }, 3600000); // 1小时 = 3600000毫秒
  };

 
  useEffect(() => {
    const updatedContributions = { ...modelsContributions };
    let hasChanges = false;

    testPrimitiveData.forEach(tree => {
      const stack = [tree];
      while (stack.length > 0) {
        const node = stack.pop();
        const nodeName = node.nodeData.name;
        if (nodeName !== 'Base Model' && !manuallyModifiedNodes.includes(nodeName)) {
        
          const recalculatedData = modelData(node.nodeData);
          updatedContributions[nodeName] = {
            ...updatedContributions[nodeName],
            contributions: recalculatedData.contributions
          };
          
          hasChanges = true;
        }
        
        node.children.forEach(child => stack.push(child));
      }
    });

    if (hasChanges) {
      setModelsContributions(updatedContributions);
      if (nodeInfoData && nodeInfoData.name !== 'Base Model' && !manuallyModifiedNodes.includes(nodeInfoData.name)) {
        setNodeInfoData(updatedContributions[nodeInfoData.name]);
      }
    }
  }, [baseContribution]); 



  useEffect(() => {
    try {
      const savedNodes = localStorage.getItem('manuallyModifiedNodes');
      if (savedNodes) {
        const parsedNodes = JSON.parse(savedNodes);
        setManuallyModifiedNodes(parsedNodes);

      }
    } catch (e) {
      console.error('Failed to parse manuallyModifiedNodes from localStorage', e);
    }
  }, []);

  useEffect(() => {
    if (manuallyModifiedNodes.length > 0) {
      localStorage.setItem('manuallyModifiedNodes', JSON.stringify(manuallyModifiedNodes));
    }
  }, [manuallyModifiedNodes]);


  const findNodeDataInTree = (nodeName) => {
    for (const tree of testPrimitiveData) {
      const stack = [tree];
      while (stack.length > 0) {
        const node = stack.pop();
        if (node.nodeData.name === nodeName) {
          return node.nodeData;
        }
        node.children.forEach(child => stack.push(child));
      }
    }
    return null;
  };


  const renderModelEvolutionCard = () => {
    if (!showModelEvolution) return null;
    
    return (
      <Card
        size={'small'}
        title={
          <div style={{ 
            fontSize: '14px', 
            fontWeight: 600,
            color: '#1890ff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px' 
          }}>
            <span>Model Evolution</span>
          </div>
        }
        style={{
          position: 'absolute',
          bottom: '-19px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '800px',
          minHeight: '120px',
          zIndex: 1,
          borderRadius: '12px',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
          backgroundColor: '#ffffff',
          border: 'none',
        }}
        bodyStyle={{
          padding: '12px 16px',
        }}
        headStyle={{
          borderBottom: '1px solid #f0f0f0',
          padding: '8px 16px',
          minHeight: '32px',
        }}
      >
        <Row gutter={[16, 8]}>
          <Col span={16}>
            <Descriptions 
              size={'small'} 
              column={1}
              labelStyle={{
                color: '#666',
                fontWeight: 500,
                padding: '4px 0',
                fontSize: '13px',
              }}
              contentStyle={{
                color: '#333',
                fontWeight: 'normal',
                padding: '4px 0',
                fontSize: '13px',
              }}
            >
              <Descriptions.Item label='Model Name'>
                {nodeInfoData?.name}
              </Descriptions.Item>
              <Descriptions.Item label='Model Algorithm'>
                <Select defaultValue="SFT" style={{ width: '150px' }}>
                  <Select.Option value="SFT">SFT</Select.Option>
                  <Select.Option value="Algorithm 2">Algorithm 2</Select.Option>
                  <Select.Option value="Algorithm 3">Algorithm 3</Select.Option>
                </Select>
              </Descriptions.Item>
              <Descriptions.Item label='Dataset'>
                <Select defaultValue="clinical-data-50k" style={{ width: '150px' }}>
                  <Select.Option value="clinical-data-50k">clinical-data-50k</Select.Option>
                  <Select.Option value="dataset-100k">dataset-100k</Select.Option>
                  <Select.Option value="dataset-200k">dataset-200k</Select.Option>
                </Select>
              </Descriptions.Item>
              <Descriptions.Item label='Builder'>
                <Select mode="multiple" defaultValue={['Alice', 'Bob']} style={{ width: '100%' }}>
                  <Select.Option value="Alice">Alice</Select.Option>
                  <Select.Option value="Bob">Bob</Select.Option>
                  <Select.Option value="Charlie">Charlie</Select.Option>
                  <Select.Option value="David">David</Select.Option>
                </Select>
              </Descriptions.Item>
      </Descriptions>
          </Col>
          <Col span={8} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            gap: '8px'
          }}>
            <Button 
              type="primary" 
              size="middle"
              style={{ 
                borderRadius: '6px',
                fontWeight: 500,
                fontSize: '13px',
                height: '32px',
              }} 
              onClick={handleContributionWeightClick}
            >
              Contribution Weight
            </Button>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              gap: '8px',
              position: 'relative',
            }}>
              <Button 
                type="default" 
                size="middle"
                style={{ 
                  flex: 1,
                  height: '32px',
                  borderRadius: '6px',
                  fontWeight: 500,
                  fontSize: '13px',
                  borderColor: '#1890ff',
                  color: isAnimating ? '#ffffff' : '#1890ff',
                  position: 'relative',
                  overflow: 'hidden',
                  zIndex: 1,
                }}
                onClick={() => handleStartButtonClick(nodeInfoData)}
                disabled={isAnimating}
              >
                Train
                {isAnimating && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: '#1890ff',
                      zIndex: -1,
                      animation: 'fillAnimation 5s linear forwards'
                    }}
                  />
                )}
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
    );
  };


  const forceUpdateModelsContributions = () => {

    const updatedContributions = {...modelsContributionsRef.current};
    let hasChanges = false;
    
    manuallyModifiedNodes.forEach(nodeName => {
      if (nodeName in updatedContributions) {
        if (!updatedContributions[nodeName].isManuallyModified) {
          updatedContributions[nodeName].isManuallyModified = true;
          hasChanges = true;
        }
      } else {
        const nodeData = findNodeDataInTree(nodeName);
        if (nodeData) {

          updatedContributions[nodeName] = modelData(nodeData);
          updatedContributions[nodeName].isManuallyModified = true;
          hasChanges = true;
        }
      }
    });
    
    if (hasChanges) {
      modelsContributionsRef.current = updatedContributions; 
      setModelsContributions({...updatedContributions});
    }
  };

  useEffect(() => {
    modelsContributionsRef.current = modelsContributions;
  }, []);

  useEffect(() => {
    if (JSON.stringify(modelsContributionsRef.current) !== JSON.stringify(modelsContributions)) {
      modelsContributionsRef.current = {...modelsContributions};
    }
  }, [modelsContributions]);

  return (
    <PageContainer
      pageHeaderRender={false}
      childrenContentStyle={{
        padding: '0',
      }}
      ghost
      className='homeContent'
      style={{ padding: '20px', background: '#f0f2f5' }}
    >
      <style>
        {`
          @keyframes fillAnimation {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(0);
            }
          }
              background-position: 0 0;
            }
          }

          .train-button {
            background: linear-gradient(270deg, #1890ff, #1890ff);
            background-size: 200% 100%;
            animation: fillAnimation 5s linear forwards;
          }
        `}
      </style>
      <div
        className={styles.ModelFlow}
        ref={refContainer}
      ></div>
      <Card
        title="Info"
        size={'small'}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '220px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          background: 'linear-gradient(135deg, #f0f2f5, #e6f7ff)', // 渐变背景
          padding: '16px',
          border: 'none',
        }}
      >
        <Descriptions 
          size={'small'} 
          column={1}
          labelStyle={{
            fontWeight: 600,
            width: '50%',
            display: 'inline-block',
            textAlign: 'left',
            paddingRight: '8px',
          }}
          contentStyle={{
            color: '#0056b3', 
            fontWeight: 500,
            width: '50%',
            display: 'inline-block',
            textAlign: 'right',
          }}
        >
          <Descriptions.Item label="Total Models">
            {totalModelsRef.current}
          </Descriptions.Item>
          <Descriptions.Item label="Data Sets">
            {infoData?.DataSets}
          </Descriptions.Item>
          <Descriptions.Item label="Launched Models">
            {infoData?.LaunchedModels}
          </Descriptions.Item>
          <Descriptions.Item label="Validator">
            {infoData?.Validator}
          </Descriptions.Item>
          <Descriptions.Item label="Builder">
            {infoData?.Builder}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {renderModelEvolutionCard()}

      {showNodeDetails && (
      <Card
        size={'small'}
        style={{
          position: 'absolute',
            top: '10px',
          right: '10px',
            width: '300px',
            height: '450px',
            zIndex: 2,
            overflow: 'hidden',
            borderRadius: '12px',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
            backgroundColor: '#ffffff',
            padding: '16px',
          }}
        >
          {renderNodeDetails(nodeInfoData)}
          <div style={{ height: '250px', marginTop: '10px' }}> 
            {renderContributionPieChart(nodeInfoData)}
          </div>
        </Card>
      )}

      <Modal
        title={
          <div style={{
            fontSize: '16px',
            fontWeight: 500,
            color: '#1890ff',
          }}>
            Contribution Weight
          </div>
        }
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={480}
        centered
        bodyStyle={{
          padding: '16px',
        }}
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
        }}
        footer={
          <div style={{ 
            padding: '12px 24px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px'
          }}>
            <Button onClick={handleModalCancel}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleModalOk}>
              Confirm
            </Button>
          </div>
        }
      >
        <div style={{ marginBottom: '16px', color: '#666' }}>
          Total must be 100%
        </div>
        
        <div style={{ 
          backgroundColor: '#fafafa',
          padding: '16px',
          borderRadius: '8px',
        }}>
          {/* 添加表头，使布局更清晰 */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '12px',
            fontWeight: 'bold',
            color: '#666'
          }}>
            <span style={{ width: '120px' }}>Model</span>
            <span style={{ width: '90px', textAlign: 'center' }}>Percentage</span>
            <span style={{ width: '80px', textAlign: 'center' }}>Reward</span>
          </div>

          {/* 首先单独渲染 Base Model */}
          {modelsContributions['Base Model'] && (
            <div key="Base Model" style={{ marginBottom: '12px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '4px',
                alignItems: 'center'
              }}>
                <span style={{ 
                  fontWeight: 500, 
                  color: '#5B8FF9',
                  width: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>Base Model</span>
                <div style={{ width: '90px', textAlign: 'center' }}>
                  <Select
                    value={percentages['Base Model']}
                    onChange={(value) => handlePercentageChange(value, 'Base Model')}
                    style={{ width: 90 }}
                  >
                    {/* 生成0到100之间的数字，步长为5 */}
                    {Array.from({ length: 21 }, (_, i) => i * 5).map((value) => (
                      <Select.Option key={value} value={value}>
                        {value}%
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <span style={{ 
                  fontWeight: 500, 
                  color: '#5B8FF9',
                  width: '80px',
                  textAlign: 'center'
                }}>
                  {modelsContributions['Base Model']?.Incentives?.[0]?.reward || 'N/A'}
                </span>
              </div>
            </div>
          )}
          
          {/* 然后渲染其他所有节点，使用相同的布局结构 */}
          {Object.keys(modelsContributions)
            .filter(nodeName => nodeName !== 'Base Model')
            .map(nodeName => {
              const node = modelsContributions[nodeName];
              const incentives = node.Incentives || [];
              return (
                <div key={nodeName} style={{ marginBottom: '12px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '4px',
                    alignItems: 'center'
                  }}>
                    <span style={{ 
                      fontWeight: 500, 
                      color: '#5B8FF9',
                      width: '120px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>{nodeName}</span>
                    <div style={{ width: '90px', textAlign: 'center' }}>
                      <Select
                        value={percentages[nodeName]}
                        onChange={(value) => handlePercentageChange(value, nodeName)}
                        style={{ width: 90 }}
                      >
                        {/* 生成0到100之间的数字，步长为5 */}
                        {Array.from({ length: 21 }, (_, i) => i * 5).map((value) => (
                          <Select.Option key={value} value={value}>
                            {value}%
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                    <span style={{ 
                      fontWeight: 500, 
                      color: '#5B8FF9',
                      width: '80px',
                      textAlign: 'center'
                    }}>
                      {incentives[0]?.reward || 'N/A'}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        <div style={{ 
          marginTop: '16px',
          padding: '12px 16px',
          backgroundColor: '#fafafa',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ color: '#666' }}>Current Total:</span>
          <span style={{ 
            color: Object.values(percentages).reduce((sum, value) => sum + value, 0) === 100 ? '#52c41a' : '#ff4d4f',
            fontWeight: 500,
            fontSize: '16px',
          }}>
            {Object.values(percentages).reduce((sum, value) => sum + value, 0)}%
          </span>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default HomePage;

