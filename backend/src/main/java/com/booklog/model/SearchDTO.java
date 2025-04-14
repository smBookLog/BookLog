package com.booklog.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchDTO {
	
    // 유저용
    private String userId;
    private String name;
    private String email;
    private String bio;
    private String profileImg;

    // 책용
    private String isbn;
    private String title;
    private String author;
    private String genre;
    private String description;
    private String bookImg;
    private String message;

}
