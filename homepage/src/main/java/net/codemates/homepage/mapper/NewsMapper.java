package net.codemates.homepage.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import net.codemates.homepage.model.entity.News;

@Mapper
public interface NewsMapper {
	
	List<News> findByIds(@Param("ids")List<Long> ids);
	
	News findByTitle(String title);
	
	List<News> findByCategories(@Param("categories")List<String> categories);
	
	List<News> findAll();
	
	void insert(News news);	//transactional
	
	void update(News news);	//transactional
	
	void updateIsPublishedById(Long id,Boolean isPublished);	//transactional
	
	void deleteById(Long id);	//transactional

}
