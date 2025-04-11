package com.booklog.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
	
    private String userId;
    private String name;
    private String userPw;
    private String confirmPw;
    private String nickname;
    private String email;
    private String bio;
    private String profileImg;
    
}
