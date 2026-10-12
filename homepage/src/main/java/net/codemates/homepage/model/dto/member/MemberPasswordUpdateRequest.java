package net.codemates.homepage.model.dto.member;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberPasswordUpdateRequest {
	
	@NotNull
	private Long id;
	
	@NotBlank
	@Size(min=10,max=72)
	private String oldPassword;
	
	@NotBlank 
	@Size(min=10,max=72)
	private String newPassword;
	
}
