package com.booklog.db;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.booklog.model.UserDTO;

@Mapper
public interface UserMapper {
	
	// 회원가입
	void insertUser(UserDTO user);
	
	// 회원가입 관련 중복 체크
	int isUserIdExists(String userId);
	int isEmailExists(String email);
	
	// 로그인용
	UserDTO login(@Param("userId") String userId, @Param("userPw") String userPw);
	
	// 개인 정보 및 프로필 수정
	int updateUserInfo(UserDTO user);
	
	// 사용자 ID로 사용자 정보 조회
    UserDTO getUserById(String userId);
}
