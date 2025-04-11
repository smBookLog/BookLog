package com.booklog.db;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import com.booklog.model.StatisticsDTO;

@Mapper
public interface StatisticsMapper {
	
	ArrayList<StatisticsDTO> getMonthlyStats(String userId);
	
	ArrayList<StatisticsDTO> getGenreStats(String userId);

}
