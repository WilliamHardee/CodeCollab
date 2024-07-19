import React, { useEffect, useState } from 'react'
import style from '../../Styles/codewindow.module.css'
import { useParams } from 'react-router'
import Editor from './Editor';
import {Stomp, Client} from '@stomp/stompjs'
import SockJs from 'sockjs-client'
import session from '../../Session';

function CodeWindow() {
  const {projectId} = useParams()
  const [stompClient, setStompClient] = useState()
  const [updates, setUpdates] = useState("")
  const [connected, setConnect] = useState()

  function connect() {
    const socket = new SockJs('http://localhost:8080/connectToProject');
    const tempstompClient = Stomp.over(socket);
    tempstompClient.debug = function (){};
    tempstompClient.connect({}, function(frame) {
      setConnect(true)
      setStompClient(tempstompClient)
      console.log('Connected')
      tempstompClient.subscribe(`/topic/project/${projectId}`, (message) => {
        const res = JSON.parse(message.body)
        if(res.from !== session.getSession("username")) {
          console.log(res)
          setUpdates(res.content)
        }
      })  
        
    });
  }

  function sendMessage() {
    stompClient.send(`/chat/connect/${projectId}`, {}, JSON.stringify({'from': session.getSession("username"), 'content': updates}))

  }

  useEffect(() => {
    const interval = setInterval(() => {
      sendMessage()
    }, 2000)

    return () => clearInterval(interval)
  }, [])
  
  useEffect(() => {
    if(!connected) {
      connect()
    }
  },[])


  function onInput(value) {
    setUpdates(value)

  }

  return (
    <>
        <Editor val={updates} onInput={onInput}/>
    </>
  )
}

export default CodeWindow