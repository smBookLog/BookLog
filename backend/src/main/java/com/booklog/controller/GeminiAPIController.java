package com.booklog.controller;

import java.util.ArrayList;
import java.util.stream.Collectors;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.booklog.db.GeminiApiMapper;

@CrossOrigin(origins = "http://localhost:3001")
@RestController
@PropertySource("classpath:config.properties")
public class GeminiApiController {

	@Autowired
	GeminiApiMapper geminiApiMapper;

	@Value("${gemini.api.key}")
	private String API_KEY;

	// 인용구 자동 조회 후 Gemini API를 통한 책 추천
	// http://localhost:8082/controller/recommend/user01
	@PostMapping(value = "/recommend/{userId}", produces = "text/plain; charset=UTF-8")
	public String getRecommendationFromLog(@PathVariable String userId) {
		// 인용구 불러오기
		ArrayList<String> quotes = new ArrayList<>(geminiApiMapper.findQuotesByUserId(userId));

		if (quotes == null || quotes.isEmpty()) {
			return "인용구가 없습니다.";
		}

		String joinedQuotes = quotes.stream().map(q -> "- " + q).collect(Collectors.joining("\n"));

		// 인용구와 prompt 결합
		String prompt = "The following are quotes that the user saved from books they read. Based on these quotes, analyze the user's interests and recommend 5 books in Korean that match those themes."
				+ "Provide only the book title, author, and publisher for each recommendation in Korean, without any explanation. Remember, no any explanation!!! \n"
				+ joinedQuotes;

		// JSON body 생성
		String jsonBody = "{\n" + "  \"contents\": [\n" + "    {\n" + "      \"parts\": [\n" + "        {\n"
				+ "          \"text\": \"" + prompt + "\"\n" + "        }\n" + "      ]\n" + "    }\n" + "  ]\n" + "}";

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);
		RestTemplate restTemplate = new RestTemplate();

		String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="
				+ API_KEY;

		// API 요청 후 결과 반환
		String response = restTemplate.postForObject(url, entity, String.class);

		// 응답 JSON 파싱
		JSONObject responseObject = new JSONObject(response);
		JSONArray candidates = responseObject.getJSONArray("candidates");
		JSONObject content = candidates.getJSONObject(0).getJSONObject("content");
		JSONArray parts = content.getJSONArray("parts");
		String text = parts.getJSONObject(0).getString("text");

		// 추천 책 정보 콘솔 창에 출력
		System.out.println("# 추천 도서 목록:");
		String[] lines = text.split("\n");
		for (String line : lines) {
			if (line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.") ||
				line.startsWith("4.") || line.startsWith("5.")) {
				System.out.println(line);
			}
		}

		// 결과 반환
		return response;
	}
}
