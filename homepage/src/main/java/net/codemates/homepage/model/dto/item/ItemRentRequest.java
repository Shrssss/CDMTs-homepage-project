package net.codemates.homepage.model.dto.item;

import jakarta.validation.constraints.NotNull;

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
	
}
