package com.booklog.db;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.booklog.model.CommentDTO;
import com.booklog.model.ReadingLogDTO;
import com.booklog.model.UserRecommendDTO;

@Mapper
public interface FeedMapper {

	// 피드용 독서 기록 조회
	ArrayList<ReadingLogDTO> findLogs(@Param("logIdx") int logIdx, @Param("userId") String userId);

	// 최다로 읽은 장르 1개
	String findTopGenre(String userId);

	// 최신으로 읽은 장르 1개
	String findLatestGenre(String userId);

	// 유저 추천
	ArrayList<UserRecommendDTO> recommendByGenre(@Param("genre") String genre, @Param("userId") String userId);

	// 인용구 조회
	ArrayList<String> findQuotesByUserId(String userId);

	// 댓글 조회
	ArrayList<CommentDTO> findCommentsByLogIdx(int logIdx);

}