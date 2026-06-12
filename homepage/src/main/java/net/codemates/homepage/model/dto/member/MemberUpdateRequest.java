package net.codemates.homepage.model.dto.member;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class MemberUpdateRequest {
	
	/*	メンバー情報更新を行うためのObjectを定義するクラス */
	
	@NotBlank
	@Size(max=50)
	private String name;
	
	@NotBlank
	@Email
	private String email;
	
	@NotBlank
	@Pattern(regexp="^[0-9]{2}[A-Z]{1}[0-9]{4}$",message="StudentID must be in the format 12A3456")
	private String studentId;
	
	@NotNull
	@Min(1)
	@Max(4)
	private Short grade;
	
	@Size(max=50)
	private String position;
	
	@NotBlank
	@Size(min=10,max=72)
	private String password;
	
	//後で使える技術入れる　-> 技術を加えたりする奴が必要（Notionみたいな）

}
