import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';
import './index.less';
import React, { useEffect, useRef, useState } from 'react';
import { LogicFlow } from '@logicflow/core';
import useStateRef from 'react-usestateref';
import { registerStartNode } from '@/pages/Home/components/StartNode/startNode';
import { registerChildNode } from '@/pages/Home/components/ChildNode/childNode';
import CustomArrow from './components/CustomArrow';
import Dagre from './components/tools/dagre';
import { Card, Col, Descriptions, Flex, message, Popover, Row, Statistic, Typography, Button, Modal, Select } from 'antd';
import { PlusOutlined, EditOutlined, CloseOutlined, EyeOutlined, PercentageOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, Legend, Tooltip, Label, ResponsiveContainer } from 'recharts';
import { registerNewWhiteNode } from './components/NewWhiteNode/newWhiteNode';
import ChatModal from './components/Chat/ChatModal';

const BASEMODEL = "Medical Model"
const BASEMODEL_V2 = "Home Doctor"
const BASEMODEL_V3 = "Family Doctor"  
const BASEMODEL_V2_1 = "Dentist"
const BASEMODEL_V2_2 = "Cardiologist"




const HomePage: React.FC = () => {
  const refContainer = useRef(null);
  const [lf, setLf, lfRef] = useStateRef<LogicFlow | null>(null);
  const [infoData, setInfoData] = useState<any>({});
  const [showChatModel, setShowChatModel] = useState({ showModel: false, data: {} });
  const [nodeInfoData, setNodeInfoData] = useState<any>({});
  const [showModelEvolution, setShowModelEvolution] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBased, setIsBased] = useState(true);

  const [baseCacheValue, setBaseCacheValue] = useState('');

  const [percentages, setPercentages] = useState({
    Based: 0,
    ALGO: 0,
    DATASET: 0,
    Builder: 0,
    Validator: 0,
  });
  const infoDefaultData: any = {
    TotalModels: 5,
    DataSets: 3,
    LaunchedModels: 3,
    Validator: 10,
    Builder: 4,
  };
  const [modelsContributions, setModelsContributions] = useState<{ [key: string]: any }>({});
  const [baseContribution, setBaseContribution] = useState({
    Based: 40,
    ALGO: 20,
    DATASET: 20,
    Builder: 10,
    Validator: 10,
  });
  const baseContributionRef = useRef(baseContribution);
  const [manuallyModifiedNodes, setManuallyModifiedNodes] = useState<string[]>([]);
  const modelsContributionsRef = useRef<{ [key: string]: any }>({});
  const totalModelsRef = useRef(5);
  const [showNodeDetails, setShowNodeDetails] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // 为每个类别存储单独的百分比
  const [categoryPercentages, setCategoryPercentages] = useState({
    Based: {},
    Algo: {},
    Dataset: {},
    Builder: {},
    Validator: {},
  });

  // 添加一个状态来控制动画
  const [nodeDetailsVisible, setNodeDetailsVisible] = useState(false);

  // 添加一个状态来存储树形图数据
  const [treeDisplayCache, setTreeDisplayCache] = useState('');
  const [treeUpdateCounter, setTreeUpdateCounter] = useState(0);

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
        name: BASEMODEL,
      },
      children: [
        {
          nodeData: {
            nodeId: generate25DigitID(),
            name: BASEMODEL_V2,
          },
          children: [
            {
              nodeData: {
                nodeId: generate25DigitID(),
                name: BASEMODEL_V2_1,
              },
              children: [],
            },
            {
              nodeData: {
                nodeId: generate25DigitID(),
                name: BASEMODEL_V2_2,
              },
              children: [],
            },
          ],
        },
        {
          nodeData: {
            nodeId: generate25DigitID(),
            name: BASEMODEL_V3,
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

      if (modelName === BASEMODEL) {
        return baseContributionRef.current;
      }

      if (modelName.startsWith(BASEMODEL_V2)) {
        level = 1;
        if (modelName.includes('.')) {
          level = 2;
        }
      } else if (modelName.startsWith(BASEMODEL_V3)) {
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
        ALGO: baseContributionRef.current.ALGO,
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
      parentModel: model?.name === BASEMODEL ? '' :
        model?.name.startsWith(BASEMODEL_V2) ? BASEMODEL_V2 :
          BASEMODEL,
      ...commonData,
      Incentives: incentives, // 确保 Incentives 被正确设置
      contributions: contributionData,
    };
  };
  const transformTreeToFlowData = (treeData) => {
    const nodes = [];
    const edges = [];
    const processNode = (node, parentId = null, level = 0, index = 0) => {
      const { nodeData, children } = node;
      const { nodeId, name, isNewNode } = nodeData;

      // 确定节点类型
      let type = 'assignment';
      if (level === 0) {
        type = 'start';
      } else if (isNewNode === true) {
        // 如果是新节点，使用新的节点类型
        type = 'new-white-node';
      }

      // 创建节点
      const nodeObj = {
        id: nodeId,
        type: type,
        text: { value: name },
        properties: {
          name,
          isNewNode: !!isNewNode,
          rawData: node, // 保存原始数据
        },
      };

      // 添加节点
      nodes.push(nodeObj);

      // 如果有父节点，创建边
      if (parentId) {
        const edgeId = `edge-${parentId}-${nodeId}`;
        const edge = {
          id: edgeId,
          sourceNodeId: parentId,  // 父节点是源节点
          targetNodeId: nodeId,    // 当前节点是目标节点
          type: 'myBezier',
        };
        edges.push(edge);
      }

      // 处理子节点
      if (children && children.length > 0) {
        children.forEach((child, childIndex) => {
          processNode(child, nodeId, level + 1, childIndex);
        });
      }
    };

    treeData.forEach((tree, index) => {
      processNode(tree, null, 0, index);
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
    setNodeInfoData(initialData[BASEMODEL]);
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

        console.log("测试点击1 =", manuallyModifiedNodes)

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
        // setShowChatModel({
        //   showModel: true,
        //   data: data?.data?.properties?.rawData,
        // });

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

      setShowChatModel({
        showModel: true,
        data: data?.data?.properties?.rawData,
      });

      // const nodeId = data?.data?.id;
      // const nodeName = data?.data?.properties?.rawData?.nodeData?.name;

      // if (!nodeName) {
      //   message.error('cannot get node info');
      //   return;
      // }

      // setSelectedNodeId(nodeId);

      // let modelInfo;
      // const isModified = manuallyModifiedNodes.includes(nodeName);
      // if (nodeName && modelsContributionsRef.current[nodeName]) {
      //   modelInfo = JSON.parse(JSON.stringify(modelsContributionsRef.current[nodeName]));
      //   if (isModified) {
      //     modelInfo.isManuallyModified = true;
      //   }
      // }
      // else if (nodeName && modelsContributions[nodeName]) {
      //   modelInfo = JSON.parse(JSON.stringify(modelsContributions[nodeName]));
      //   if (isModified) {
      //     modelInfo.isManuallyModified = true;
      //   }
      // } else {
      //   modelInfo = modelData(data?.data?.properties?.rawData?.nodeData);
      //   const updatedContributions = {
      //     ...modelsContributions,
      //     [nodeName]: modelInfo
      //   };
      //   modelsContributionsRef.current = updatedContributions;
      //   setModelsContributions(updatedContributions);
      // }
      // if (!modelInfo.name) {
      //   modelInfo.name = nodeName;
      // }

      // if (!modelInfo.contributions) {
      //   message.error('modelInfo.contributions is empty');
      //   return;
      // }

      // setNodeInfoData(modelInfo);
      // setShowNodeDetails(true);
      // setShowModelEvolution(true);
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
      registerNewWhiteNode(logicFlow);
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
      ALGO: '#5AD8A6',
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
        <Descriptions.Item label={<span style={{ color: colorMap.ALGO }}>ALGO</span>}>
          <span style={{ color: colorMap.ALGO }}>
            {nodeData?.contributions?.ALGO}%
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
      { name: 'ALGO', value: parseInt(nodeData.contributions.ALGO, 10) || 0 },
      { name: 'DATASET', value: parseInt(nodeData.contributions.DATASET, 10) || 0 },
      { name: 'Builder', value: parseInt(nodeData.contributions.Builder, 10) || 0 },
      { name: 'Validator', value: parseInt(nodeData.contributions.Validator, 10) || 0 },
    ];

    const colorMap = {
      Based: '#5B8FF9',
      ALGO: '#5AD8A6',
      DATASET: '#5D7092',
      Builder: '#F6BD16',
      Validator: '#E8684A',
      ModelName: '#0056b3',
    };

    // 确保每个值都是实际的百分比值
    const renderCustomizedInnerLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
      const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

      if (value < 5) return null; // 如果百分比小于5%则不显示标签

      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontWeight: 'bold',
            fontSize: value > 10 ? '16px' : '12px',
            textShadow: '0px 0px 2px rgba(0,0,0,0.7)'
          }}
        >
          {`${value}%`}
        </text>
      );
    };

    return (
      <div style={{
        width: '100%',
        height: 300,
        display: 'flex',
        justifyContent: 'center'
      }}>
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
                  <Cell
                    key={`cell-${index}`}
                    fill={colorMap[entry.name]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value}%`, name]}
              />
              {/* <Legend 
                layout="horizontal" 
                align="center" 
                verticalAlign="bottom"
              /> */}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const initializeContributionData = (nodeName: string) => {
    const nodeContributions = modelsContributions[nodeName]?.contributions || {};

    const newCategoryPercentages = {
      Based: { [nodeName]: nodeContributions.Based || 0 },
      Algo: { [nodeName]: nodeContributions.ALGO || 0 },
      Dataset: { [nodeName]: nodeContributions.DATASET || 0 },
      Builder: { [nodeName]: nodeContributions.Builder || 0 },
      Validator: { [nodeName]: nodeContributions.Validator || 0 },
    };

    if (Object.values(nodeContributions).every(v => !v) && nodeInfoData?.contributions) {
      newCategoryPercentages.Based[nodeName] = nodeInfoData.contributions.Based || 0;
      newCategoryPercentages.Algo[nodeName] = nodeInfoData.contributions.ALGO || 0;
      newCategoryPercentages.Dataset[nodeName] = nodeInfoData.contributions.DATASET || 0;
      newCategoryPercentages.Builder[nodeName] = nodeInfoData.contributions.Builder || 0;
      newCategoryPercentages.Validator[nodeName] = nodeInfoData.contributions.Validator || 0;
    }

    setCategoryPercentages(newCategoryPercentages);
  };

  const handleContributionWeightClick = () => {
    if (!nodeInfoData) {
      message.error('nodeInfoData is empty');
      return;
    }

    initializeContributionData(nodeInfoData.name);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    if (!nodeInfoData?.name) return;
    const updatedContributions = {
      ...modelsContributions,
      [nodeInfoData.name]: {
        ...modelsContributions[nodeInfoData.name],
        contributions: {
          Based: categoryPercentages.Based[nodeInfoData.name] || 0,
          ALGO: categoryPercentages.Algo[nodeInfoData.name] || 0,
          DATASET: categoryPercentages.Dataset[nodeInfoData.name] || 0,
          Builder: categoryPercentages.Builder[nodeInfoData.name] || 0,
          Validator: categoryPercentages.Validator[nodeInfoData.name] || 0,
        }
      }
    };

    // 更新节点的贡献值
    const updateNodeInTree = (tree) => {
      if (tree.nodeData.name === nodeInfoData.name) {
        tree.nodeData.contributions = {
          Based: categoryPercentages.Based[nodeInfoData.name] || 0,
          ALGO: categoryPercentages.Algo[nodeInfoData.name] || 0,
          DATASET: categoryPercentages.Dataset[nodeInfoData.name] || 0,
          Builder: categoryPercentages.Builder[nodeInfoData.name] || 0,
          Validator: categoryPercentages.Validator[nodeInfoData.name] || 0,
        };
        return true;
      }

      for (const child of tree.children) {
        if (updateNodeInTree(child)) {
          return true;
        }
      }
      return false;
    };

    const updatedPrimitiveData = [...testPrimitiveData];
    updatedPrimitiveData.forEach(tree => updateNodeInTree(tree));

    setModelsContributions(updatedContributions);
    setTestPrimitiveData(updatedPrimitiveData);

    // 如果当前显示的节点信息就是被修改的节点，更新显示
    if (nodeInfoData.name === nodeInfoData?.name) {
      setNodeInfoData({
        ...nodeInfoData,
        contributions: updatedContributions[nodeInfoData.name].contributions
      });
    }

    // 添加到手动修改的节点列表中
    if (!manuallyModifiedNodes.includes(nodeInfoData.name)) {
      setManuallyModifiedNodes([...manuallyModifiedNodes, nodeInfoData.name]);
    }

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
    const newNodeName = `${parentName}.${Math.floor(Math.random() * 10) + 1}`;

    // 计算6小时后的时间戳
    const endTime = Date.now() + (6 * 60 * 60 * 1000);

    const newNodeData = {
      nodeData: {
        nodeId: newNodeId,
        name: newNodeName,
        isNewNode: true,
        endTime: endTime,
      },
      children: [],
    };

    console.log("Creating new node:", {
      parentName,
      newNodeName,
      newNodeId
    });

    const updatedPrimitiveData = JSON.parse(JSON.stringify(testPrimitiveData));
    const addChildToNode = (node, parentName) => {
      if (node.nodeData.name === parentName) {
        node.children.push(newNodeData);
        console.log("Added new node to parent:", {
          parent: parentName,
          newNode: newNodeData
        });
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

    setTestPrimitiveData(updatedPrimitiveData);

    if (lf) {
      const { nodes, edges } = transformTreeToFlowData(updatedPrimitiveData);

      // 找到新节点
      const newNode = nodes.find(node => node.id === newNodeId);
      if (newNode) {
        // 只设置节点名称，不包含训练信息
        newNode.text.value = newNodeName;
      }

      console.log("Transformed flow data:", { nodes, edges });
      lf.render({ nodes, edges });

      // 创建一个单独的倒计时元素
      const countdownElement = document.createElement('div');
      countdownElement.id = `countdown-${newNodeId}`;
      countdownElement.style.position = 'absolute';
      countdownElement.style.zIndex = '1000';
      countdownElement.style.background = 'rgba(255, 255, 255, 0.9)';
      countdownElement.style.padding = '2px 6px';
      countdownElement.style.borderRadius = '10px';
      countdownElement.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      countdownElement.style.display = 'flex';
      countdownElement.style.alignItems = 'center';
      countdownElement.style.fontSize = '12px';
      countdownElement.style.color = '#666666';
      countdownElement.style.pointerEvents = 'none'; // 确保不会干扰鼠标事件

      // 添加倒计时文本
      const textElement = document.createElement('span');
      textElement.innerHTML = 'training... (06:00:00)';
      countdownElement.appendChild(textElement);

      // 添加到文档中
      document.body.appendChild(countdownElement);

      // 添加旋转动画样式
      const styleElement = document.createElement('style');
      styleElement.innerHTML = `
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `;
      document.head.appendChild(styleElement);

      // 倒计时逻辑
      const updateCountdown = () => {
        const now = Date.now();
        const timeLeft = endTime - now;

        if (timeLeft <= 0) {
          // 时间到，更新节点状态
          const node = lf.getNodeModelById(newNodeId);
          if (node) {
            // 只更新节点名称，不包含训练信息
            node.updateText(newNodeName);

            // 获取当前属性
            const currentProps = node.getProperties();
            // 更新属性，保留原始数据
            node.setProperties({
              ...currentProps,
              isNewNode: false,
              rawData: {
                ...currentProps.rawData,
                nodeData: {
                  ...currentProps.rawData.nodeData,
                  isNewNode: false
                }
              }
            });

            // 重新渲染图形
            lf.render(lf.getGraphData());
          }
          return;
        }

        // 计算剩余时间
        const hours = Math.floor(timeLeft / (60 * 60 * 1000));
        const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);

        // 格式化时间
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // 更新节点文本，包含节点名称和训练信息
        const node = lf.getNodeModelById(newNodeId);
        if (node) {
          node.updateText(`${newNodeName}\ntraining... (${timeString})`);
        }

        // 继续倒计时
        requestAnimationFrame(updateCountdown);
      };

      // 开始倒计时
      setTimeout(() => {
        updateCountdown();
      }, 500);

      // 监听画布变换事件，确保倒计时元素跟随节点移动
      lf.on('transform', updateCountdown);

      // @ts-ignore
      lf?.extension.dagre.layout({
        nodesep: 15,
        ranksep: 35,
      });
    }
    setManuallyModifiedNodes(prev => [...prev, newNodeName]);

    // 6小时后更新节点状态
    setTimeout(() => {
      // 找到新创建的节点并更新其属性
      const node = lf.getNodeModelById(newNodeId);
      if (node) {
        // 获取当前属性
        const currentProps = node.getProperties();
        // 更新属性，保留原始数据
        node.setProperties({
          ...currentProps,
          isNewNode: false,
          rawData: {
            ...currentProps.rawData,
            nodeData: {
              ...currentProps.rawData.nodeData,
              isNewNode: false
            }
          }
        });

        // 重新渲染图形
        lf.render(lf.getGraphData());
      }

      // 移除倒计时元素
      const countdownElement = document.getElementById(`countdown-${newNodeId}`);
      if (countdownElement) {
        countdownElement.remove();
      }

      // 移除事件监听
      lf.off('transform', updateCountdown);

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
    }, 6 * 60 * 60 * 1000); // 6小时
  };


  useEffect(() => {
    const updatedContributions = { ...modelsContributions };
    let hasChanges = false;

    testPrimitiveData.forEach(tree => {
      const stack = [tree];
      while (stack.length > 0) {
        const node = stack.pop();
        const nodeName = node.nodeData.name;
        if (nodeName !== BASEMODEL && !manuallyModifiedNodes.includes(nodeName)) {

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
      if (nodeInfoData && nodeInfoData.name !== BASEMODEL && !manuallyModifiedNodes.includes(nodeInfoData.name)) {
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
            justifyContent: 'space-between',
            gap: '8px'
          }}>
            <span>Model Evolution</span>
            <Button
              type="text"
              icon={<CloseOutlined />}
              size="small"
              onClick={() => setShowModelEvolution(false)}
              style={{
                color: '#999',
                marginRight: '-8px',
              }}
            />
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


  useEffect(() => {
    modelsContributionsRef.current = modelsContributions;
  }, []);

  useEffect(() => {
    if (JSON.stringify(modelsContributionsRef.current) !== JSON.stringify(modelsContributions)) {
      modelsContributionsRef.current = { ...modelsContributions };
    }
  }, [modelsContributions]);

  const ContributionWeightContent = () => {
    const categories = ['Based', 'Algo', 'Dataset', 'Builder', 'Validator'];
    
    // 添加状态变量
    const [treeDisplayCache, setTreeDisplayCache] = useState('');
    const [treeUpdateCounter, setTreeUpdateCounter] = useState(0);
    const [basedValue, setBasedValue] = useState(categoryPercentages['Based'][nodeInfoData?.name || ''] || 0);
    
    // 监听 nodeInfoData 变化，当节点改变时重置缓存和 basedValue
    useEffect(() => {
      // 当节点变化时，更新 basedValue 并清除缓存
      setBasedValue(categoryPercentages['Based'][nodeInfoData?.name || ''] || 0);
      setTreeDisplayCache('');
      setTreeUpdateCounter(prev => prev + 1);
    }, [nodeInfoData?.name]);
    
    // 获取节点的父节点路径
    const getNodePath = (nodeName: string) => {
      const path: string[] = [];

      const findParent = (name: string) => {
        for (const tree of testPrimitiveData) {
          const stack = [{ node: tree, path: [] }];
          while (stack.length > 0) {
            const { node, path: currentPath } = stack.pop()!;
            if (node.nodeData.name === name) {
              return { found: true, path: [...currentPath, name] };
            }
            for (const child of node.children) {
              stack.push({ node: child, path: [...currentPath, node.nodeData.name] });
            }
          }
        }
        return { found: false, path: [] };
      };

      const result = findParent(nodeName);
      if (result.found) {
        path.push(...result.path);
      } else {
        path.push('base model');
      }

      return path;
    };

    // 计算每个父节点的分配百分比
    const calculateParentPercentages = (path: string[], category: string) => {
      const totalNodes = path.length;
      const percentagePerNode = totalNodes <= 1 ? 5 : Math.floor(5 / (totalNodes - 1));

      return path.map((node, index) => {
        if (index === path.length - 1) return 0; // 当前节点不分配百分比
        return percentagePerNode;
      });
    };

    // 根据路径生成树形显示 - 使用basedValue而不是直接从categoryPercentages获取
    const getTreeDisplay = (category: string) => {
      if (!nodeInfoData?.name) return '';

      if (category !== 'Based') {
        const currentValue = categoryPercentages[category][nodeInfoData.name] || 0;
        return `${nodeInfoData.name} (${currentValue}%)`;
      }

      // 如果有缓存且不是 Based 类别的更新，则使用缓存
      if (treeDisplayCache && category === 'Based') {
        return treeDisplayCache;
      }

      const path = getNodePath(nodeInfoData.name);
      const totalNodes = path.length;
      const treeLines: string[] = [];
      const maxLength = Math.max(...path.map(name => name.length)) + 2;

      // 生成加起来等于总和的随机分成
      const generateDistribution = (total: number) => {
        const types = ['Algo', 'Dataset', 'Builder', 'Validator'];
        // 确保total是非负数
        const safeTotal = Math.max(0, total);
        let remaining = safeTotal;
        const distribution = {};
    
        for (let i = 0; i < types.length - 1; i++) {
          if (remaining <= 0) {
            distribution[types[i]] = 0;
            continue;
          }
          // 确保最小值至少为0
          const minValue = Math.max(0, Math.min(1, remaining));
          // 确保最大值不小于最小值
          const maxValue = Math.max(minValue, remaining - (types.length - i - 1) * minValue);
          // 生成随机值，确保在有效范围内
          const value = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
          distribution[types[i]] = value;
          remaining -= value;
        }
    
        // 确保最后一个类型的值不为负
        distribution[types[types.length - 1]] = Math.max(0, remaining);
        return distribution;
      };
    
      for (let i = totalNodes - 1; i >= 0; i--) {
        const node = path[i];
        let percentage;
    
        if (i === totalNodes - 1) {
          // 使用basedValue而不是从categoryPercentages获取，确保非负
          percentage = Math.max(0, basedValue);
        } else {
          const childPercentage = treeLines[0].match(/\((\d+)%\)/);
          // 确保解析出的值是有效的数字，并且不小于0
          const parsedValue = childPercentage ? parseInt(childPercentage[1], 10) : 0;
          const maxPercentage = Math.max(0, Math.min(8, parsedValue));
          // 确保生成的随机值不为负
          percentage = maxPercentage > 0 ? 
            Math.floor(Math.random() * maxPercentage) + 1 : 0;
        }
    
        const distribution = generateDistribution(percentage);
    
        // 使用更短的固定宽度，只在节点名称后添加少量空格
        const paddedNode = node.padEnd(maxLength, '');
        const line = `${paddedNode}(${percentage}%)`;  // 移除了额外的空格
        treeLines.push(line);
    
        if (i > 0) {
          const prefix = '   |   ';
          treeLines.push(`${prefix}${node}-Algo:     ${distribution.Algo}%`);
          treeLines.push(`${prefix}${node}-Dataset:  ${distribution.Dataset}%`);
          treeLines.push(`${prefix}${node}-Builder:  ${distribution.Builder}%`);
          treeLines.push(`${prefix}${node}-Validator:${distribution.Validator}%`);
          treeLines.push('   |');
        } else {
          const prefix = '       ';
          treeLines.push(`${prefix}${node}-Algo:     ${distribution.Algo}%`);
          treeLines.push(`${prefix}${node}-Dataset:  ${distribution.Dataset}%`);
          treeLines.push(`${prefix}${node}-Builder:  ${distribution.Builder}%`);
          treeLines.push(`${prefix}${node}-Validator:${distribution.Validator}%`);
        }
      }
    
      const result = treeLines.join('\n');
      
      // 缓存树形图数据
      if (category === 'Based') {
        setTreeDisplayCache(result);
      }
      
      return result;
    };

    // 处理单个类别的百分比变化
    const handleCategoryChange = (value: number, category: string) => {
      if (!nodeInfoData?.name) return;

      const path = getNodePath(nodeInfoData.name);
      const parentPercentages = calculateParentPercentages(path, category);
      const totalParentPercentage = parentPercentages.reduce((sum, p) => sum + p, 0);

      // 检查是否超过可用百分比
      if (value > (100 - totalParentPercentage)) {
        message.error(`Maximum available percentage is ${100 - totalParentPercentage}%`);
        return;
      }

      // 更新类别百分比
      const newCategoryPercentages = {
        ...categoryPercentages,
        [category]: {
          ...categoryPercentages[category],
          [nodeInfoData.name]: value
        }
      };
      setCategoryPercentages(newCategoryPercentages);

      console.log("当前策略=", category);

      // 只有当策略是 Based 时才更新树形图
      if (category === 'Based') {
        setBasedValue(value);
        setTreeDisplayCache(''); // 清除缓存，强制重新计算树形图
        setTreeUpdateCounter(prev => prev + 1); // 增加更新计数器，触发重新渲染
      }
    };

    // 计算总百分比（包括父节点的百分比）
    const getTotalPercentage = () => {
      if (!nodeInfoData?.name) return 0;

      let total = 0;
      categories.forEach(category => {
        const path = getNodePath(nodeInfoData.name);
        const parentPercentages = calculateParentPercentages(path, category);
        const parentTotal = parentPercentages.reduce((sum, p) => sum + p, 0);
        total += parentTotal + (categoryPercentages[category][nodeInfoData.name] || 0);
      });

      return total;
    };

    // 检查是否可以确认
    const canConfirm = getTotalPercentage() === 100;

    return (
      <div style={{
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '12px',
        width: '95%',
        maxWidth: '1200px',
        margin: '0 auto',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        {/* 顶部类别选择区域 - 分为两行 */}
        <div style={{
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          {/* 第一行：类别标题 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            {categories.map(category => (
              <div key={`title-${category}`} style={{
                flex: 1,
                textAlign: 'center',
                fontWeight: '600',
                color: '#1f2937',
                fontSize: '14px',
                padding: '4px 12px',
                backgroundColor: category === 'Based' ? '#e3f2fd' : '#e5e7eb',
                borderRadius: '16px',
                margin: '0 8px'
              }}>
                {category}
              </div>
            ))}
          </div>

          {/* 第二行：下拉框 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            {categories.map(category => (
              <div key={`select-${category}`} style={{ flex: 1, textAlign: 'center' }}>
                <Select
                  value={categoryPercentages[category][nodeInfoData?.name || ''] || 0}
                  onChange={(value) => handleCategoryChange(value, category)}
                  style={{
                    width: '80%',
                    maxWidth: '120px'
                  }}
                  bordered={false}
                  className="contribution-select"
                >
                  {Array.from({ length: 21 }, (_, i) => i * 5).map((value) => (
                    <Select.Option key={value} value={value}>
                      {value}%
                    </Select.Option>
                  ))}
                </Select>
              </div>
            ))}
          </div>
        </div>

        {/* Based树形图区域 */}
        {nodeInfoData?.name !== BASEMODEL && (
          <div style={{
            padding: '20px',
            backgroundColor: '#f0f7ff',
            borderRadius: '12px',
            border: '1px solid #e6f0f9',
            marginBottom: '16px'
          }}>
            <div style={{
              fontFamily: 'Consolas, monospace',
              whiteSpace: 'pre',
              color: '#374151',
              fontSize: '13px',
              lineHeight: '1.6',
              backgroundColor: '#fff',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              {getTreeDisplay('Based')}
            </div>
          </div>
        )}

        {/* 总计区域 */}
        <div style={{
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: !canConfirm ? '#fff1f0' : '#f6ffed',
          border: `1px solid ${!canConfirm ? '#ffccc7' : '#b7eb8f'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            color: !canConfirm ? '#cf1322' : '#389e0d',
            fontWeight: '500'
          }}>
            Total: {getTotalPercentage()}%
          </span>
          {!canConfirm && (
            <span style={{
              color: '#cf1322',
              fontSize: '13px'
            }}>
              Must be 100%
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderShowButtons = () => (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      display: 'flex',
      gap: '8px',
      zIndex: 1,
    }}>
      {!showModelEvolution && (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => setShowModelEvolution(true)}
          style={{
            borderRadius: '4px',
          }}
        >
          Show Evolution
        </Button>
      )}
      {!showNodeDetails && (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => setShowNodeDetails(true)}
          style={{
            borderRadius: '4px',
          }}
        >
          Show Details
        </Button>
      )}
    </div>
  );

  // 在 useEffect 中监听 showNodeDetails 变化
  useEffect(() => {
    if (showNodeDetails) {
      // 先显示容器，然后触发动画
      setNodeDetailsVisible(true);
    } else {
      // 当关闭时，先执行动画，再隐藏组件
      setNodeDetailsVisible(false);
    }
  }, [showNodeDetails]);



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

          .contribution-select .ant-select-selector {
            background-color: #f8f9fa !important;
            border-radius: 4px !important;
            transition: all 0.3s !important;
          }
          
          .contribution-select:hover .ant-select-selector {
            background-color: #e9ecef !important;
          }
          
          .contribution-select .ant-select-selection-item {
            font-weight: 500 !important;
            color: #1f2937 !important;
            text-align: center !important;
          }

          @keyframes slideIn {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
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
        <div 
          className="node-details-container"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '350px',
            height: '850px',
            zIndex: 2,
            transition: 'transform 0.3s ease-in-out',
            transform: nodeDetailsVisible ? 'translateX(0)' : 'translateX(100%)',
          }}
        >
          <Card
            size={'small'}
            title={
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span>Node Details</span>
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  size="small"
                  onClick={() => {
                    // 先触发动画，然后在动画结束后隐藏
                    setNodeDetailsVisible(false);
                    setTimeout(() => {
                      setShowNodeDetails(false);
                    }, 300); // 与过渡时间相同
                  }}
                  style={{
                    color: '#999',
                  }}
                />
              </div>
            }
            style={{
              width: '100%',
              height: '100%',
              overflow: 'auto',
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

            {/* 添加下拉框和按钮区域 */}
            <div style={{
              marginTop: '20px',
              borderTop: '1px solid #f0f0f0',
              paddingTop: '16px'
            }}>
              {/* Model Algorithm 下拉框 */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  marginBottom: '4px',
                  fontWeight: 500,
                  fontSize: '14px',
                  color: '#333'
                }}>
                  Model Algorithm:
                </div>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select algorithm"
                  defaultValue={nodeInfoData?.algorithm || undefined}
                  size="small"
                >
                  <Select.Option value="transformer">Transformer</Select.Option>
                  <Select.Option value="cnn">CNN</Select.Option>
                  <Select.Option value="rnn">RNN</Select.Option>
                  <Select.Option value="lstm">LSTM</Select.Option>
                  <Select.Option value="gpt">GPT</Select.Option>
                </Select>
              </div>

              {/* Dataset 下拉框 */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  marginBottom: '4px',
                  fontWeight: 500,
                  fontSize: '14px',
                  color: '#333'
                }}>
                  Dataset:
                </div>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select dataset"
                  defaultValue={nodeInfoData?.dataset?.id || undefined}
                  size="small"
                >
                  <Select.Option value="dataset1">Common Crawl</Select.Option>
                  <Select.Option value="dataset2">Wikipedia</Select.Option>
                  <Select.Option value="dataset3">Books</Select.Option>
                  <Select.Option value="dataset4">Code</Select.Option>
                </Select>
              </div>

              {/* Builder 下拉框 */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  marginBottom: '4px',
                  fontWeight: 500,
                  fontSize: '14px',
                  color: '#333'
                }}>
                  Builder:
                </div>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Select builder"
                  defaultValue={nodeInfoData?.builder || undefined}
                  size="small"
                >
                  <Select.Option value="builder1">Team Alpha</Select.Option>
                  <Select.Option value="builder2">Team Beta</Select.Option>
                  <Select.Option value="builder3">Team Gamma</Select.Option>
                  <Select.Option value="builder4">Individual</Select.Option>
                </Select>
              </div>

              {/* 按钮区域 - 垂直排列 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginTop: '16px'
              }}>
                <Button
                  type="primary"
                  size="small"
                  style={{
                    borderRadius: '4px',
                    backgroundColor: '#722ED1',
                    borderColor: '#722ED1',
                    height: '32px',
                    fontWeight: 500,
                    fontSize: '13px'
                  }}
                  icon={<PercentageOutlined />}
                  onClick={handleContributionWeightClick}
                >
                  Contribution
                </Button>

                <Button
                  type="default"
                  size="small"
                  style={{
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
            </div>
          </Card>
        </div>
      )}

      {/* model evolution */}
      <Modal
        title={
          <div style={{
            fontSize: '16px',
            fontWeight: 500,
            color: '#1890ff',
          }}>
            <div>
              {nodeInfoData?.name}
            </div>

            Contribution Weight
          </div>
        }
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={900}
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
            padding: '12px 12px',
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
        <div style={{ marginBottom: '5px', color: '#666' }}>
          Total must be 100%
        </div>
        <ContributionWeightContent />
      </Modal>

      <ChatModal
        show={showChatModel.showModel}
        data={showChatModel.data}
        onClose={() => {
          console.log('111');
          setShowChatModel({ showModel: false, data: {} });
        }} />        

    </PageContainer>
  );
};

export default HomePage;

