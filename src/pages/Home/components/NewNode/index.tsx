import React, { useEffect, useState } from 'react';
import { ReactNodeProps } from '@logicflow/react-node-registry';

const NewNode: React.FC<ReactNodeProps> = (props) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const textValue = props.model?.text?.value || props.properties?.name || '';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 600000); // 10分钟后停止动画
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="new-node"
      style={{
        width: '140px',
        height: '48px',
        background: '#ffffff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 -2px 6px rgba(0, 0, 0, 0.02), inset 0 2px 6px rgba(0, 0, 0, 0.02)',
        borderRadius: '24px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
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
            color: '#333333',
            fontSize: '15px',
            fontWeight: 500,
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
          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          .new-node:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12), inset 0 -2px 6px rgba(0, 0, 0, 0.02), inset 0 2px 6px rgba(0, 0, 0, 0.02);
          }
          
          .new-node:active {
            transform: translateY(1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 -1px 4px rgba(0, 0, 0, 0.02), inset 0 1px 4px rgba(0, 0, 0, 0.02);
          }
        `}
      </style>
    </div>
  );
};

export default NewNode; 