package net.codemates.homepage.model.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class News {
	
	/*	newsテーブルのレコードと対応したObjectを定義するクラス
	 * 
	 * 	テーブル　news　(活動報告)
	 * 			├─ id　(ニュースID)						/BIGSERIAL		/NOT NULL
	 * 			├─ title　(タイトル)					/VARCHAR(100)	/NOT NULL
	 * 			├─ content　(本文)					/TEXT			/NOT NULL
	 * 			├─ thumbnail_path　(サムネ画像のパス)	/VARCHAR(255)
	 * 			├─ category　(記事のカテゴリ)				/VARCHAR(30)	/NOT NULL
	 * 			├─ is_published　(公開されているかどうか)	/BOOLEAN		/NOT NULL	/DEFAULT FALSE
	 *    		├─ created_at　(投稿日時)				/TIMESTAMP					/DEFAULT CURRENT_TIMESTAMP
	 *    		└─ updated_at　(更新日時)				/TIMESTAMP
	 * 
	 */
	
	private Long id;
	
	private String title;
	
	private String content;
	
	private String thumbnailPath;
	
	private String category;
	
	private Boolean isPublished;
	
	private LocalDateTime createdAt;
	
	private LocalDateTime updatedAt;
	
}
