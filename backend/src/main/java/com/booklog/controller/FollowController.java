package com.booklog.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.booklog.db.FollowMapper;
import com.booklog.model.FollowDTO;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class FollowController {
	
	@Autowired
	FollowMapper followMapper;

	// 팔로우 하기
//	{
//	  "followerId": "user02",
//	  "followingId": "user03"
//	}
	// http://localhost:8082/controller/follow
	@PostMapping("/follow")
	public String follow(@RequestBody FollowDTO follow) {
	    int result = followMapper.insertFollow(follow);
	    return result > 0 ? "followed" : "fail";
	}

	// 언팔로우 하기
	// http://localhost:8082/controller/unfollow/user01/user02
	@DeleteMapping("/unfollow/{followerId}/{followingId}")
	public String unfollow(@PathVariable String followerId, @PathVariable String followingId) {
	    int result = followMapper.deleteFollow(followerId, followingId);
	    return result > 0 ? "unfollowed" : "fail";
	}

	// 내가 팔로우한 사람 목록
	// http://localhost:8082/controller/following/user01
	@GetMapping("/following/{userId}")
	public ArrayList<String> getFollowing(@PathVariable String userId) {
	    return followMapper.findFollowing(userId);
	}

	// 나를 팔로우하는 사람 목록
	// http://localhost:8082/controller/followers/user01
	@GetMapping("/followers/{userId}")
	public ArrayList<String> getFollowers(@PathVariable String userId) {
	    return followMapper.findFollowers(userId);
	}
	
}
