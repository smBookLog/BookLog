package com.booklog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.booklog.db.ProfileMapper;
import com.booklog.model.ProfileDTO;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class ProfileController {

	@Autowired
	ProfileMapper profileMapper;
	
	// 프로필 조회
    // http://localhost:8082/controller/profile/user01
    @GetMapping("/profile/{userId}")
    public ProfileDTO getProfile(@PathVariable String userId) {
        return profileMapper.getProfile(userId);
    }


}
