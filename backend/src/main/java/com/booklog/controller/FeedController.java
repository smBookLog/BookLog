package com.booklog.controller;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.booklog.db.FeedMapper;
import com.booklog.model.CommentDTO;
import com.booklog.model.FeedItemDTO;
import com.booklog.model.ReadingLogDTO;
import com.booklog.model.UserRecommendDTO;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@PropertySource("classpath:config.properties")
public class FeedController {

	@Autowired
	FeedMapper feedMapper;

	@Value("${gemini.api.key}")
	private String API_KEY;

	// http://localhost:8082/controller/main/user05
	@GetMapping("/main/{userId}")
	public List<FeedItemDTO> getFeed(@PathVariable String userId) {
		List<FeedItemDTO> feed = new ArrayList<>();
		ArrayList<CommentDTO> comments = new ArrayList<>();

		// 1. 첫 번째 독서 기록 5개
		List<ReadingLogDTO> logs1 = feedMapper.findLogs(0, userId); // 0부터 시작 (offset)

		// 각 로그에 대해 댓글을 가져오기
		for (ReadingLogDTO log : logs1) {
			int logIdx = log.getLogIdx(); // logIdx를 각 log에서 추출
			comments = new ArrayList<>(feedMapper.findCommentsByLogIdx(logIdx)); // logIdx로 댓글 조회
			log.setComments(comments); // 댓글을 해당 로그에 세팅
		}

		feed.add(makeFeedItem("log", logs1));

		// 2. 추천 유저들
		ArrayList<UserRecommendDTO> recommendedUsers = recommendUsersByGenres(userId);
		feed.add(makeFeedItem("recommend_user", recommendedUsers));

		// 3. 두 번째 독서 기록 5개
		List<ReadingLogDTO> logs2 = feedMapper.findLogs(5, userId); // 5부터 시작 (offset 5)
		for (ReadingLogDTO log : logs2) {
			int logIdx = log.getLogIdx(); // logIdx를 각 log에서 추출
			comments = new ArrayList<>(feedMapper.findCommentsByLogIdx(logIdx)); // logIdx로 댓글 조회
			log.setComments(comments); // 댓글을 해당 로그에 세팅
		}
		feed.add(makeFeedItem("log", logs2));

		// 4. Gemini 책 추천
		String geminiRecommendation = getRecommendationFromLog(userId);
		feed.add(makeFeedItem("recommend_text", geminiRecommendation));

		// 5. 세 번째 독서 기록 5개
		List<ReadingLogDTO> logs3 = feedMapper.findLogs(10, userId); // 10부터 시작 (offset 10)
		for (ReadingLogDTO log : logs3) {
			int logIdx = log.getLogIdx(); // logIdx를 각 log에서 추출
			comments = new ArrayList<>(feedMapper.findCommentsByLogIdx(logIdx)); // logIdx로 댓글 조회
			log.setComments(comments); // 댓글을 해당 로그에 세팅
		}
		feed.add(makeFeedItem("log", logs3));

		// 6. 네 번째 독서 기록 5개
		List<ReadingLogDTO> logs4 = feedMapper.findLogs(15, userId); // 15부터 시작 (offset 15)
		for (ReadingLogDTO log : logs4) {
			int logIdx = log.getLogIdx(); // logIdx를 각 log에서 추출
			comments = new ArrayList<>(feedMapper.findCommentsByLogIdx(logIdx)); // logIdx로 댓글 조회
			log.setComments(comments); // 댓글을 해당 로그에 세팅
		}
		feed.add(makeFeedItem("log", logs4));

		// 7. 다섯 번째 독서 기록 5개
		List<ReadingLogDTO> logs5 = feedMapper.findLogs(20, userId); // 20부터 시작 (offset 20)
		for (ReadingLogDTO log : logs5) {
			int logIdx = log.getLogIdx(); // logIdx를 각 log에서 추출
			comments = new ArrayList<>(feedMapper.findCommentsByLogIdx(logIdx)); // logIdx로 댓글 조회
			log.setComments(comments); // 댓글을 해당 로그에 세팅
		}
		feed.add(makeFeedItem("log", logs5));

		// 8. 여섯 번째 독서 기록 5개
		List<ReadingLogDTO> logs6 = feedMapper.findLogs(25, userId); // 25부터 시작 (offset 25)
		for (ReadingLogDTO log : logs6) {
			int logIdx = log.getLogIdx(); // logIdx를 각 log에서 추출
			comments = new ArrayList<>(feedMapper.findCommentsByLogIdx(logIdx)); // logIdx로 댓글 조회
			log.setComments(comments); // 댓글을 해당 로그에 세팅
		}
		feed.add(makeFeedItem("log", logs6));
		
		return feed;
	}

