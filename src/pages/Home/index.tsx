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
import { Card, Col, Descriptions, Flex, message, Popover, Row, Statistic, Typography, Pie, Button, Modal, Select } from 'antd';
import ChatBaseView from '@/pages/Home/components/Chat';
import ChatModal from '@/pages/Home/components/Chat/ChatModal';
import { ArrowLeftOutlined, DollarOutlined } from '@ant-design/icons';
import logicFlow from '@logicflow/core/src/LogicFlow';
import ProCard from '@ant-design/pro-card';
import { Pie as AntPie } from '@ant-design/charts';

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
    DataSets: 14,
    LaunchedModels: 0,
    Validator:10,
    Builder: 5,
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
      model.name = "medical-1.0";
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

    return {
      modelId: '',
      name: model?.name,
      parentModel: model?.name === 'Base Model' ? '' : 
                  model?.name.startsWith('V2.') ? 'V2' : 
                  'Base Model',
      ...commonData, 
      Incentives: [
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
      ],
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
        },
        text: {
          x,
          y,
          value: node.nodeData.name,
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
      if (clickTimer) {
        clearTimeout(clickTimer);
        clickTimer = null;
      }
      
      const nodeId = data?.data?.id;
      const nodeName = data?.data?.properties?.rawData?.nodeData?.name;
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
    return (
      <Descriptions size={'small'} column={1}>
        <Descriptions.Item label='Based'>
          {nodeData?.contributions?.Based}%
        </Descriptions.Item>
        <Descriptions.Item label='AIGO'>
          {nodeData?.contributions?.AIGO}%
        </Descriptions.Item>
        <Descriptions.Item label='DATASET'>
          {nodeData?.contributions?.DATASET}%
        </Descriptions.Item>
        <Descriptions.Item label='Builder'>
          {nodeData?.contributions?.Builder}%
        </Descriptions.Item>
        <Descriptions.Item label='Validator'>
          {nodeData?.contributions?.Validator}%
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
        { type: 'Based', value: parseInt(nodeData.contributions.Based, 10) || 0 },
        { type: 'AIGO', value: parseInt(nodeData.contributions.AIGO, 10) || 0 },
        { type: 'DATASET', value: parseInt(nodeData.contributions.DATASET, 10) || 0 },
        { type: 'Builder', value: parseInt(nodeData.contributions.Builder, 10) || 0 },
        { type: 'Validator', value: parseInt(nodeData.contributions.Validator, 10) || 0 },
    ];
    const config = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            type: 'outer',
            content: ({ percent, type }) => `${type}: ${(percent * 100).toFixed(0)}%`,
            style: {
                fontSize: 12,
                textAlign: 'center',
            },
        },
        legend: {
            position: 'bottom',
        },
    };

    return <AntPie {...config} />;
  };

  const handleContributionWeightClick = () => {
    if (!nodeInfoData) {
      message.error('nodeInfoData is empty');
      return;
    }
    
    if (!nodeInfoData.name) {
      message.error('nodeInfoData.name is empty');
      return;
    }
    
    if (!nodeInfoData.contributions) {
      message.error('nodeInfoData.contributions is empty');
      return;
    }

    setPercentages({
      Based: nodeInfoData.contributions.Based || 0,
      AIGO: nodeInfoData.contributions.AIGO || 0,
      DATASET: nodeInfoData.contributions.DATASET || 0,
      Builder: nodeInfoData.contributions.Builder || 0,
      Validator: nodeInfoData.contributions.Validator || 0,
    });
    
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    const total = Object.values(percentages).reduce((sum, value) => sum + value, 0);
    if (total !== 100) {
        message.error('total is not 100');
        return;
    }

    if (!nodeInfoData || !nodeInfoData.name) {
        message.error('nodeInfoData or nodeInfoData.name is empty');
        return;
    }

    const nodeName = nodeInfoData.name;
    const updatedNodeInfo = JSON.parse(JSON.stringify(nodeInfoData));
    updatedNodeInfo.contributions = {...percentages};
    updatedNodeInfo.isManuallyModified = true;
    const updatedContributions = {
      ...modelsContributions,
      [nodeName]: updatedNodeInfo
    };
    
    modelsContributionsRef.current = updatedContributions;
    setModelsContributions(updatedContributions);

    let updatedModifiedNodes = [...manuallyModifiedNodes];
    if (!manuallyModifiedNodes.includes(nodeName)) {
      updatedModifiedNodes = [...manuallyModifiedNodes, nodeName];
      setManuallyModifiedNodes(updatedModifiedNodes);
    }

    if (nodeName === 'Base Model') {
      setBaseContribution({...percentages});
      baseContributionRef.current = {...percentages};
    }
    
    setNodeInfoData(updatedNodeInfo);
    setIsModalVisible(false);
    
   
    // setTimeout(() => {

    //   if (JSON.stringify(modelsContributions[nodeName]?.contributions) !== 
    //       JSON.stringify(percentages)) {

    //     console.log("期望的贡献数据:", percentages);
    //     console.log("实际的贡献数据:", modelsContributions[nodeName]?.contributions);
    //     console.log("ref中的贡献数据:", modelsContributionsRef.current[nodeName]?.contributions);
        
    //     // 尝试强制更新
    //     forceUpdateModelsContributions();
    //   }
    // }, 1000);


  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handlePercentageChange = (value: number, key: string) => {
    setPercentages((prev) => ({
      ...prev,
      [key]: value,
    }));
  };


  useEffect(() => {
    console.log("Updated baseContribution =", baseContribution);
  }, [baseContribution]);

  useEffect(() => {
    baseContributionRef.current = baseContribution;
  }, [baseContribution]);

  const handleStartButtonClick = (nodeData) => {
    setCountdownNodeId(nodeData.name);
    setCountdown(5);
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          createNewNode(nodeData);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
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
        isManuallyModified: true  
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
        title={'Model Evolution'}
        style={{
          position: 'absolute',
          bottom: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: '800px',
          minHeight: '150px',
          zIndex: 1,
        }}
      >
        <Row>
          <Col span={16}>
            <Descriptions size={'small'} column={1}>
              <Descriptions.Item label='Model Name'>
                {nodeInfoData?.name}
              </Descriptions.Item>
              <Descriptions.Item label='Model Algorithm'>
                SFT
              </Descriptions.Item>
              <Descriptions.Item label='Dataset'>
                clinical-data-50k
              </Descriptions.Item>
              <Descriptions.Item label='Contributors'>
                Alice, Bob, Charlie
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Button type="primary" style={{ marginBottom: '10px' }} onClick={handleContributionWeightClick}>
              Contribution Weight
            </Button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button 
                type="default" 
                style={{ width: countdown && countdownNodeId === nodeInfoData.name ? '60%' : '48%' }}
                onClick={() => handleStartButtonClick(nodeInfoData)}
                disabled={countdown > 0 && countdownNodeId === nodeInfoData.name}
              >
                Train
              </Button>
              {countdown > 0 && countdownNodeId === nodeInfoData.name && (
                <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>{countdown}s</span>
              )}
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
      style={{ padding: '0', background: 'white' }}
    >
      <div
        className={styles.ModelFlow}
        ref={refContainer}
      ></div>
      <Card
        title={''}
        size={'small'}
        style={{ position: 'absolute', top: '10px', left: '10px', width: '200px' }}>
        <Descriptions size={'small'} column={1}>
          <Descriptions.Item label='TotalModels'>
            {totalModelsRef.current}
          </Descriptions.Item>
          <Descriptions.Item label='DataSets'>
            {infoData?.DataSets}
          </Descriptions.Item>
          <Descriptions.Item label='LaunchedModels'>
            {infoData?.LaunchedModels}
          </Descriptions.Item>
          <Descriptions.Item label='Validator'>
            {infoData?.Validator}
          </Descriptions.Item>
          <Descriptions.Item label='Builder'>
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
            height: '500px',
            zIndex: 2,
            overflow: 'hidden',
          }}
          title={'Node details'}
        >
          {renderNodeDetails(nodeInfoData)}
          <div style={{ height: '250px', marginTop: '10px' }}> 
            {renderContributionPieChart(nodeInfoData)}
          </div>
        </Card>
      )}

      <Modal
        title="Contribution Weight"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancle
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalOk}>
            Confirm
          </Button>,
        ]}
      >
        <div style={{ marginBottom: 16 }}>The sum must equal 100%</div>
        <Descriptions size={'small'} column={2}>
            {Object.keys(percentages).map((key) => (
                <React.Fragment key={key}>
                    <Descriptions.Item label={key}>
                        <Select
                            value={percentages[key]}
                            onChange={(value) => handlePercentageChange(value, key)}
                            style={{ width: 120 }}
                        >
                            {Array.from({ length: 11 }, (_, i) => i * 10).map((value) => (
                                <Select.Option key={value} value={value}>
                                    {value}%
                                </Select.Option>
                            ))}
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="reward">
                        <Typography.Text>{random4Digits()}</Typography.Text>
                    </Descriptions.Item>
                </React.Fragment>
            ))}
        </Descriptions>
        <div style={{ marginTop: 16 }}>
            current sum: {Object.values(percentages).reduce((sum, value) => sum + value, 0)}%
        </div>
      </Modal>
    </PageContainer>
  );
};

export default HomePage;

