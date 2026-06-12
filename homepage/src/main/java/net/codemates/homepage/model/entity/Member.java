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
public class Member {
	
	/*	membersテーブルのレコードと対応したObjectを定義するクラス
	 * 
	 * 	テーブル members (メンバー)
	 * 			├─ id (メンバーID)						/BIGSERIAL		/NOT NULL
	 * 			├─ name (名前)						/VARCHAR(50)	/NOT NULL
	 * 		 	├─ student_id (学生証番号)			/VARCHAR(50)	/NOT NULL	/UNIQUE
	 * 			├─ email (メールアドレス)				/VARCHAR(255)	/NOT NULL	/UNIQUE
	 * 			├─ grade (学年)						/SMALLINT		/NOT NULL
	 *  		├─ position (役職)					/VARCHAR(50)
	 *  		├─ password_hash (パスワードのハッシュ値)	/VARCHAR(255)	/NOT NULL
	 *  		├─ created_at (登録日時)				/TIMESTAMP
	 *			└─ updated_at (更新日時)				/TIMESTAMP					/DEFAULT CURRENT_TIMESTAMP
	 * 
	 */
	
	private Long id;
	
	private String name;
	
	private String studentId;
	
	private String email;
	
	private Short grade;
	
	private String position;
	
	private String passwordHash;
	
	private LocalDateTime createdAt;
	
	private LocalDateTime updatedAt;
	
}
