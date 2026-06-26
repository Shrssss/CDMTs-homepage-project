package net.codemates.homepage.model.dto.technology;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import net.codemates.homepage.model.entity.Technology;

public class TechnologyCreateRequest {

	/*　技術の登録を行うためのObjectを定義するクラス　*/
	
	@NotBlank
	@Size(max=50)
	private String name;
	
	@NotBlank
	@Size(max=255)
	private String description;
	
	public Technology toEntity() {
		return new Technology(null,
							name,
							description);
	}
	
}
