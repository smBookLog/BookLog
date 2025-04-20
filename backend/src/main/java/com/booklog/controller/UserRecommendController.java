package com.booklog.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.booklog.db.UserRecommendMapper;
import com.booklog.model.UserRecommendDTO;

@CrossOrigin(origins = "http://localhost:3001")
@RestController
public class UserRecommendController {

	@Autowired
	UserRecommendMapper userRecommendMapper;

    // http://localhost:8082/controller/genre-mixed/user05
    @GetMapping(value = "/genre-mixed/{userId}", produces = "application/json; charset=UTF-8")
    public ArrayList<UserRecommendDTO> recommendUsersByGenres(@PathVariable String userId) {

        ArrayList<UserRecommendDTO> finalList = new ArrayList<>();
        
        // 최다 장르
        String topGenre = userRecommendMapper.findTopGenre(userId);
        System.out.println("Top Genre: " + topGenre);
        
        if (topGenre != null) {
            ArrayList<UserRecommendDTO> topGenreList = userRecommendMapper.recommendByGenre(topGenre, userId);
            
            for (UserRecommendDTO dto : topGenreList) {
                boolean alreadyAdded = false;
                
                for (UserRecommendDTO added : finalList) {
                	
                    if (dto.getUserId().equals(added.getUserId())) {
                        alreadyAdded = true;
                        break;
                    }
                }
                if (!alreadyAdded) finalList.add(dto);
            }
        }
        System.out.println("최다: " + finalList.toString());
        
        // 최신 장르
        String latestGenre = userRecommendMapper.findLatestGenre(userId);
        
        if (latestGenre != null) {
            ArrayList<UserRecommendDTO> latestGenreList = userRecommendMapper.recommendByGenre(latestGenre, userId);
            System.out.println("Latest Genre: " + latestGenre);
            
            for (UserRecommendDTO dto : latestGenreList) {
                boolean alreadyAdded = false;
                
                for (UserRecommendDTO added : finalList) {
                	
                    if (dto.getUserId().equals(added.getUserId())) {
                        alreadyAdded = true;
                        break;
                    }
                }
                if (!alreadyAdded) finalList.add(dto);
                if (finalList.size() >= 10) break; // 최대 10명
            }
        }
        
        System.out.println("최신: " + finalList.toString());

        return finalList;
    }
}
