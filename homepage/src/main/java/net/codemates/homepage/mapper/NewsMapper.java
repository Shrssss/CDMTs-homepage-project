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
	
	void insert(News news);
	
	void update(News news);
	
	void updateIsPublishedById(Long id,Boolean isPublished);
	
	void deleteById(Long id);

}
