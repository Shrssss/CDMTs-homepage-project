package net.codemates.homepage.model.dto.member;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberPasswordUpdateRequest {
	
	@NotBlank
	@Size(min=10,max=72)
	private String oldPassword;
	
	@NotBlank 
	@Size(min=10,max=72)
	private String newPassword;
	
}
