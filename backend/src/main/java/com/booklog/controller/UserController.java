package com.booklog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
    @PostMapping("/register")
    public String register(@RequestBody UserDTO user) {
        if (!user.getUserPw().equals(user.getConfirmPw())) {
            return "WRONG PW";
        }
        if (userMapper.isUserIdExists(user.getUserId()) > 0) {
            return "ID Duplication";
        }
        if (userMapper.isNicknameExists(user.getNickname()) > 0) {
            return "Nickname Duplication";
        }
        if (userMapper.isEmailExists(user.getEmail()) > 0) {
            return "Email Duplication";
        }

        userMapper.insertUser(user);
        return "Join Success";
    }

    // 아이디 중복 확인
    @GetMapping("/check/id")
    public String checkUserId(@RequestParam String userId) {
        return userMapper.isUserIdExists(userId) == 0 ? "Available" : "Already exists";
    }

    // 닉네임 중복 확인
    @GetMapping("/check/nickname")
    public String checkNickname(@RequestParam String nickname) {
        return userMapper.isNicknameExists(nickname) == 0 ? "Available" : "Already exists";
    }

    // 이메일 중복 확인
    @GetMapping("/check/email")
    public String checkEmail(@RequestParam String email) {
        return userMapper.isEmailExists(email) == 0 ? "Available" : "Already exists";
    }
    
    // 로그인
    @PostMapping("/login")
    public String login(@RequestBody UserDTO loginDTO) {
        UserDTO user = userMapper.login(loginDTO.getUserId(), loginDTO.getUserPw());
        if (user != null) {
            return "Login Success! Welcome" + user.getNickname();
        } else {
            return "Wrong ID or PW";
        }
    }
}