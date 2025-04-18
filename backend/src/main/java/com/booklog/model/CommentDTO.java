package com.booklog.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentDTO {

	private int commentIdx;
	private String userId;
	private String content;
	private Integer parentIdx;
	private String createdAt;
	private int isDeleted;
	private String profileImgUrl;

	private int logIdx;

}
