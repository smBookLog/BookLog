package com.booklog.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDTO {

	private String userId;
	private String bio;
	private String profileImg;
	private int followingCount;
	private int followerCount;

}
