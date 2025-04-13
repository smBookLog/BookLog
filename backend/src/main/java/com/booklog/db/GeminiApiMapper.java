package com.booklog.db;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface GeminiApiMapper {

	// 인용구 조회
	ArrayList<String> findQuotesByUserId(String userId);

}
