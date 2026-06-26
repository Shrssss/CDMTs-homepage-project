package net.codemates.homepage.model.dto.item;

import jakarta.validation.constraints.NotNull;
import net.codemates.homepage.model.entity.Item;

public class ItemRentRequest {
	
	/* 備品の貸し出し時に使うObjectを定義するクラス */

	@NotNull
	private Long id;
	
	@NotNull
	private Short quantity;
	
	@NotNull
	private Boolean isDisposable;
	
	@NotNull
	private Boolean isRentable;
	
	@NotNull
	private Long renterId;
	
	public Item toEntity() {
		
		return new Item(id,
						null,
						null,
						null,
						quantity,
						isDisposable,
						isRentable,
						renterId,
						null);
		
	}
	
}
