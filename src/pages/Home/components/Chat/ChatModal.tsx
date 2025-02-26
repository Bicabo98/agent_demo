"use client"

import type React from "react"
import { useState } from "react"
import { Modal, Button } from "antd"
import ChatWindow from "./ChatWindow"

const ChatModal: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      <Button onClick={showModal}>打开聊天</Button>
      <Modal title="微信聊天" visible={isModalVisible} onCancel={handleCancel} footer={null} width={340}>
        <ChatWindow />
      </Modal>
    </>
  )
}

export default ChatModal

