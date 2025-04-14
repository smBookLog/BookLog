package com.booklog.db;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;
import com.booklog.model.SearchDTO;

@Mapper
public interface SearchMapper {
	
    // 유저 검색
    ArrayList<SearchDTO> searchUsers(String keyword);
    
    // 도서 검색 (DB)
    SearchDTO searchBook(SearchDTO dto);
    
    // 도서 삽입
    void insertBook(SearchDTO dto);
    
    SearchDTO findBookByIsbn(String isbn);
    
}