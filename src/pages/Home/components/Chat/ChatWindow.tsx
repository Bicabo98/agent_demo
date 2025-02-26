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
  width: 300px;
`

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
`

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
`

const StyledInput = styled(Input)`
  flex: 1;
  margin-right: 10px;
`

const MessageBubble = styled.div<{ isMine: boolean }>`
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 18px;
  margin-bottom: 10px;
  background-color: ${(props) => (props.isMine ? "#95ec69" : "#ffffff")};
  align-self: ${(props) => (props.isMine ? "flex-end" : "flex-start")};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  return (
    <ChatContainer>
      <MessageList>
        <List
          itemLayout="horizontal"
          dataSource={messages}
          renderItem={(item) => (
            <List.Item style={{ justifyContent: item.sender === "me" ? "flex-end" : "flex-start" }}>
              {item.sender !== "me" && <Avatar src={item.avatar} />}
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

