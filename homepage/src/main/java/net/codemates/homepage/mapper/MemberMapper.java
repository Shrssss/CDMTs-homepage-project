package net.codemates.homepage.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import net.codemates.homepage.model.entity.Member;

@Mapper
public interface MemberMapper {

	Member findById(Long id);
	
	Member findByName(String name);
	
	Member findByGrade(Short grade);
	
	Member findByPosition(String Position);
	
	List<Member> findAll();
	
	void insert(Member member);
	
	void update(Member member);
	
	void deleteById(Long id);
	
}
