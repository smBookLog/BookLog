package com.booklog.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {

	private int msgIdx;
	private String senderId;
	private String receiverId;
	private String content;
	private String sentAt;
}
