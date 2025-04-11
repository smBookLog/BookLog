package com.booklog.db;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.booklog.model.MessageDTO;

@Mapper
public interface MessageMapper {
	
	int insertMessage(MessageDTO message);

	ArrayList<MessageDTO> selectInbox(@Param("userId") String userId);

	ArrayList<MessageDTO> selectSent(@Param("userId") String userId);

}
