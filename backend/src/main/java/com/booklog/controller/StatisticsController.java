package com.booklog.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.booklog.db.StatisticsMapper;
import com.booklog.model.StatisticsDTO;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class StatisticsController {
	
	@Autowired
	StatisticsMapper statisticsMapper;

	// 월별 독서량 통계 조회
	// http://localhost:8082/controller/log/stat/monthly/user01
	@GetMapping(value = "/log/stat/monthly/{userId}")
	public ArrayList<StatisticsDTO> getMonthlyStats(@PathVariable String userId) {
	    return statisticsMapper.getMonthlyStats(userId);
	}

	// 많이 읽은 장르 통계
	// http://localhost:8082/controller/log/stat/genre/user01
	@GetMapping(value = "/log/stat/genre/{userId}")
	public ArrayList<StatisticsDTO> getGenreStats(@PathVariable String userId) {
	    return statisticsMapper.getGenreStats(userId);
	}
	
}
