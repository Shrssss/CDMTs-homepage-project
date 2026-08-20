package net.codemates.homepage.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import net.codemates.homepage.model.entity.Member;

@Mapper
public interface MemberMapper {

	Member findById(@Param("id")Long id);
	
	List<Member> search(String name,
							@Param("grades")List<Short> grades,
							@Param("positions")List<String> positions,
							@Param("offset") int offset,
				            @Param("limit") int limit);
	
	Member findByStudentIdOrEmial(@Param("identifier")String identifier);
	
	void insert(Member member);	//transactional
	
	void update(Member member);	//transactional
	
	void updateByGrade(Short grade);	//transactional
	
	void deleteById(Long id);	//transactional
	
}
