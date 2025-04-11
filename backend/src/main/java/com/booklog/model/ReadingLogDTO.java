package com.booklog.model;

import java.util.ArrayList;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReadingLogDTO {
   private int logIdx;
   private String userId;
   private String status;
   private String startDate;
   private String endDate;
   private int rating;
   private String content;
   private String createdAt;

   private int bookIdx;
   private String title;
   private String author;
   private String genre;
   private String description;
   private String bookImgUrl;
   
   private String profileImgUrl;   
   private int likeCount;
   private ArrayList<String> tags;
   private ArrayList<String> quotes;
   private ArrayList<CommentDTO> comments;
}
