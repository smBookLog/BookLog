package com.booklog.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatisticsDTO {
	
    private String month;
    private int monthly_count; 
    private String genre;
    private int genre_count;
    
}
