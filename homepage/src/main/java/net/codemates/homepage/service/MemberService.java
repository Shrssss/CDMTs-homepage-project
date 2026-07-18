package net.codemates.homepage.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import net.codemates.homepage.mapper.MemberMapper;
import net.codemates.homepage.model.dto.member.MemberLoginRequest;
import net.codemates.homepage.model.entity.Member;

@Service
@RequiredArgsConstructor
public class MemberService {

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
	
	private final MemberMapper mapper;
	
//	private final PasswordEncoder passwordEncoder;
	
	
	//未完成
	//JWT or Spring Session
	//要検討
//	public Long login(MemberLoginRequest memberDto) {
//		
//		Member memberEntity=mapper.findByStudentIdOrEmial(memberDto.getIdentifier());
//		
//		if(memberEntity==null) throw new IllegalArgumentException("Login Failed");
//		
//		if(!passwordEncoder.matches(memberDto.getPassword(),memberEntity.getPasswordHash())) {
//			throw new IllegalArgumentException("Login Failed");
//		}
//		
//		return memberEntity.getId();
//	}
	
}
