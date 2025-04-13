package com.booklog.db;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.booklog.model.StatisticsDTO;
import com.booklog.model.UserRecommendDTO;

@Mapper
public interface StatisticsMapper {
	
	// 월별 독서량 통계 조회
	ArrayList<StatisticsDTO> getMonthlyStats(String userId);
	
	// 많이 읽은 장르 통계
	ArrayList<StatisticsDTO> getGenreStats(String userId);

}
