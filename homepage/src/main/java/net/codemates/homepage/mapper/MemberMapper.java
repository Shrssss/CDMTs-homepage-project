package net.codemates.homepage.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import net.codemates.homepage.model.entity.Member;

@Mapper
public interface MemberMapper {

	List<Member> findByIds(@Param("ids")List<Long> ids);
	
	List<Member> findByName(String name);
	
	List<Member> findByGrades(@Param("grades")List<Short> grades);
	
	List<Member> findByPositions(@Param("positions")List<String> positions);
	
	List<Member> findAll();
	
	void insert(Member member);	//transactional
	
	void update(Member member);	//transactional
	
	void updateByGrade(Short grade);	//transactional
	
	void deleteById(Long id);	//transactional
	
}
