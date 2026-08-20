package net.codemates.homepage.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import net.codemates.homepage.model.entity.Member;

@Mapper
public interface MemberMapper {

	Member findById(Long id);
	
	List<Member> search(String name,
							@Param("grades")List<Short> grades,
							@Param("positions")List<String> positions,
							@Param("offset") int offset,
				            @Param("limit") int limit);
	
	Member findByStudentIdOrEmial(@Param("identifier")String identifier);
	
	void insert(Member member);	//transactional
	
	int update(Member member);	//transactional
	
	int updateByGrade(Short grade);	//transactional
	
	int deleteById(Long id);	//transactional
	
}