	// 피드 아이템
	private FeedItemDTO makeFeedItem(String type, Object data) {
		FeedItemDTO item = new FeedItemDTO();
		item.setType(type);
		item.setData(data);
		return item;
	}

	// 책 추천
	public String getRecommendationFromLog(@PathVariable String userId) {

		// 인용구 불러오기
		ArrayList<String> quotes = new ArrayList<>(feedMapper.findQuotesByUserId(userId));

		if (quotes == null || quotes.isEmpty()) {
			return "인용구가 없습니다.";
		}

		String joinedQuotes = quotes.stream().map(q -> "- " + q).collect(Collectors.joining("\n"));

		// 인용구와 prompt 결합
		String prompt = "I told you don't speak in English, No English at all"
				+ "The following are quotes that the user saved from books they read. Based on these quotes, analyze the user's interests and recommend exactly 5 Korean books that match those themes. "
				+ "The response must follow this **exact** format:\n" 
				+ "📚 제목 / 작가명 \n\n" 
				+ "→ 책 소개 \n\n\n\n"
				+ "List only the book title, author and descripion in Korean. NO ENGLISH AT ALL!!!!!"
				+ "Do not explain anything. No numbering. No extra description. Just output in the above format.\n"
				+ joinedQuotes;

		// JSON body 생성
		String jsonBody = "{\n" + "  \"contents\": [\n" + "    {\n" + "      \"parts\": [\n" + "        {\n"
				+ "          \"text\": \"" + prompt + "\"\n" + "        }\n" + "      ]\n" + "    }\n" + "  ]\n" + "}";

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

		// RestTemplate에 UTF-8 인코딩 설정 추가!
		RestTemplate restTemplate = new RestTemplate();
		restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));

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

		// 결과 반환
		return text;
	}

	// 유저 추천
	public ArrayList<UserRecommendDTO> recommendUsersByGenres(@PathVariable String userId) {

		ArrayList<UserRecommendDTO> finalList = new ArrayList<>();

		// 최다 장르
		String topGenre = feedMapper.findTopGenre(userId);
		System.out.println("Top Genre: " + topGenre);

		if (topGenre != null) {
			ArrayList<UserRecommendDTO> topGenreList = feedMapper.recommendByGenre(topGenre, userId);

			for (UserRecommendDTO dto : topGenreList) {
				boolean alreadyAdded = false;

				for (UserRecommendDTO added : finalList) {

					if (dto.getUserId().equals(added.getUserId())) {
						alreadyAdded = true;
						break;
					}
				}
				if (!alreadyAdded)
					finalList.add(dto);
			}
		}
		System.out.println("최다: " + finalList.toString());

		// 최신 장르
		String latestGenre = feedMapper.findLatestGenre(userId);

		if (latestGenre != null) {
			ArrayList<UserRecommendDTO> latestGenreList = feedMapper.recommendByGenre(latestGenre, userId);
			System.out.println("Latest Genre: " + latestGenre);

			for (UserRecommendDTO dto : latestGenreList) {
				boolean alreadyAdded = false;

				for (UserRecommendDTO added : finalList) {

					if (dto.getUserId().equals(added.getUserId())) {
						alreadyAdded = true;
						break;
					}
				}
				if (!alreadyAdded)
					finalList.add(dto);
				if (finalList.size() >= 10)
					break; // 최대 10명
			}
		}

		System.out.println("최신: " + finalList.toString());

		return finalList;
	}
}