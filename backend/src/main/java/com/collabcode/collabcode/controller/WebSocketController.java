package com.collabcode.collabcode.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.collabcode.collabcode.model.Message;

@Controller
public class WebSocketController {
    
    @MessageMapping("/connect/{project_id}")
    @SendTo("/topic/project/{project_id}")
    public Message connect(Message message) throws Exception {
        return message;
    }
}
