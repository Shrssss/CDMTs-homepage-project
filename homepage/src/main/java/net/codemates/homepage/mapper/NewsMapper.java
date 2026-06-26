package net.codemates.homepage.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import net.codemates.homepage.model.entity.News;

@Mapper
public interface NewsMapper {
	
	News findById(Long id);
	
	List<News> serch(@Param("keyword")String keyword,@Param("categoryId")Long categoryId);
	
	List<News> findByCategories(@Param("categories")List<String> categories);
	
	List<News> findAll();
	
	int insert(News news);	//transactional
	
	int update(News news);	//transactional
	
	int updateIsPublishedById(Long id,Boolean isPublished);	//transactional
	
	int deleteById(Long id);	//transactional

}
