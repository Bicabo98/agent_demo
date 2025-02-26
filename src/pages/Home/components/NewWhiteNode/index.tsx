import React from 'react';
import { ReactNodeProps } from '@logicflow/react-node-registry';

const NewWhiteNode: React.FC<ReactNodeProps> = (props) => {
  // 从文本中提取节点名称和训练信息
  const fullText = props.model?.text?.value || '';
  let nodeName = fullText;
  let trainingInfo = '';
  
  // 检查文本是否包含换行符，如果有，分割为节点名称和训练信息
  if (fullText.includes('\n')) {
    const parts = fullText.split('\n');
    nodeName = parts[0];
    trainingInfo = parts[1] || '';
  }

  return (
    <div
      className="new-white-node"
      style={{
        width: '140px',
        height: trainingInfo ? '70px' : '48px', // 增加高度以容纳倒计时
        background: '#ffffff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 -2px 6px rgba(0, 0, 0, 0.02), inset 0 2px 6px rgba(0, 0, 0, 0.02)',
        borderRadius: '24px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        padding: '8px 12px',
        boxSizing: 'border-box',
      }}
    >
      {/* 节点名称 - 放在上方 */}
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          flex: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
          {nodeName}
        </span>
      </div>
      
      {/* 训练信息 - 放在下方 */}
      {trainingInfo && (
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '8px',
            padding: '2px 6px',
            marginTop: '4px',
          }}
        >
          <span
            className="rotating-icon"
            style={{
              display: 'inline-block',
              animation: 'rotate 1.5s linear infinite',
              fontSize: '10px',
            }}
          >
            🔄
          </span>
          <span
            style={{
              color: '#666666',
              fontSize: '10px',
              fontWeight: 400,
            }}
          >
            {trainingInfo}
          </span>
        </div>
      )}

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
          
          .new-white-node:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12), inset 0 -2px 6px rgba(0, 0, 0, 0.02), inset 0 2px 6px rgba(0, 0, 0, 0.02);
          }
          
          .new-white-node:active {
            transform: translateY(1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 -1px 4px rgba(0, 0, 0, 0.02), inset 0 1px 4px rgba(0, 0, 0, 0.02);
          }
        `}
      </style>
    </div>
  );
};

export default NewWhiteNode; 