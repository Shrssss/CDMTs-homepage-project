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
public class ItemRentalHistory {
	
	/*	ItemRentalHistoriesテーブルのレコードと対応したObjectを定義するクラス
	 * 
	 * 	テーブル item_rental_histories (貸し出し履歴)
	 * 			├─ id (履歴ID)						/BIGSERIAL		/NOT NULL
	 * 			├─ item_id (備品ID)					/BIGINT			/NOT NULL	/FOREIGN KEY items(id)
	 * 		 	├─ renter_id (メンバーID)				/BIGINT			/NOT NULL	/FOREIGN KEY members(id)
	 *  		├─ rented_at (貸し出し日時)			/TIMESTAMP		/NOT NULL	/DEFAULT CURRENT_TIMESTAMP
	 *			└─ returned_at (返却日時)				/TIMESTAMP
	 * 
	 */
	
	private Long id;
	
	private Long itemId;
	
	private Long renterId;
	
	private LocalDateTime rentedAt;
	
	private LocalDateTime returnedAt;
	
}
