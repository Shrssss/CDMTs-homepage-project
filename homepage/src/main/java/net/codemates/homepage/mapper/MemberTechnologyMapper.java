package net.codemates.homepage.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import net.codemates.homepage.model.entity.Member;
import net.codemates.homepage.model.entity.MemberTechnology;
import net.codemates.homepage.model.entity.Technology;

@Mapper
public interface MemberTechnologyMapper {
	
	List<Technology> findByTechnologiesByMemberIds(@Param("memberIds")List<Long> memberIds);
	
	List<Member> findByMembersByTechnologyIds(@Param("technologyIds")List<Long> technologyIds);
	
	void insert(MemberTechnology memberTechnology);	//transactional
	
	void delete(Long memberId,Long technologyId);	//transactional
}
