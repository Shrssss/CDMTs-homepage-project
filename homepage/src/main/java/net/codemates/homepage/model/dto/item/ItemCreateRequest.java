package net.codemates.homepage.model.dto.item;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ItemCreateRequest {
	
	/* 備品追加を行うためのObjectを定義するクラス */
	
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
	
}
