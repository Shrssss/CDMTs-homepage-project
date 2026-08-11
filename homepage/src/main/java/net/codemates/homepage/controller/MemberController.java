package net.codemates.homepage.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/members")
public class MemberController {
	
	
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
	
//		※作成後コメントアウト(使わないが一応書く)
//    /*
//     * メンバー削除
//     * 
//     * メソッド名 	: deleteMember
//     * 戻り値		: void
//     * 引数		: Long id
//     * 
//     * 		DELETE /api/members/{id}
//     * 
//     */
}
