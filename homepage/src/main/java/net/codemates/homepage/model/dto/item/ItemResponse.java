package net.codemates.homepage.model.dto.item;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class ItemResponse {
	
	/* 全備品の表示を行うためのObjectを定義するクラス */

	@NotNull
	private Long id;
	
	@NotBlank
	@Size(max=100)
	private String name;
	
	@NotBlank
	@Size(max=100)
	private String storageLocation;
	
	@NotNull
	private Boolean isDisposable;
	
	@NotNull
	private Boolean isRentable;
	
}
