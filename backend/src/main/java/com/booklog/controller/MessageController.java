package com.booklog.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.booklog.db.MessageMapper;
import com.booklog.model.MessageDTO;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class MessageController {
	
	@Autowired
	MessageMapper messageMapper;
	
	// 메시지 보내기
	// http://localhost:8082/controller/message/send
//	{
//	  "senderId": "user01",
//	  "receiverId": "user02",
//	  "content": "안녕! 잘 지내?"
//	}
	@PostMapping(value = "/message/send", produces = "text/plain; charset=UTF-8")
	public String sendMessage(@RequestBody MessageDTO message) {
	    int result = messageMapper.insertMessage(message);
	    return result > 0 ? "메시지 전송 완료" : "메시지 전송 실패";
	}

	// 받은 메시지 목록
	// http://localhost:8082/controller/message/inbox/user01
	@GetMapping(value = "/message/inbox/{userId}")
	public ArrayList<MessageDTO> getInbox(@PathVariable String userId) {
	    return messageMapper.selectInbox(userId);
	}

	// 보낸 메시지 목록
	// http://localhost:8082/controller/message/sent/user01
	@GetMapping(value = "/message/sent/{userId}")
	public ArrayList<MessageDTO> getSentMessages(@PathVariable String userId) {
	    return messageMapper.selectSent(userId);
	}
	
	// 전체 메시지 목록
	// http://localhost:8082/controller/message/all/user01
	@GetMapping(value = "/message/all/{userId}")
	public ArrayList<MessageDTO> getAllMessages(@PathVariable String userId) {
	    ArrayList<MessageDTO> inbox = messageMapper.selectInbox(userId);
	    ArrayList<MessageDTO> sent = messageMapper.selectSent(userId);
	    inbox.addAll(sent); // 받은 + 보낸 메시지 합치기
	    return inbox;
	}

}
