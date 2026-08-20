package net.codemates.homepage.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import net.codemates.homepage.mapper.MemberMapper;
import net.codemates.homepage.mapper.MemberTechnologyMapper;
import net.codemates.homepage.model.dto.member.MemberDetailResponse;
import net.codemates.homepage.model.dto.member.MemberResponse;
import net.codemates.homepage.model.dto.member.MemberUpdateRequest;
import net.codemates.homepage.model.dto.technology.TechnologyResponse;
import net.codemates.homepage.model.entity.Member;
import net.codemates.homepage.model.entity.Technology;

@Service
@RequiredArgsConstructor
public class MemberService {
	
	private final MemberMapper memberMapper;
	private final MemberTechnologyMapper memberTechnologyMapper;
	
	private static final int PAGE_SIZE=20;
	
	private MemberResponse toResponse(Member member) {
		return new MemberResponse(
				member.getId(),
				member.getName(),
				member.getGrade(),
				member.getPosition());
	}
	
	private MemberDetailResponse toDetailResponse(Member member,List<Technology> technologies) {
		return new MemberDetailResponse(
				member.getId(),
				member.getName(),
				member.getGrade(),
				member.getPosition(),
				technologies.stream()
					.map(tech->new TechnologyResponse(tech.getId(),tech.getName()))
					.toList()
				);
	}
	
	public List<MemberResponse> searchMember(String name,List<Short> grades,List<String> positions,Integer page){
		
		int currentPage=(page==null||page<=0)?1:page;
		int offset=(currentPage-1)*PAGE_SIZE;
		
		List<Member>memberEntities=memberMapper.search(name,grades,positions,offset,PAGE_SIZE);
		
		return memberEntities.stream()
				.map(this::toResponse)
				.toList();
	}
	
	public MemberDetailResponse getMemberDetail(Long id) {
		
		Member memberEntity=memberMapper.findById(id);
		
		if(memberEntity==null) throw new IllegalArgumentException("member not found. memberId="+id);
		
		List<Technology> technologyEntities=memberTechnologyMapper.findByTechnologiesByMemberIds(List.of(id));
		
		return toDetailResponse(memberEntity,technologyEntities);
		
	}
	
	@Transactional
	public int updateMember(Long id,MemberUpdateRequest memberDto) {
		
		memberDto.setId(id);
		
		int updateCount=memberMapper.update(memberDto.toEntity());
		
		if(updateCount!=1) throw new IllegalStateException("Expected 1 updated row but was "+updateCount+".");
		
		return updateCount;
		
	}
	
	@Transactional
	public int deleteMember(Long id) {
		
		int deleteCount=memberMapper.deleteById(id);
		
		if(deleteCount!=1) throw new IllegalStateException("Expected 1 deleted row but was "+deleteCount+".");
		
		return deleteCount;
		
	}
	
}
