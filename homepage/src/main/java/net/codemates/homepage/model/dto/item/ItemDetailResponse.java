package net.codemates.homepage.model.dto.item;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ItemDetailResponse {
	
	/* 備品詳細を表示するためのObjectを定義するクラス */

	@NotNull
	private Long id;
	
	@NotBlank
	@Size(max=100)
	private String name;
	
	@NotBlank
	@Size(max=255)
	private String description;
	
	@NotBlank
	@Size(max=100)
	private String storageLocation;
	
	@NotNull
	private Short quantity;
	
	@NotNull
	private Boolean isDisposable;
	
	@NotNull
	private Boolean isRentable;
	
	private Long renterId;
	
}
