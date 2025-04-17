package com.booklog.db;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.booklog.model.CommentDTO;
import com.booklog.model.ReadingLogDTO;

@Mapper
public interface ReadingLogMapper {

	// 나의 독서 기록 조회
	ArrayList<ReadingLogDTO> findMyLogs(@Param("userId") String userId, @Param("status") String status);

	// 태그 조회
	ArrayList<String> findTagsByLogIdx(int logIdx);

	// 인용구 조회
	ArrayList<String> findQuotesByLogIdx(int logIdx);

	// 피드용 독서 기록 조회
	ArrayList<ReadingLogDTO> findLogs(@Param("logIdx") int logIdx);

	// 댓글 조회
	ArrayList<CommentDTO> findCommentsByLogIdx(int logIdx);

	// 독서 기록 추가
	int insertLog(ReadingLogDTO log);

	// 독서 기록 수정
	int updateLog(ReadingLogDTO log);

	// 태그 전체 삭제
	void deleteAllTags(int logIdx);

	// 인용구 전체 삭제
	void deleteAllQuotes(@Param("bookIdx") int bookIdx, @Param("userId") String userId);

	// 태그 저장 전 TAG 테이블에 있는지 확인하고 없으면 삽입
	void insertTag(@Param("tag") String tag);

	// 삽입된 태그 이름으로 TAG_IDX 찾기
	Integer selectTagIdxByName(@Param("tag") String tag);

	// READING_LOG_TAG 테이블에 태그 연결
	void insertReadingLogTag(@Param("logIdx") int logIdx, @Param("tagIdx") int tagIdx, @Param("userId") String userId);

	// 인용구 삽입
	void insertQuote(@Param("userId") String userId, @Param("bookIdx") int bookIdx, @Param("quote") String quote);

	// 독서 기록 삭제
	int deleteLog(int logIdx);

	// 인용구 하나 삭제
	int deleteQuote(@Param("quoteIdx") int quoteIdx);

	// 좋아요 수 조회
	int countLikes(@Param("logIdx") int logIdx);

	// 독서 기록 중복 확인
	ReadingLogDTO findLogByUserIdAndBookIdx(@Param("userId") String userId, @Param("bookIdx") int bookIdx);

	// 댓글 저장
	int insertComment(CommentDTO comment);

	// 댓글 삭제
	int deleteComment(@Param("commentIdx") int commentIdx);

	// 좋아요 추가
	int insertLike(@Param("userId") String userId, @Param("logIdx") int logIdx);

	// 좋아요 삭제
	int deleteLike(@Param("userId") String userId, @Param("logIdx") int logIdx);

	// 좋아요 여부 확인
	int checkIfLiked(@Param("userId") String userId, @Param("logIdx") int logIdx);

}
