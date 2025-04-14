package com.booklog.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.booklog.db.SearchMapper;
import com.booklog.model.SearchDTO;
import com.booklog.model.SearchResponseDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class SearchController {
	
    @Autowired
    SearchMapper searchMapper;
    
    // 검색하기
    // http://localhost:8082/controller/search?keyword=9788954682152
    @GetMapping("/search")
    public ResponseEntity<SearchResponseDTO> searchAll(@RequestParam("keyword") String keyword) {
        try {
            // 1. 유저 검색
            ArrayList<SearchDTO> userResults = searchMapper.searchUsers(keyword);

            // 2. 도서 검색 (DB에서 ISBN을 검색)
            SearchDTO searchParam = new SearchDTO();
            searchParam.setTitle(keyword);
            SearchDTO bookResult = searchMapper.searchBook(searchParam);

            ArrayList<SearchDTO> bookList = new ArrayList<>();

            if (bookResult == null) {
                // DB에 없으면 외부 API 호출
                String apiUrl = "http://data4library.kr/api/srchDtlList";
                String serviceKey = "5fc613330afdcefb766a14bc9dedd3d58915597019c7c6da4c47d4f4816677ce"; // 발급받은 API 키
                String url = apiUrl + "?authKey=" + serviceKey + "&isbn13=" + keyword + "&format=json";

                System.out.println(url);
                
                RestTemplate restTemplate = new RestTemplate();
                String bookJson = restTemplate.getForObject(url, String.class);

                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode root = objectMapper.readTree(bookJson);
                JsonNode detailNode = root.path("response").path("detail");

                if (detailNode.isArray() && detailNode.size() > 0) {
                    JsonNode bookWrapper = detailNode.get(0);
                    JsonNode book = bookWrapper.path("book"); // ← 여기 주의

                    SearchDTO dto = new SearchDTO();
                    dto.setBookIdx(0); // DB 저장 전
                    dto.setIsbn(book.path("isbn13").asText());
                    dto.setTitle(book.path("bookname").asText());
                    dto.setAuthor(book.path("authors").asText());
                    dto.setGenre(book.path("class_nm").asText());
                    dto.setDescription(book.path("description").asText());
                    dto.setBookImgUrl(book.path("bookImageURL").asText());

                    // DB에 저장
                    searchMapper.insertBook(dto);
                    bookList.add(dto);

                } else {
                    // 외부 API에도 도서 정보가 없으면
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // 도서 정보 없음
                }
            } else {
                bookList.add(bookResult);
            }

            // 응답 DTO 생성
            SearchResponseDTO responseDTO = new SearchResponseDTO(userResults, bookList);
            return new ResponseEntity<>(responseDTO, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}