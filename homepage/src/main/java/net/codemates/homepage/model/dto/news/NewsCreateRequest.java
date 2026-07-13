package net.codemates.homepage.model.dto.news;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.codemates.homepage.model.entity.News;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NewsCreateRequest {
	
	/*　報告記事を投稿するためのpObjectを定義するクラス　*/
	
	@NotBlank
	@Size(max=100)
	private String title;
	
	@NotBlank
	private String content;
	
	private String thumbnailPath;
	
	@NotBlank
	@Size(max=30)
	private String category;
	
	@NotNull
	private Boolean isPublished;

	public News toEntity() {
		
		return new News(null,
						title,
						content,
						thumbnailPath,
						category,
						isPublished,
						null,
						null);
		
	}
	
}
