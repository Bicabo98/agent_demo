import React from 'react';
import { ReactNodeProps } from '@logicflow/react-node-registry';

const StartNode: React.FC<ReactNodeProps> = () => {
  return (
    <div
      className="start-node"
      style={{
        width: '140px',
        height: '48px',
        // 使用更丰富的渐变背景
        background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
        // 添加内部光晕效果
        boxShadow: `
          0 4px 12px rgba(0, 0, 0, 0.1),
          inset 0 -2px 6px rgba(255, 255, 255, 0.2),
          inset 0 2px 6px rgba(255, 255, 255, 0.1)
        `,
        // 更圆润的边角
        borderRadius: '24px',
        // 添加细微的边框
        border: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        // 平滑过渡效果
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      {/* 添加背景光效 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '-50%',
          width: '200%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transform: 'translateX(-100%)',
          animation: 'shimmer 3s infinite',
        }}
      />
      
      {/* 文本容器 */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {/* 图标
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0 0 8px rgba(255, 255, 255, 0.6)',
          }}
        /> */}
        {/* 文本 */}
        <span
          style={{
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: 600,
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            letterSpacing: '0.5px',
          }}
        >
          
        </span>
      </div>

      <style>
        {`
          @keyframes shimmer {
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
          
          .start-node:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15),
                       inset 0 -2px 6px rgba(255, 255, 255, 0.3),
                       inset 0 2px 6px rgba(255, 255, 255, 0.2);
          }
          
          .start-node:active {
            transform: translateY(1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1),
                       inset 0 -1px 4px rgba(255, 255, 255, 0.2),
                       inset 0 1px 4px rgba(255, 255, 255, 0.1);
          }
        `}
      </style>
    </div>
  );
};

export default StartNode;