"use client"

import type React from "react"
import { useEffect, useState } from 'react';
import { Modal, Button } from "antd"
import ChatWindow from "./ChatWindow"
interface Props {
  show: boolean,
  onClose: () => void,
  data:any,
}
const ChatModal: React.FC<Props> = (props) => {
  const {show,onClose} = props
  const [isModalVisible, setIsModalVisible] = useState(false)
  useEffect(() => {
    setIsModalVisible(show)
  }, [show])

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      <Modal title="Chat" keyboard={false} open={isModalVisible} closable afterClose={() => {
        onClose()
      }} onCancel={handleCancel} footer={null} width={600}>
        <ChatWindow nodeData={props.data} />
      </Modal>
    </>
  )
}

export default ChatModal

