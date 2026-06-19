package net.codemates.homepage.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Technology {
	
	/*	technologiesテーブルのレコードと対応したObjectを定義するクラス
	 * 
	 * 	テーブル technologies (技術)
	 * 			├─ id (技術ID)						/BIGSERIAL		/NOT NULL
	 * 			├─ name (技術名)						/VARCHAR(50)	/NOT NULL
	 * 		 	└─ description (詳細)				/VARCHAR(255)	/NOT NULL
	 * 
	 */
	
	private Long id;
	
	private String name;
	
	private String description;
	
}
