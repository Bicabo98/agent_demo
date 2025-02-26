import React from 'react';
import { ReactNodeProps } from '@logicflow/react-node-registry';


const StartNode: React.FC<ReactNodeProps> = () => {
  return (
    <div
      className="start-node"
      style={{
        width: '140px',
        height: '48px',
        background: '#fff',
        border: '1px solid #eee',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
    </div>
  );
};

export default StartNode;