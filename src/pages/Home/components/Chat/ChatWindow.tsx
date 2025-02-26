"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Input, Button, List, Avatar } from "antd"
import { SendOutlined } from "@ant-design/icons"
import styled from "styled-components"

// 模拟数据
const initialMessages = [
  { id: 1, sender: "other", content: "你好!", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 2, sender: "me", content: "你好!很高兴认识你。", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 3, sender: "other", content: "今天天气真不错,适合出去走走。", avatar: "/placeholder.svg?height=40&width=40" },
]

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

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesListRef = useRef<HTMLDivElement>(null)
  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "me",
        content: inputValue.trim(),
        avatar: "/placeholder.svg?height=40&width=40",
      }
      setMessages([...messages, newMessage])
      setInputValue("")
      // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  useEffect(() => {
    // 确保更新完成后再滚动
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth"
      });
    });
  }, [messages]); // 添加消息数组作为依赖

  return (
    <ChatContainer>
      <MessageList ref={messagesListRef}>
        <List
          itemLayout="horizontal"
          dataSource={messages}
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
          placeholder="输入消息..."
        />
        <Button type="primary" icon={<SendOutlined />} onClick={handleSend}>
          发送
        </Button>
      </InputContainer>
    </ChatContainer>
  )
}

export default ChatWindow

