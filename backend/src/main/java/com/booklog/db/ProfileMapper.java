package com.booklog.db;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.booklog.model.ProfileDTO;

@Mapper
public interface ProfileMapper {
	
	// 유저 프로필 조회
    ProfileDTO getProfile(@Param("userId") String userId);

}
