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
	int isNicknameExists(String nickname);
	int isEmailExists(String email);
	
	// 로그인용
	 UserDTO login(@Param("userId") String userId, @Param("userPw") String userPw);

}
