package com.booklog.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.booklog.db.ReadingLogMapper;
import com.booklog.model.CommentDTO;
import com.booklog.model.ReadingLogDTO;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class ReadingLogController {

	@Autowired
	ReadingLogMapper readingLogMapper;

	// 독서 상태별 책과 독서기록 조회
	// http://localhost:8082/controller/user01/FINISHED
	@GetMapping("/{userId}/{status}")
	public ArrayList<ReadingLogDTO> myLogList(@PathVariable String userId, @PathVariable String status) {
		ArrayList<ReadingLogDTO> logs = readingLogMapper.findMyLogs(userId, status);

		for (ReadingLogDTO log : logs) {
			int logIdx = log.getLogIdx();

			ArrayList<String> tags = new ArrayList<>(readingLogMapper.findTagsByLogIdx(logIdx));
			ArrayList<String> quotes = new ArrayList<>(readingLogMapper.findQuotesByLogIdx(logIdx));

			log.setTags(tags);
			log.setQuotes(quotes);
		}
		return logs;
	}

	// 피드용 독서 기록 조회
	// http://localhost:8082/controller/feed/user01/39
	@GetMapping("/feed/{userId}/{logIdx}")
	public ArrayList<ReadingLogDTO> feedLogList(@PathVariable String userId, @PathVariable int logIdx) {
		ArrayList<ReadingLogDTO> logs = readingLogMapper.findLogs(userId, logIdx);

		for (ReadingLogDTO log : logs) {
			logIdx = log.getLogIdx();

			ArrayList<String> quotes = new ArrayList<>(readingLogMapper.findQuotesByLogIdx(logIdx));
			ArrayList<CommentDTO> comments = new ArrayList<>(readingLogMapper.findCommentsByLogIdx(logIdx));
			int likeCount = readingLogMapper.countLikes(logIdx);
			
			log.setQuotes(quotes);
			log.setComments(comments);
			log.setLikeCount(likeCount);
		}
		return logs;
	}

	// 독서 기록, 태그, 인용구 추가
	// http://localhost:8082/controller/log/add
	// Key: Content-Type / Value: application/json 추가
//	{
//		  "userId": "user02",
//		  "bookIdx": 3,
//		  "status": "FINISHED",
//		  "startDate": "2024-01-01",
//		  "endDate": "2024-01-10",
//		  "rating": 5,
//		  "content": "정말 감명 깊게 읽었어요!",
//		  "tags": ["디스토피아", "생각할거리", "고전추천"],
//		  "quotes": [
//		    "자유는 노예다.",
//		    "생각하지 않는 것이 가장 안전하다."
//		  ]
//	}
	@PostMapping("/log/add")
	public String insertLog(@RequestBody ReadingLogDTO log) {
	    int result = readingLogMapper.insertLog(log);
	    
	    if (result > 0) {
	        // 태그 삽입
	        if (log.getTags() != null) {
	            for (String tag : log.getTags()) {
	                // TAG 테이블에 없으면 INSERT
	                readingLogMapper.insertTag(tag);

	                // TAG_IDX 조회
	                Integer tagIdx = readingLogMapper.selectTagIdxByName(tag);

	                if (tagIdx != null) {
	                    // READING_LOG_TAG 테이블에 삽입
	                    readingLogMapper.insertReadingLogTag(log.getLogIdx(), tagIdx, log.getUserId());
	                }
	            }
	        }

	        // 인용구 삽입
	        if (log.getQuotes() != null) {
	            for (String quote : log.getQuotes()) {
	                readingLogMapper.insertQuote(log.getUserId(), log.getBookIdx(), quote);
	            }
	        }
	    }
	    return result > 0 ? "success" : "fail";
	}

	// 독서 기록, 태그, 인용구 수정
	// http://localhost:8082/controller/log/update
//	{
//		  "userId": "user01",
//		  "logIdx": 44,
//		  "status": "READING",
//		  "startDate": "2024-01-01",
//		  "endDate": null,
//		  "rating": null,
//		  "content": null
//	}
	@PutMapping("/log/update")
	public String updateLog(@RequestBody ReadingLogDTO log) {
	    int result = readingLogMapper.updateLog(log);

	    // 기존 태그/인용구 삭제
	    readingLogMapper.deleteAllTags(log.getLogIdx());
	    readingLogMapper.deleteAllQuotes(log.getBookIdx(), log.getUserId());

	    // 태그 다시 삽입
	    if (log.getTags() != null) {
	        for (String tag : log.getTags()) {
	            // TAG 테이블에 없으면 INSERT
	            readingLogMapper.insertTag(tag);

	            // TAG_IDX 조회
	            Integer tagIdx = readingLogMapper.selectTagIdxByName(tag);

	            if (tagIdx != null) {
	                // READING_LOG_TAG 테이블에 삽입
	                readingLogMapper.insertReadingLogTag(log.getLogIdx(), tagIdx, log.getUserId());
	            }
	        }
	    }

	    // 인용구 다시 삽입
	    if (log.getQuotes() != null) {
	        for (String quote : log.getQuotes()) {
	            readingLogMapper.insertQuote(log.getUserId(), log.getBookIdx(), quote);
	        }
	    }

	    return result > 0 ? "updated" : "fail";
	}
	
	// 독서 기록, 인용구, 태그, 댓글 삭제
	// http://localhost:8082/controller/log/delete/45
	@DeleteMapping("/log/delete/{logIdx}")
	public String deleteLog(@PathVariable int logIdx) {
		int result = readingLogMapper.deleteLog(logIdx);
		return result > 0 ? "success" : "fail";
	}
	
	// 인용구만 삭제
	// http://localhost:8082/controller//quote/delete/22
	@DeleteMapping("/quote/delete/{quoteIdx}")
	public String deleteQuote(@PathVariable int quoteIdx) {
	    int result = readingLogMapper.deleteQuote(quoteIdx);
	    return result > 0 ? "success" : "fail";
	}

	

}
