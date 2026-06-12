package net.codemates.homepage.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import net.codemates.homepage.model.entity.Member;

@Mapper
public interface MemberMapper {

	Member findById(Long id);
	
	List<Member> findByName(String name);
	
	List<Member> findByGrade(Short grade);
	
	List<Member> findByPosition(String Position);
	
	List<Member> findAll();
	
	void insert(Member member);
	
	void update(Member member);
	
	void deleteById(Long id);
	
}
