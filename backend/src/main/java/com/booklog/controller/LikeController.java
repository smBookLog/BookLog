package com.booklog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.booklog.db.LikeMapper;
import com.booklog.model.LikeDTO;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class LikeController {

	@Autowired
	LikeMapper likeMapper;

	// 좋아요 추가
	// http://localhost:8082/controller/like
	@PostMapping("/like")
	public String like(@RequestBody LikeDTO like) {
		int logIdx = like.getLogIdx();
		String userId = like.getUserId();

		if (likeMapper.hasLiked(logIdx, userId) == 0) {
			likeMapper.insertLike(logIdx, userId);
			return "liked";
		}
		return "already liked";
	}

	// 좋아요 취소
	// http://localhost:8082/controller/dislike
	@DeleteMapping("/dislike")
	public String unlike(@RequestBody LikeDTO like) {
	    int logIdx = like.getLogIdx();
	    String userId = like.getUserId();

	    if (likeMapper.hasLiked(logIdx, userId) > 0) {
	        likeMapper.deleteLike(logIdx, userId);
	        return "unliked";
	    }
	    return "not liked";
	}

	// 좋아요 수 조회
	// http://localhost:8082/controller/39/likes
	@GetMapping("/{logIdx}/likes")
	public int getLikeCount(@PathVariable int logIdx) {
		return likeMapper.countLikes(logIdx);
	}
}
