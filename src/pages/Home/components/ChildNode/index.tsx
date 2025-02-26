import React, { useEffect, useState } from 'react';
import { ReactNodeProps } from '@logicflow/react-node-registry';

// 全局变量，用于存储新节点的ID
const newNodeIds = new Set<string>();

// 导出设置新节点ID的函数
export const setNewNodeId = (id: string) => {
  console.log("设置新节点ID:", id);
  newNodeIds.add(id);
};

// 导出清除新节点ID的函数
export const clearNewNodeId = (id: string) => {
  console.log("清除新节点ID:", id);
  newNodeIds.delete(id);
};

const ChildNode: React.FC<ReactNodeProps> = (props) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const textValue = props.model?.text?.value || props.properties?.name || '';
  
  // 获取节点ID
  const nodeId = props.model?.id || '';
  
  // 检查当前节点是否是新节点
  const isNewNode = newNodeIds.has(nodeId);
  
  console.log(`节点 ${nodeId} 渲染, 是否为新节点: ${isNewNode}`);

  useEffect(() => {
    if (isNewNode) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 600000);
      return () => clearTimeout(timer);
    }
  }, [isNewNode]);

  return (
    <div
      className="child-node"
      style={{
        width: '140px',
        height: '48px',
        background: isNewNode
          ? '#ffffff'  // 新节点使用白色背景
          : 'linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%)',  // 已有节点保持青色渐变
        boxShadow: isNewNode
          ? `0 4px 12px rgba(0, 0, 0, 0.1),
             inset 0 -2px 6px rgba(0, 0, 0, 0.02),
             inset 0 2px 6px rgba(0, 0, 0, 0.02)`
          : `0 3px 10px rgba(19, 194, 194, 0.2),
             inset 0 -1px 4px rgba(255, 255, 255, 0.1),
             inset 0 1px 4px rgba(255, 255, 255, 0.1)`,
        borderRadius: '24px',
        border: isNewNode
          ? '1px solid rgba(0, 0, 0, 0.1)'  // 新节点使用浅灰色边框
          : '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      {/* 添加背景光效 - 只在非新节点时显示 */}
      {!isNewNode && (
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
      )}

      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 2,
        }}
      >
        <span
          style={{
            color: isNewNode ? '#333333' : '#ffffff',  // 新节点使用深色文字
            fontSize: '15px',
            fontWeight: 500,
            textShadow: isNewNode
              ? 'none'  // 新节点不需要文字阴影
              : '0 1px 2px rgba(0, 0, 0, 0.15)',
            letterSpacing: '0.5px',
          }}
        >
          {textValue}
          {isAnimating && (
            <span
              style={{
                display: 'inline-block',
                marginLeft: '4px',
                animation: 'rotate 1.5s linear infinite',
              }}
            >
              🔄
            </span>
          )}
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
            box-shadow: ${isNewNode
            ? '0 6px 16px rgba(0, 0, 0, 0.12), inset 0 -2px 6px rgba(0, 0, 0, 0.02), inset 0 2px 6px rgba(0, 0, 0, 0.02)'
            : '0 6px 16px rgba(19, 194, 194, 0.25), inset 0 -2px 6px rgba(255, 255, 255, 0.3), inset 0 2px 6px rgba(255, 255, 255, 0.2)'};
          }
          
          .child-node:active {
            transform: translateY(1px);
            box-shadow: ${isNewNode
            ? '0 2px 8px rgba(0, 0, 0, 0.08), inset 0 -1px 4px rgba(0, 0, 0, 0.02), inset 0 1px 4px rgba(0, 0, 0, 0.02)'
            : '0 2px 8px rgba(19, 194, 194, 0.15), inset 0 -1px 4px rgba(255, 255, 255, 0.2), inset 0 1px 4px rgba(255, 255, 255, 0.1)'};
          }
        `}
      </style>
    </div>
  );
};

export default ChildNode;