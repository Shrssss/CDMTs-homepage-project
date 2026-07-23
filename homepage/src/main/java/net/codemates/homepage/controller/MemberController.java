package net.codemates.homepage.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/members")
public class MemberController {
	
	/*	必要な機能
	 * 
	 * 		メンバー登録
	 * 
	 * 		メンバー検索
	 * 			├─ 全体表示
	 *  		├─ フィルター機能
	 * 			└─ 文字列検索
	 * 
	 * 		メンバー情報
	 * 			├─　詳細表示
	 * 			└─ 情報更新
	 * 
	 */
	
    /*
     * メンバー作成    （作らないでいい）
     * 
     * メソッド名 	: createMember
     * 戻り値		: Long id
     * 引数		: MemberCreateRequest
     * 
     * 		POST /api/members
     * 
     */
	
    /*
     * メンバーログイン    （作らないでいい）
     * 
     * メソッド名 	: loginMember
     * 戻り値		: Long id
     * 引数		: MemberLoginRequest
     * 
     * 		POST /api/members/login
     * 
     */
	
    /*
     * メンバー検索
     * 
     * メソッド名 	: searchMember
     * 戻り値		: List<MemberResponse>
     * 引数		: String name,List<Short> grades,List<String> positions,Integer page
     * 
     * 		GET /api/members
     * 
     */
	
    /*
     * メンバー詳細表示
     * 
     * メソッド名 	: getMemberDetail
     * 戻り値		: MemberDetailResponse
     * 引数		: Long id
     * 
     * 		GET /api/members/{id}
     * 
     */
	
    /*
     * メンバー編集
     * 
     * メソッド名 	: updateMember
     * 戻り値		: void
     * 引数		: MemberUpdateRequest
     * 
     * 		PUT /api/members/{id}
     * 
     */
	
    /*
     * メンバー削除
     * 
     * メソッド名 	: deleteMember
     * 戻り値		: void
     * 引数		: Long id
     * 
     * 		DELETE /api/members/{id}
     * 
     */
}
