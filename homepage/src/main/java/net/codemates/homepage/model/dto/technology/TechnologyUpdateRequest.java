package net.codemates.homepage.model.dto.technology;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import net.codemates.homepage.model.entity.Technology;

public class TechnologyUpdateRequest {

	/* 技術の更新を行うためのObjectを定義するクラス　*/
	
	@NotNull
	private Long id;
	
	@NotBlank
	@Size(max=50)
	private String name;
	
	@NotBlank
	@Size(max=255)
	private String description;
	
	public Technology toEntity() {
		return new Technology(id,
							name,
							description);
	}
	
}
