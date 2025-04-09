package com.booklog.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
            
            log.setQuotes(quotes);
            log.setComments(comments);
        } 
        return logs;
    }

    // 독서 기록 추가
   /* {
    * "userId": "user02", "bookIdx": 7, "status": "FINISHED", "ST_DT":
    * "2024-01-01", "ED_DT": "2024-01-10", "rating": 5, "content": "정말 감명 깊게 읽었어요!"
    * } */
    @PostMapping("/log/add")
    public String insertLog(@RequestBody ReadingLogDTO log) {
        int result = readingLogMapper.insertLog(log);
        return result > 0 ? "success" : "fail";
    }
    
    
//   @GetMapping("/test-db")
//    public void testDatabaseConnection() {
//        String userId = "user02"; // 테스트용 유저 아이디
//        String status = "READING"; // 읽기 상태
//
//        ArrayList<ReadingLogDTO> logs = readingLogMapper.findLogs(userId, status);
//
//        System.out.println("===== DB 연결 테스트 결과 =====");
//        for (ReadingLogDTO log : logs) {
//            System.out.println(log);
//        }
//    }
   
   /*
    * @GetMapping("/") public String test() { 
    *       System.out.println("home test");
    *       return "home"; 
    * }
    */
}
