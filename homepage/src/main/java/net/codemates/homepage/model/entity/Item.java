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
public class Item {
	
	/*	itemsテーブルのレコードと対応したObjectを定義するクラス
	 * 
	 * 	テーブル　items (備品)
	 * 			├─ id　(備品ID)						/BIGSERIAL		/NOT NULL
	 * 			├─ name　(備品名)						/VARCHAR(100)	/NOT NULL
	 * 			├─ description　(説明)				/VARCHAR(255)	/NOT NULL
	 * 			├─ storage_location　(保管場所)		/VARCHAR(100)	/NOT NULL
	 * 			├─ quantity　(在庫数)					/SMALLINT		/NOT NULL
	 * 			├─ is_disposable　(消費物かどうか)		/BOOLEAN		/NOT NULL	/DEFAULT FALSE
	 *    		├─ is_rentable　(借りることができるかどうか)	/BOOLEAN		/NOT NULL	/DEFAULT FALSE
	 *    		├─ renter_id　(借主のID)				/BIGINT						/FOREIGN KEY members(id) 
	 *    		└─ rented_at (貸し出し日時)			/TIMESTAMP
	 * 
	 */
	
	private Long id;
	
	private String name;
	
	private String description;
	
	private String storageLocation;
	
	private Short quantity;
	
	private Boolean isDisposable;
	
	private Boolean isRentable;
	
	private Long renterId;
	
	private LocalDateTime rentedAt;
	
}
