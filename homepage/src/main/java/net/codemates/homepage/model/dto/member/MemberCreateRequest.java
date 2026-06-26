package net.codemates.homepage.model.dto.member;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import net.codemates.homepage.model.entity.Member;

@Getter
@Setter
public class MemberCreateRequest {
	
	/* メンバー登録を行うためのObjectを定義するクラス */
	
//	@NotBlank
//	@Size(max=50)
//	private String name;
	
	@NotBlank
	@Pattern(regexp="^[0-9]{2}[A-Z]{1}[0-9]{4}$",message="StudentID must be in the format 12A3456")
	private String studentId;
	
	@NotBlank
	@Email
	private String email;
	
//	@NotNull
//	@Min(1)
//	@Max(4)
//	private Short grade;
//	
//	@Size(max=50)
//	private String position;
	
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
