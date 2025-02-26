import React from 'react';
import { ReactNodeProps } from '@logicflow/react-node-registry';

const ChildNode: React.FC<ReactNodeProps> = (props) => {
  // 从 props 中获取节点数据
  const nodeName = props.model?.properties?.name;

  return (
    <div
      className="child-node"
      style={{
        width: '140px',
        height: '48px',
        background: '#ffffff',
        boxShadow: `
          0 4px 12px rgba(24, 144, 255, 0.1),
          inset 0 -2px 6px rgba(24, 144, 255, 0.05),
          inset 0 2px 6px rgba(24, 144, 255, 0.05)
        `,
        borderRadius: '16px',
        border: '2px solid #1890ff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      {/* 左侧装饰条 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '4px',
          height: '60%',
          background: 'linear-gradient(180deg, #1890ff 0%, #36cfc9 100%)',
          borderRadius: '0 2px 2px 0',
          boxShadow: '0 0 8px rgba(24, 144, 255, 0.2)',
        }}
      />

      {/* 背景装饰 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '40%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(24, 144, 255, 0.05))',
          borderRadius: '0 16px 16px 0',
        }}
      />

      {/* 文本容器 */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginLeft: '8px',
        }}
      >
        
        {/* 动态显示节点名称 */}
        <span
          style={{
            color: '#1890ff',
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: '0.3px',
          }}
        >
          {nodeName}
        </span>
      </div>

      <style>
        {`
          .child-node:hover {
            transform: translateY(-2px);
            border-color: #40a9ff;
            box-shadow: 0 6px 16px rgba(24, 144, 255, 0.15),
                       inset 0 -2px 6px rgba(24, 144, 255, 0.08),
                       inset 0 2px 6px rgba(24, 144, 255, 0.08);
          }

          .child-node:hover::before {
            opacity: 1;
          }

          .child-node:active {
            transform: translateY(1px);
            box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1),
                       inset 0 -1px 4px rgba(24, 144, 255, 0.05),
                       inset 0 1px 4px rgba(24, 144, 255, 0.05);
          }
        `}
      </style>
    </div>
  );
};

export default ChildNode;