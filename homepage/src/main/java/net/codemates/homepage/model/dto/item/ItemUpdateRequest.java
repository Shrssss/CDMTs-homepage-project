package net.codemates.homepage.model.dto.item;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import net.codemates.homepage.model.entity.Item;

public class ItemUpdateRequest {
	
	/* 備品状態更新を行うためのObjectを定義するクラス */

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
	
	public Item toEntity() {
		
		return new Item(id,
						name,
						description,
						storageLocation,
						quantity,
						isDisposable,
						isRentable,
						null,
						null);
		
	}
	
}
