package com.booklog.db;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.booklog.model.UserRecommendDTO;

@Mapper
public interface GenreRecommendMapper {
	
	String findLatestGenre(String userId);
	String findTopGenre(String userId);
	
	ArrayList<UserRecommendDTO> recommendByGenre(@Param("genre") String genre, @Param("userId") String userId);

}
