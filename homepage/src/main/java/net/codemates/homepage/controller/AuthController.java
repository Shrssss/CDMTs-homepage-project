package net.codemates.homepage.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

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
	
    /*
     * メンバーログアウト
     * 
     * メソッド名 	: logoutMember
     * 戻り値		: Long id
     * 引数		: 
     * 
     * 		POST /api/auth/logout
     * 
     */
	
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
	
}
