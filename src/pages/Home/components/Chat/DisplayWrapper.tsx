import { Layout, Row, Typography } from 'antd';
import React from 'react';

interface Props {
}

// 脚手架示例组件
const DisplayWrapper: React.FC<Props> = (props:any) => {
  return (
    <Layout>
      <div style={{display: 'flex', justifyContent: 'center'}}>{props.children}</div>
    </Layout>
  );
};

export default DisplayWrapper;