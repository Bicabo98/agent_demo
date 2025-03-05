"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Input, Button, List, Avatar } from "antd"
import { SendOutlined } from "@ant-design/icons"
import styled from "styled-components"


// 模拟数据
// const initialMessages = [
//   { id: 1, sender: "other", content: "Hello!", avatar: "/placeholder.svg?height=40&width=40" },
//   { id: 2, sender: "me", content: "Hello! Nice to meet you.", avatar: "/placeholder.svg?height=40&width=40" },
//   { id: 3, sender: "other", content: "Today is a good day, it's sunny.", avatar: "/placeholder.svg?height=40&width=40" },
// ]

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 400px;
  width: 600;
  background-color: #f5f5f5;
`

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
`

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  background-color: #fff;
`

const StyledInput = styled(Input)`
  flex: 1;
  margin-right: 10px;
`

const MessageBubble = styled.div<{ isMine: boolean }>`
  max-width: 80%;
  padding: 8px 12px;
  margin-bottom: 10px;
  background-color: ${(props) => (props.isMine ? "#95ec69" : "#ffffff")};
  color: #000000;
  border-radius: 8px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 12px;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    ${(props) =>
    props.isMine
      ? `right: -5px;
         border-left-color: #95ec69;
         border-right: 0;`
      : `left: -5px;
         border-right-color: #ffffff;
         border-left: 0;`}
  }
`
interface ChatWindowProps {
  nodeData: any; // 根据实际数据结构定义更具体的类型
}
// 创建一个全局变量来存储所有节点的对话历史
const nodeMessagesHistory: { [key: string]: any[] } = {};

const ChatWindow: React.FC<ChatWindowProps> = ({ nodeData }) => {
  //const [messages, setMessages] = useState([]);

  //console.log("123123123nodeData=",nodeData)


  const [messages, setMessages] = useState(() => {
    const nodeName = nodeData?.nodeData?.name;
    // 如果该节点没有历史记录，初始化为空数组
    if (!nodeMessagesHistory[nodeName]) {
      nodeMessagesHistory[nodeName] = [];
    }
    return nodeMessagesHistory[nodeName];
  });

  // 当节点改变时，更新显示的消息
  useEffect(() => {
    const nodeName = nodeData?.nodeData?.name;
    if (!nodeMessagesHistory[nodeName]) {
      nodeMessagesHistory[nodeName] = [];
    }
    setMessages(nodeMessagesHistory[nodeName]);
  }, [nodeData?.name]);

  const [inputValue, setInputValue] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null); // 新增状态来存储 session_id
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesListRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (inputValue.trim()) {
      const nodeName = nodeData?.nodeData?.name;

      if (!nodeMessagesHistory[nodeName]) {
        nodeMessagesHistory[nodeName] = [];
      }
      
      const newMessage = {
        //id: nodeMessagesHistory[nodeName].length + 1,
        sender: "me",
        content: inputValue.trim(),
        avatar: "/placeholder.svg?height=40&width=40",
      };

      //console.log("输入的message=",newMessage)
      //console.log("测试=",nodeMessagesHistory[nodeName])
    
      const updatedMessages = [...nodeMessagesHistory[nodeName], newMessage];

      console.log("updatedMessages=",updatedMessages)
      
      nodeMessagesHistory[nodeName] = updatedMessages;
      setMessages(updatedMessages);
      setInputValue("");

 
      const response= await callChatAPI(inputValue.trim(), sessionId);
      console.log("response:", response);

  
      if (response.session_id) {
        setSessionId(response.session_id);
      }

   
      if (response) {
        const apiMessage = {
          //id: updatedMessages.length + 1,
          sender: "other",
          content:  response.message, 
          avatar: "/placeholder.svg?height=40&width=40",
        };
      
        const finalMessages = [...updatedMessages, apiMessage];
        nodeMessagesHistory[nodeName] = finalMessages;
        setMessages(finalMessages);
       // console.log("handleSend对话信息=", finalMessages)
      }

      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };


  const callChatAPI = async (message: string, sessionId?: string) => {
    try {
      const url = "https://kol.teeml.ai/api/chat";
      

      const body = {
        model_version: "akasha",
        text: message,
      };

  
      if (sessionId) {
        body.session_id = sessionId;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", data);
      
     
      return data || null; 
    } catch (error) {
      console.error("Error calling chat API:", error);
      return null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  useEffect(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth"
      });
    });
  }, [messages]); 

  // console.log("当前对话信息=", messages)
  // console.log("缓存=",nodeMessagesHistory[nodeData?.nodeData?.name])

  return (
    <ChatContainer>
      <MessageList ref={messagesListRef}>
        <List
          itemLayout="horizontal"
          dataSource={nodeMessagesHistory[nodeData?.nodeData?.name]}
          locale={{ emptyText: "No messages yet" }}
          renderItem={(item) => (
            <List.Item
              style={{
                justifyContent: item.sender === "me" ? "flex-end" : "flex-start",
                border: "none",
                padding: "4px 0",
              }}
            >
              {item.sender !== "me" && <Avatar src={item.avatar} style={{ marginRight: "8px" }} />}
              <MessageBubble isMine={item.sender === "me"}>{item.content}</MessageBubble>
              {item.sender === "me" && <Avatar src={item.avatar} style={{ marginLeft: "8px" }} />}
            </List.Item>
          )}
        />
        <div ref={messagesEndRef} />
      </MessageList>
      <InputContainer>
        <StyledInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Input message..."
        />
        <Button type="primary" icon={<SendOutlined />} onClick={handleSend}>
          Send
        </Button>
      </InputContainer>
    </ChatContainer>
  )
}

export default ChatWindow

