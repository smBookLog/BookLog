package com.booklog.db;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.booklog.model.FollowDTO;

@Mapper
public interface FollowMapper {

	int insertFollow(FollowDTO follow);

	int deleteFollow(@Param("followerId") String followerId,
	                 @Param("followingId") String followingId);

	ArrayList<String> findFollowing(@Param("userId") String userId);

	ArrayList<String> findFollowers(@Param("userId") String userId);

}
