package net.codemates.homepage.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.codemates.homepage.model.dto.member.MemberCreateRequest;
import net.codemates.homepage.model.dto.member.MemberLoginRequest;
import net.codemates.homepage.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor 
public class AuthController {
	
	private final AuthService authService;

    /*
     * メンバー作成
     * 
     * メソッド名 	: createMember
     * 戻り値		: Long id
     * 引数		: MemberCreateRequest
     * 
     * 		POST /api/auth
     * 
     */
	@PostMapping
	public Long createMember(@Valid @RequestBody MemberCreateRequest memberDto) {
		
		return authService.createMember(memberDto);
		
	}
	
    /*
     * メンバーログイン 
     * 
     * メソッド名 	: loginMember
     * 戻り値		: Long id
     * 引数		: MemberLoginRequest
     * 
     * 		POST /api/auth/login
     * 
     */
	@PostMapping("/login")
	public Long loginMember(@Valid @RequestBody MemberLoginRequest memberDto,
								HttpServletRequest request,
								HttpServletResponse response) {
		
		return authService.login(memberDto,request,response);
	}
	
    /*
     * パスワード更新
     * 
     * メソッド名 	: updatePassword
     * 戻り値		: Long id
     * 引数		: Long id, String oldPassword, String newPassword
     * 
     * 		POST /api/auth/{id}/passUpdate
     * 
     */
	@PostMapping("/{id}/passUpdate")
	public Long updatePassword(@PathVariable Long id,@RequestParam String oldPassword,@RequestParam String newPassword) {
		
		return authService.updatePassword(id,oldPassword,newPassword);
		
	}
	
}
