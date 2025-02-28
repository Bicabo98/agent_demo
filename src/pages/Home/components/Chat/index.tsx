import { Drawer, Layout, Modal, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Chat } from 'react-jwchat'
import { contact, my,messageList } from "./displayData";
import DisplayWrapper from "./DisplayWrapper";
interface Props {
  showChat: boolean;
}

// 脚手架示例组件
const ChatBaseView: React.FC<Props> = (props) => {
  const {showChat} = props;
  const [chatListData, setChatListData] = useState<any[]>([])
  useEffect(() => {
    setChatListData(messageList)
  },[])

  return (
    <Layout>
      <Modal
        closable
        destroyOnClose
        title={'Chat'}
        open={showChat}
        width={700}
        footer={false}
      >
        <DisplayWrapper>
          <Chat
            contact={contact}
            me={my}
            chatList={chatListData}
            onSend={(msg: any) => setChatListData([...chatListData, msg])}
            onEarlier={() => console.log('EarlierEarlier')}
            style={{
              width: 700,
              height:  600,
              borderRadius: 5,
              border: '1px solid rgb(226, 226, 226)'
            }}
          />
        </DisplayWrapper>
      </Modal>
    </Layout>
  );
};

export default ChatBaseView;