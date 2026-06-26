package net.codemates.homepage.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import net.codemates.homepage.model.entity.Technology;

@Mapper
public interface TechnologyMapper {

	List<Technology> findByIds(@Param("ids")List<Long> ids);
	
	List<Technology> findByName(String name);
	
	List<Technology> findAll();
	
	void insert(Technology technology);	//transactional
	
	void update(Technology technology);	//transactional
	
	void deleteById(Long id);	//transactional
	
}
