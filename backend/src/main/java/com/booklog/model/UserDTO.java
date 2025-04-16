package com.booklog.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
	
    private String userId;
    private String newUserId; 
    private String name;
    private String userPw;
    private String confirmPw;
    private String email;
    private String bio;
    private String profileImg;
}
