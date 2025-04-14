package com.booklog.model;

import java.util.ArrayList;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchResponseDTO {
	
    private ArrayList<SearchDTO> userResults; // 유저 검색 결과
    private ArrayList<SearchDTO> bookList; // 도서 검색 결과
    
}