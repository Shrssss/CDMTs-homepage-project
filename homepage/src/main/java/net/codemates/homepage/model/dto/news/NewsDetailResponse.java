package net.codemates.homepage.model.dto.news;

import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class NewsDetailResponse {

/*　記事の詳細を表示するためのObjectを定義するクラス */

	@NotBlank
	@Size(max=100)
	private String title;
	
	private String thumbnail_path;
	
	@NotBlank
	@Size(max=30)
	private String category;
	
	@NotNull
	private Boolean isPublished;
	
	@NotNull
	@DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
	private LocalDateTime createdAt;
	
}
