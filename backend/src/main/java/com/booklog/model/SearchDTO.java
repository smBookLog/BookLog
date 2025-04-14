package com.booklog.model;

import java.util.ArrayList;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchDTO {
	
    // 유저용
    private String userId;
    private String email;
    private String name;
    private String profileImgUrl;
    
    // 도서용
    private int bookIdx;
    private String isbn;
    private String title;
    private String author;
    private String genre;
    private String description;
    private String bookImgUrl;
    
    // 검색 결과 컨테이너
    private ArrayList<SearchDTO> userResults;
    private String bookApiResults;
    
    // 검색 결과 컨테이너용 생성자
    public SearchDTO(ArrayList<SearchDTO> userResults, String bookApiResults) {
        this.userResults = userResults;
        this.bookApiResults = bookApiResults;
    }
    
}