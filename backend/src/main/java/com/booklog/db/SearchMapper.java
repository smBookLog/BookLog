package com.booklog.db;

import org.apache.ibatis.annotations.Mapper;

import com.booklog.model.SearchDTO;

@Mapper
public interface SearchMapper {

	SearchDTO findUserById(String userId);

	SearchDTO findBookByIsbn(String isbn);

	void insertBook(SearchDTO dto);

}
