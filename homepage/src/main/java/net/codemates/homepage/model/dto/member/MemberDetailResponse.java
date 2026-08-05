package net.codemates.homepage.model.dto.member;

import java.util.List;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import net.codemates.homepage.model.dto.technology.TechnologyResponse;

public class MemberDetailResponse {
	
	/* メンバー詳細を表示するためのObjectを定義するクラス */
	
	@NotNull
	private Long id;
	
	@NotBlank
	@Size(max=50)
	private String name;
	
	@NotNull
	@Min(1)
	@Max(4)
	private Short grade;
	
	@Size(max=50)
	private String position;
	
	//以降TechnologyMap
	List<TechnologyResponse> technologies;
	
}
