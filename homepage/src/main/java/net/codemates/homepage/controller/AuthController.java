package net.codemates.homepage.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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
import net.codemates.homepage.model.dto.member.MemberPasswordUpdateRequest;
import net.codemates.homepage.model.dto.member.MemberResponse;
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
     * 引数		: MemberPasswordUpdateRequest
     * 
     * 		POST /api/auth/{id}/passUpdate
     * 
     */
	
	@PostMapping("/{id}/passUpdate")
	public Long updatePassword(@PathVariable Long id,@Valid @RequestBody MemberPasswordUpdateRequest memberDto) {
		
		return authService.updatePassword(id,memberDto);
		
	}
	
    /*
     * ユーザー承認
     * 
     * メソッド名 	: approveMember
     * 戻り値		: Long id
     * 引数		: Long id
     * 
     * 		POST /api/auth/{id}/approve
     * 
     */
	@PatchMapping("/{id}/approve")
	public Long approveMember(@PathVariable Long id) {
		
		return authService.approveMember(id);
		
	}
	
    /*
     * 非承認ユーザーの表示
     * 
     * メソッド名 	: getUnApprovedMember
     * 戻り値		: List<MemberDetailResponse>
     * 引数		: 
     * 
     * 		GET /api/auth
     * 
     */
	@GetMapping
	public List<MemberResponse> getUnApprovedMember(){
		
		return authService.getUnApprovedMember();
		
	}
	
    /*
     * セッションに保存されているユーザのID取得
     * 
     * メソッド名 	: getCurrentMemberId
     * 戻り値		: Long id
     * 引数		: Authentication auth
     * 
     * 		GET /api/auth/me
     * 
     */
	@GetMapping("/me")
	public Long getCurrentMemberId(Authentication auth) {
		
		return authService.getCurrentMemberId(auth);
		
	}
	
    /*
     * メンバーのroleを更新
     * 
     * メソッド名 	: updateMemberRole
     * 戻り値		: Long id
     * 引数		: Long id,String role
     * 
     * 		PATCH /api/auth/admin/{id}
     * 
     */
	@PatchMapping("/admin/{id}")
	public Long updateMemberRole(@PathVariable Long id,@RequestParam String role) {
		
		return authService.updateMemberRole(id,role);
		
	}
	
    /*
     * CSRFトークンの発行
     * 
     * メソッド名 	: getCsrfToken
     * 戻り値		: void
     * 
     * 		GET /api/auth/csrf
     * 
     * 		レスポンスのSet-Cookie(XSRF-TOKEN)でトークンを発行する。
     * 		アプリ起動時、ログイン後、ログアウト後に呼ぶ。
     * 
     */
	@GetMapping("/csrf")
	public void getCsrfToken() {
		//CsrfCookieFilterがCookieを出力するため、処理は不要
	}
	
}
