package net.codemates.homepage.model.dto.member;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MemberLoginRequest {
	
	/* ログイン時に必要なObjectを定義するクラス */
	
//	@NotBlank
//	@Email
//	private String email;
//	
//	@NotBlank
//	@Pattern(regexp="^[0-9]{2}[A-Z]{1}[0-9]{4}$",message="StudentID must be in the format 12A3456")
//	private String studentId;
	
	@NotBlank(message="Enter Student ID or Email.")
	private String identifier;
	
	@NotBlank
	@Size(min=10,max=72)
	private String password;
	
	public boolean isEmail(String identifier) {
		return identifier.contains("@");
	}
	
}
