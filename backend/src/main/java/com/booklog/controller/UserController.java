package com.booklog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.booklog.db.UserMapper;
import com.booklog.model.UserDTO;

@CrossOrigin(origins = "http://localhost:3001")
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
        if (userMapper.isUserIdExists(user.getUserId()) > 0) {
            return "이미 사용 중인 아이디입니다.";
        }
        if (userMapper.isNicknameExists(user.getNickname()) > 0) {
            return "이미 사용 중인 닉네임입니다.";
        }
        if (userMapper.isEmailExists(user.getEmail()) > 0) {
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

    // 닉네임 중복 확인
    @GetMapping(value = "/check/nickname", produces = "text/plain; charset=UTF-8")
    public String checkNickname(@RequestParam String nickname) {
        return userMapper.isNicknameExists(nickname) == 0 ? "사용 가능한 닉네임입니다." : "이미 사용 중인 닉네임입니다.";
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
    // http://localhost:8082/controller/update
//    {
//        "userId": "1",
//        "nickname": "newNick",
//        "bio": "new bio",
//        "userPw": "1234",
//        "name": "John Doe",
//        "email": "john@example.com",
//        "profileImg": "수정할 이미지 url"
//    }
    @PutMapping(value = "/update", produces = "text/plain; charset=UTF-8")
    public String updateUserInfo(@RequestBody UserDTO user) {
        // 닉네임 중복 검사
        if (user.getNickname() != null && userMapper.isNicknameExists(user.getNickname()) > 0) {
            return "이미 사용 중인 닉네임입니다.";
        }

        // 이메일 중복 검사
        if (user.getEmail() != null && userMapper.isEmailExists(user.getEmail()) > 0) {
            return "이미 등록된 이메일입니다.";
        }

        // 수정할 정보 설정
        int result = userMapper.updateUserInfo(user);
        return result > 0 ? "회원 정보가 수정되었습니다." : "회원 정보 수정에 실패했습니다.";
    }

}