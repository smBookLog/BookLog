package com.booklog.db;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.booklog.model.CommentDTO;
import com.booklog.model.ReadingLogDTO;

@Mapper
public interface ReadingLogMapper {

   ArrayList<ReadingLogDTO> findMyLogs(@Param("userId") String userId, @Param("status") String status);

   ArrayList<String> findTagsByLogIdx(int logIdx);

   ArrayList<String> findQuotesByLogIdx(int logIdx);
   
   ArrayList<ReadingLogDTO> findLogs(@Param("userId") String userId, @Param("logIdx") int logIdx);
   
   ArrayList<CommentDTO> findCommentsByLogIdx(int logIdx);

   int insertLog(ReadingLogDTO log);
   
   
}
