package net.codemates.homepage.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import net.codemates.homepage.mapper.MemberTechnologyMapper;
import net.codemates.homepage.mapper.TechnologyMapper;
import net.codemates.homepage.model.dto.member.MemberResponse;
import net.codemates.homepage.model.dto.technology.TechnologyCreateRequest;
import net.codemates.homepage.model.dto.technology.TechnologyDetailResponse;
import net.codemates.homepage.model.dto.technology.TechnologyResponse;
import net.codemates.homepage.model.dto.technology.TechnologyUpdateRequest;
import net.codemates.homepage.model.entity.Member;
import net.codemates.homepage.model.entity.Technology;

@Service
@RequiredArgsConstructor
public class TechnologyService {

	private final TechnologyMapper technologyMapper;
	
	private final MemberTechnologyMapper memberTechnologyMapper;
	
	private final int PAGE_SIZE=20;
	
	private TechnologyResponse toResponse(Technology technology) {
		return new TechnologyResponse(
				technology.getId(),
				technology.getName());
	}
	
	
	private TechnologyDetailResponse toDetailResponse(Technology technology) {
		return new TechnologyDetailResponse(
				technology.getId(),
				technology.getName(),
				technology.getDescription());
	}
	@Transactional
	public Long createTechnology(TechnologyCreateRequest technologyDto) {
		
		Technology technologyEntity=technologyDto.toEntity();
		
		int insertCount=technologyMapper.insert(technologyEntity);
		
		if(insertCount!=1) throw new RuntimeException("Expected 1 insert row but was "+insertCount+".");
		
		return technologyEntity.getId();
		
	}
	
	@Transactional
	public int updateTechnology(Long id,TechnologyUpdateRequest technologyDto) {
		
		technologyDto.setId(id);
		
		int updateCount=technologyMapper.update(technologyDto.toEntity());
		
		if(updateCount!=1) throw new RuntimeException("Expected 1 updated row but was "+updateCount+".");
		
		return updateCount;
		
	}
	
	public List<TechnologyResponse> searchTechnologies(String name,Integer page){
		
		int currentPage=(page==null || page<1)?1:page;
		int offset=(currentPage-1)*PAGE_SIZE;
		
		List<Technology> technologies=technologyMapper.findByName(name,offset,PAGE_SIZE);
		
		return technologies.stream().map(this::toResponse).toList();
		
	}
	
	public TechnologyDetailResponse getTechnologyDetail(Long id) {
		
		Technology technologyEntity=technologyMapper.findById(id);
		
		if(technologyEntity==null) throw new RuntimeException("Technology not found. id="+id);
		
		return toDetailResponse(technologyEntity);
		
	}
	
	public List<MemberResponse> getSkilledMember(Long id){
		
		List<Member> memberEntities=memberTechnologyMapper.findByMembersByTechnologyIds(List.of(id));
		
		return memberEntities.stream()
				.map(member->new MemberResponse(
						member.getId(),
						member.getName(),
						member.getGrade(),
						member.getPosition()
				)).toList();
		
	}
	
	public int deleteTechnology(Long id) {
		
		int deleteCount=technologyMapper.deleteById(id);
		
		if(deleteCount!=1) throw new RuntimeException("Expected 1 delete row but was "+deleteCount+".");
		
		return deleteCount;
		
	}
	
}
