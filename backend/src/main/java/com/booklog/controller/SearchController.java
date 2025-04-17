package com.booklog.controller;

import java.util.ArrayList;
import java.util.List;

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

	    String url = "https://data4library.kr/api/srchDtlList?authKey=" + API_KEY + "&isbn13=" + isbn + "&format=json";
	    RestTemplate rest = new RestTemplate();
	    String response = rest.getForObject(url, String.class);

	    try {
	        JSONObject json = new JSONObject(response);
	        JSONObject responseObj = json.getJSONObject("response");

	        if (!responseObj.has("detail")) {
	            return new JSONObject().put("message", "책 정보를 찾을 수 없습니다").toString();
	        }

	        JSONArray detailArray = responseObj.getJSONArray("detail");
	        if (detailArray.isEmpty()) {
	            return new JSONObject().put("message", "책 정보를 찾을 수 없습니다").toString();
	        }

	        JSONObject bookObj = detailArray.getJSONObject(0).getJSONObject("book");

	        SearchDTO newBook = new SearchDTO();
	        newBook.setIsbn(isbn);
	        newBook.setTitle(bookObj.optString("bookname", ""));
	        newBook.setAuthor(bookObj.optString("authors", ""));
	        newBook.setDescription(bookObj.optString("description", ""));
	        newBook.setBookImg(bookObj.optString("bookImageURL", ""));

	        String genreRaw = bookObj.optString("class_nm", "").trim();
	        String genre = "기타";
	        if (!genreRaw.isEmpty()) {
	            String[] genreParts = genreRaw.split(">");
	            if (genreParts.length > 0 && !genreParts[0].trim().isEmpty()) {
	                genre = genreParts[0].trim();
	            }
	        }
	        newBook.setGenre(genre);

	        // DB에 저장
	        mapper.insertBook(newBook);

	        // 새로 insert된 bookIdx 조회 후 세팅
	        Integer bookIdx = mapper.findBookIdxByIsbn(isbn);
	        newBook.setBookIdx(bookIdx);

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
	// 유저 전체 목록 반환
   // http://localhost:8082/controller/search/users
   @GetMapping(value = "/search/users", produces = "application/json; charset=UTF-8")
   public Object getAllUsersFull() {
      List<SearchDTO> users = mapper.findAllUsers();
      return users;
   }

   // 책 전체 목록 반환
   // http://localhost:8082/controller/search/books
   @GetMapping(value = "/search/books", produces = "application/json; charset=UTF-8")
   public Object getAllBooksFull() {
      List<SearchDTO> books = mapper.findAllBooks();
      return books;
   }

   // 유저 최대 5개 반환
   // http://localhost:8082/controller/search/all/users
   @GetMapping(value = "/search/all/users", produces = "application/json; charset=UTF-8")
   public Object getLimitedUsers() {
      List<SearchDTO> users = mapper.findAllUsers();
      return users.size() > 5 ? users.subList(0, 5) : users;
   }

   // 책 최대 5개 반환
   // http://localhost:8082/controller/search/all/books
   @GetMapping(value = "/search/all/books", produces = "application/json; charset=UTF-8")
   public Object getLimitedBooks() {
      List<SearchDTO> books = mapper.findAllBooks();
      return books.size() > 5 ? books.subList(0, 5) : books;
   }
   
   // 유저 검색 소문자 가능
   @GetMapping(value = "/search/user/keyword", produces = "application/json; charset=UTF-8")
   public Object searchUsersByKeyword(@RequestParam("keyword") String keyword) {
       List<SearchDTO> users = mapper.findUsersByKeyword(keyword);
       if (users != null && !users.isEmpty())
           return users;
       else
           return new JSONObject().put("message", "검색 결과가 없습니다").toString();
   }


}
