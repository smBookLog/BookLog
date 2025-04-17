package com.booklog.db;

import java.util.ArrayList;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.booklog.model.SearchDTO;

@Mapper
public interface SearchMapper {

	// 유저 ID로 유저 검색
	SearchDTO findUserById(String userId);

	// ISBN으로 책 검색
	SearchDTO findBookByIsbn(String isbn);

	// 책 추가
	void insertBook(SearchDTO dto);
	
	// 제목 또는 저자로 책 검색
	ArrayList<SearchDTO> findBooksByKeyword(@Param("keyword") String keyword);
	// 전체 책, 유저
	List<SearchDTO> findAllUsers();
	List<SearchDTO> findAllBooks();
	List<SearchDTO> findUsersByKeyword(String keyword);

	Integer findBookIdxByIsbn(String isbn);

}
