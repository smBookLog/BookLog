package com.booklog.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRecommendDTO {
	
    private String userId;
    private String nickname;
    private String genre;
    private int genreCount;
//    private String profileImg;

}
