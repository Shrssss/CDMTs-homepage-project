package net.codemates.homepage.model.dto.technology;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class TechnologyResponse {

	/*　技術の一覧を表示するためのObjectを定義するクラス　*/
	
	@NotNull
	private Long id;
	
	@NotBlank
	@Size(max=50)
	private String name;
	
}
