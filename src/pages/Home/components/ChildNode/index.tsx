import React from 'react';
import { ReactNodeProps } from '@logicflow/react-node-registry';

const ChildNode: React.FC<ReactNodeProps> = (props) => {
  const isNewNode = props.properties?.isNewNode;
  
  // 安全地获取文本值
  const textValue = props.model?.text?.value || props.properties?.name || '';
  
  return (
    <div
      className={`child-node ${isNewNode ? 'training-node' : ''}`}
      style={{
        width: '140px',
        height: '48px',
        background: isNewNode 
          ? 'linear-gradient(135deg, #722ed1 0%, #f759ab 100%)' 
          : 'linear-gradient(135deg, #fa8c16 0%, #f5222d 100%)',
        boxShadow: isNewNode
          ? `0 0 15px rgba(114, 46, 209, 0.5),
             inset 0 -2px 5px rgba(255, 255, 255, 0.2),
             inset 0 2px 5px rgba(255, 255, 255, 0.1)`
          : `0 3px 10px rgba(250, 140, 22, 0.2),
             inset 0 -2px 5px rgba(255, 255, 255, 0.15),
             inset 0 2px 5px rgba(255, 255, 255, 0.08)`,
        borderRadius: '24px',
        border: `1px solid ${isNewNode ? 'rgba(247, 89, 171, 0.3)' : 'rgba(255, 255, 255, 0.2)'}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      {/* 背景光效 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '-50%',
          width: '200%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transform: 'translateX(-100%)',
          animation: 'shimmer-child 4s infinite',
        }}
      />
      
      {/* 训练动画效果 */}
      {isNewNode && (
        <div 
          className="training-animation"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '24px',
            overflow: 'hidden',
          }}
        />
      )}
      
      {/* 文本容器 */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 2,
        }}
      >
        {/* 文本 */}
        <span
          style={{
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: 500,
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.15)',
            letterSpacing: '0.5px',
          }}
        >
          {textValue}
          {isNewNode && <span className="training-indicator"> 🔄</span>}
        </span>
      </div>

      <style>
        {`
          @keyframes shimmer-child {
            0% {
              transform: translateX(-100%);
            }
            50% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          
          .training-node {
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(114, 46, 209, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(114, 46, 209, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(114, 46, 209, 0);
            }
          }
          
          .training-animation {
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            background-size: 200% 100%;
            animation: training-wave 2s linear infinite;
          }
          
          @keyframes training-wave {
            0% {
              background-position: 100% 0;
            }
            100% {
              background-position: -100% 0;
            }
          }
          
          .training-indicator {
            animation: rotate 1.5s linear infinite;
            display: inline-block;
          }
          
          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          .child-node:hover {
            transform: translateY(-2px);
          }
          
          .child-node:active {
            transform: translateY(1px);
          }
        `}
      </style>
    </div>
  );
};

export default ChildNode;