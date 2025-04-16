package com.booklog.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.booklog.db.GeminiApiMapper;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@PropertySource("classpath:config.properties")
public class GeminiApiController {

   @Autowired
   GeminiApiMapper geminiApiMapper;

   @Value("${gemini.api.key}")
   private String API_KEY;
   
   @Value("${library.api.key}")
   private String apiKey;

   // 인용구 자동 조회 후 Gemini API를 통한 책 추천
   // http://localhost:8082/controller/recommend/user01
   @PostMapping(value = "/recommend/{userId}", produces = "application/json; charset=UTF-8")
   public List<Map<String, String>> getBookInfoFromGemini(@PathVariable String userId) throws Exception {

       // 1. 인용구 기반 Gemini 응답 받기
       ArrayList<String> quotes = new ArrayList<>(geminiApiMapper.findQuotesByUserId(userId));

       if (quotes == null || quotes.isEmpty()) {
    	    Map<String, String> errorMap = new HashMap<>();
    	    errorMap.put("error", "인용구가 없습니다.");
    	    return Collections.singletonList(errorMap);
    	}

       String joinedQuotes = quotes.stream().map(q -> "- " + q).collect(Collectors.joining("\n"));
       String prompt = "The following are quotes that the user saved from books they read. Based on these quotes, recommend exactly 5 Korean books with **title and author only in Korean**. No explanation or numbering.\n"
               + joinedQuotes;

       String jsonBody = "{\n" + "  \"contents\": [\n" + "    {\n" + "      \"parts\": [\n" + "        {\n"
               + "          \"text\": \"" + prompt + "\"\n" + "        }\n" + "      ]\n" + "    }\n" + "  ]\n" + "}";


       
       HttpHeaders headers = new HttpHeaders();
       headers.setContentType(MediaType.APPLICATION_JSON);

       HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

       RestTemplate restTemplate = new RestTemplate();
       restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));

       String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY;
       String response = restTemplate.postForObject(url, entity, String.class);

       // 2. 응답 파싱
       JSONObject responseObject = new JSONObject(response);
       JSONArray candidates = responseObject.getJSONArray("candidates");
       JSONObject content = candidates.getJSONObject(0).getJSONObject("content");
       JSONArray parts = content.getJSONArray("parts");
       String text = parts.getJSONObject(0).getString("text");

       System.out.println("Gemini API Response: " + text);

       // 3. Gemini 응답 파싱 (줄마다 "제목 / 저자" 형태라고 가정)
       List<Map<String, String>> resultList = new ArrayList<>();
       String[] lines = text.split("\n");
       
       for (String line : lines) {
           String[] split = line.split("\\s*/\\s*"); // 제목 / 저자
           if (split.length >= 2) {
               String title = split[0].trim();
               String author = split[1].trim();

               // 4. 도서 검색 API 호출
               String apiKey = "[발급받은키]"; // 여기에 본인의 API 키 삽입
               String searchUrl = "http://data4library.kr/api/srchBooks?authKey=" + apiKey +
                                  "&keyword=" + URLEncoder.encode(title + " " + author, "UTF-8") +
                                  "&format=json";

               System.out.println("검색 URL: " + searchUrl);
               
               String bookJson = restTemplate.getForObject(searchUrl, String.class);
               JSONObject bookResponse = new JSONObject(bookJson);
               JSONArray docs = bookResponse.getJSONObject("response").getJSONArray("docs");

               System.out.println("도서 검색 쿼리: " + title + " " + author);
               System.out.println("도서 API 응답: " + bookJson);

               
               if (docs.length() > 0) {
                   JSONObject doc = docs.getJSONObject(0).getJSONObject("doc");

                   Map<String, String> bookInfo = new HashMap<>();
                   bookInfo.put("title", doc.optString("bookname"));
                   bookInfo.put("author", doc.optString("authors"));
                   bookInfo.put("isbn13", doc.optString("isbn13"));
                   bookInfo.put("keyword", doc.optString("class_nm")); // 주제 분류명

                   resultList.add(bookInfo);
               }
           }
       }
       System.out.println("최종 결과: " + resultList);

       return resultList;
   }
}