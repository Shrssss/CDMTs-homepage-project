package net.codemates.homepage.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MemberTechnology {

	/*	member_technologisテーブルのレコードと対応したObjectを定義するクラス
	 * 
	 * 	テーブル member_technologies (技術)
	 * 			├─ member_id (メンバーID)				/BIGINT		/NOT NULL
	 * 		 	└─ technology_id (技術ID)			/BIGINT		/NOT NULL
	 * 
	 */
	
	private Long memberId;
	
	private Long technologyId;
	
}
