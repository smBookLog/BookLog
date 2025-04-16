package com.booklog.controller;

import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.booklog.db.SearchMapper;
import com.booklog.model.SearchDTO;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@PropertySource("classpath:config.properties")
public class SearchController {

	@Autowired
	SearchMapper mapper;
	
	@Value("${library.api.key}")
	private String API_KEY;

	// 유저 검색
	// http://localhost:8082/controller/search/user?userId=hong123
	@GetMapping(value = "/search/user", produces = "application/json; charset=UTF-8")
	public Object searchUser(@RequestParam("userId") String userId) {
		SearchDTO user = mapper.findUserById(userId);
		if (user != null)
			return user;
		else
			return new JSONObject().put("message", "사용자를 찾을 수 없습니다").toString();
	}

	// 책 검색 (ISBN 기준)
	// http://localhost:8082/controller/search/book?isbn=9788954677158
	@GetMapping(value = "/search/book", produces = "application/json; charset=UTF-8")
	public Object searchBook(@RequestParam("isbn") String isbn) {
		SearchDTO book = mapper.findBookByIsbn(isbn);
		if (book != null)
			return book;

		// 없으면 외부 API 호출
		String url = "https://data4library.kr/api/srchDtlList?authKey=" + API_KEY + "&isbn13=" + isbn + "&format=json";

		RestTemplate rest = new RestTemplate();
		String response = rest.getForObject(url, String.class);

		try {
			System.out.println("API 응답: " + response); // 응답 구조 확인

			JSONObject json = new JSONObject(response);
			JSONObject responseObj = json.getJSONObject("response");

			// detail 키가 있는지 확인
			if (!responseObj.has("detail")) {
				return new JSONObject().put("message", "책 정보를 찾을 수 없습니다").toString();
			}

			JSONArray detailArray = responseObj.getJSONArray("detail");
			if (detailArray.isEmpty()) {
				return new JSONObject().put("message", "책 정보를 찾을 수 없습니다").toString();
			}

			JSONObject bookObj = detailArray.getJSONObject(0).getJSONObject("book"); // "book" 객체 가져오기

			SearchDTO newBook = new SearchDTO();
			newBook.setIsbn(isbn);
			newBook.setTitle(bookObj.optString("bookname", ""));
			newBook.setAuthor(bookObj.optString("authors", ""));
//			newBook.setGenre(bookObj.optString("class_nm", ""));
			newBook.setDescription(bookObj.optString("description", ""));
			newBook.setBookImg(bookObj.optString("bookImageURL", ""));
			
			String genreRaw = bookObj.optString("class_nm", "").trim();
			String genre = "기타";  // 기본값 설정

			if (genreRaw != null && !genreRaw.isEmpty()) {
			    String[] genreParts = genreRaw.split(">");
			    if (genreParts.length > 0 && !genreParts[0].trim().isEmpty()) {
			        genre = genreParts[0].trim();  // 유효한 첫 단어가 있는 경우만 저장
			    }
			}

			newBook.setGenre(genre);
			
			// DB에 책 정보 저장
			mapper.insertBook(newBook);

			return newBook;
		} catch (Exception e) {
			e.printStackTrace();
			return new JSONObject().put("message", "책 정보를 찾을 수 없습니다").toString();
		}
	}
	
	// 제목 또는 저자 이름으로 책 검색
	// http://localhost:8082/controller/search/book/keyword?keyword=데미안
	@GetMapping(value = "/search/book/keyword", produces = "application/json; charset=UTF-8")
	public Object searchBooksByKeyword(@RequestParam("keyword") String keyword) {
	    ArrayList<SearchDTO> books = mapper.findBooksByKeyword(keyword);

	    if (books != null && !books.isEmpty())
	        return books;
	    else
	        return new JSONObject().put("message", "검색 결과가 없습니다").toString();
	}

}
