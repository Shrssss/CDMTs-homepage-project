package net.codemates.homepage.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import net.codemates.homepage.model.entity.News;

@Mapper
public interface NewsMapper {
	
	News findById(Long id);
	
	News findByTitle(String title);
	
	List<News> findByCategory(String category);
	
	List<News> findAll();
	
	void insert(News news);	//transactional
	
	void update(News news);	//transactional
	
	void updateIsPublishedById(Long id,Boolean isPublished);	//transactional
	
	void deleteById(Long id);	//transactional

}
