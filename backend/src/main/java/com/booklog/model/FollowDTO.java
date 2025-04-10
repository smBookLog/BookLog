package com.booklog.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FollowDTO {
	
    private int followIdx;
    private String followerId;  // 팔로우 하는 사람
    private String followingId; // 팔로우 당하는 사람

}
