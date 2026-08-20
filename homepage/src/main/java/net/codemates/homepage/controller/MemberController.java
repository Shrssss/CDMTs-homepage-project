package net.codemates.homepage.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.codemates.homepage.model.dto.member.MemberDetailResponse;
import net.codemates.homepage.model.dto.member.MemberResponse;
import net.codemates.homepage.model.dto.member.MemberUpdateRequest;
import net.codemates.homepage.service.MemberService;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins=" !! placeHolder !! ")
@RequiredArgsConstructor
public class MemberController {
	
	private final MemberService memberService;
	
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
	@GetMapping
	public List<MemberResponse> searchMember(@RequestParam(required=false) String name,
												@RequestParam(required=false) List<Short> grades,
												@RequestParam(required=false) List<String> positions,
												@RequestParam(defaultValue="1") Integer page) {
		
		return memberService.searchMember(name,grades,positions,page);
		
	}
	
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
	@GetMapping("/{id}")
	public MemberDetailResponse getMemberDetail(@PathVariable Long id) {
		
		return memberService.getMemberDetail(id);
		
	}
	
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
	@PutMapping("/{id}")
	public void updateMember(@PathVariable Long id, @Valid @RequestBody MemberUpdateRequest memberDto) {
		
		memberService.updateMember(id,memberDto);
		
	}
	
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
//	
//	@DeleteMapping("/{id}")
//	public void deleteMember(@PathVariable Long id) {
//		
//		memberService.deleteMember(id);
//		
//	}
	
}
