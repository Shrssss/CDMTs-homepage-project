package net.codemates.homepage.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import net.codemates.homepage.model.entity.Technology;

@Mapper
public interface TechnologyMapper {

	Technology findById(Long id);
	
	List<Technology> findByName(@Param("name")String name,@Param("offset") int offset,@Param("limit") int limit);
	
	List<Technology> findAll();
	
	int insert(Technology technology);	//transactional
	
	int update(Technology technology);	//transactional
	
	int deleteById(Long id);	//transactional
	
}
