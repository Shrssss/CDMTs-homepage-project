package net.codemates.homepage.model.dto.member;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import net.codemates.homepage.model.entity.Member;

public class MemberLoginRequest {
	
	/* ログイン時に必要なObjectを定義するクラス */
	
	@NotBlank
	@Email
	private String email;
	
	@NotBlank
	@Pattern(regexp="^[0-9]{2}[A-Z]{1}[0-9]{4}$",message="StudentID must be in the format 12A3456")
	private String studentId;
	
	@NotBlank
	@Size(min=10,max=72)
	private String password;
	
	public Member toEntity(String passwordHash) {
		return new Member(null,
							null,
							studentId,
							email,
							null,
							null,
							passwordHash,
							null,
							null);
	}
	
}
