package net.codemates.homepage.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import net.codemates.homepage.model.entity.News;

@Mapper
public interface NewsMapper {
	
	News findById(Long id);
	
	List<News> search(@Param("keyword")String keyword,@Param("categories")List<String> categories);
	
	List<News> findAll();
	
	int insert(News news);	//transactional
	
	int update(News news);	//transactional
	
	int updateIsPublishedById(@Param("id")Long id,@Param("isPublished")Boolean isPublished);	//transactional
	
	int deleteById(Long id);	//transactional

}
