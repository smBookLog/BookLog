package com.booklog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.booklog.db.UserMapper;
import com.booklog.model.UserDTO;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class UserController {

    @Autowired
    private UserMapper userMapper;

    // 회원가입
    // http://localhost:8082/controller/register
    @PostMapping(value = "/register", produces = "text/plain; charset=UTF-8")
    public String register(@RequestBody UserDTO user) {
        if (!user.getUserPw().equals(user.getConfirmPw())) {
        	return "비밀번호가 일치하지 않습니다.";
        }
        if (user.getUserId() == null || user.getUserId().trim().isEmpty()) {
            return "아이디를 입력해주세요.";
        }
        else if (userMapper.isUserIdExists(user.getUserId()) > 0) {
            return "이미 사용 중인 아이디입니다.";
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return "이메일을 입력해주세요.";
        }
        else if (userMapper.isEmailExists(user.getEmail()) > 0) {
            return "이미 등록된 이메일입니다.";
        }

        userMapper.insertUser(user);
        return "회원가입이 완료되었습니다.";
    }

    // 아이디 중복 확인
    @GetMapping(value = "/check/id", produces = "text/plain; charset=UTF-8")
    public String checkUserId(@RequestParam String userId) {
        return userMapper.isUserIdExists(userId) == 0 ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다.";
    }

    // 이메일 중복 확인
    @GetMapping(value = "/check/email", produces = "text/plain; charset=UTF-8")
    public String checkEmail(@RequestParam String email) {
        return userMapper.isEmailExists(email) == 0 ? "사용 가능한 이메일입니다." : "이미 등록된 이메일입니다.";
    }
    
    // 로그인
    // http://localhost:8082/controller/login
    @PostMapping(value = "/login", produces = "text/plain; charset=UTF-8")
    public String login(@RequestBody UserDTO loginDTO) {
        UserDTO user = userMapper.login(loginDTO.getUserId(), loginDTO.getUserPw());
        if (user != null) {
            return user.getName() + "님 환영합니다!";
        } else {
            return "아이디 또는 비밀번호가 올바르지 않습니다.";
        }
    }
    
    // 개인 정보 및 프로필 수정
    // http://localhost:8082/controller/update/1
//    {
//        "userId": "2",
//        "bio": "new bio",
//        "userPw": "1234",
//        "name": "John Doe",
//        "email": "john@example.com",
//        "profileImg": "수정할 이미지 url"
//    }
    @PutMapping(value = "/update/{originalUserId}", produces = "text/plain; charset=UTF-8")
    public String updateUserInfo(@PathVariable("originalUserId") String originalUserId,
                                 @RequestBody UserDTO user) {
        
    	// 아이디 공란
    	if (user.getUserId() == null || user.getUserId().trim().isEmpty()) {
    	    return "아이디를 입력해주세요.";
    	}
    	
    	// 아이디 중복 검사 (변경된 경우만 검사)
        if (!user.getUserId().equals(originalUserId) &&
            userMapper.isUserIdExists(user.getUserId()) > 0) {
            return "이미 사용 중인 아이디입니다.";
        }
        
        // 이메일을 공란
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return "이메일을 입력해주세요.";
        }

        // 이메일 중복 검사
        if (user.getEmail() != null && userMapper.isEmailExists(user.getEmail()) > 0) {
            return "이미 등록된 이메일입니다.";
        }

        user.setOriginalUserId(originalUserId);

        int result = userMapper.updateUserInfo(user);
        return result > 0 ? "회원 정보가 수정되었습니다." : "회원 정보 수정에 실패했습니다.";
    }


}