package net.codemates.homepage.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

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
	
//	private final PasswordEncoder passwordEncoder;
	
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
