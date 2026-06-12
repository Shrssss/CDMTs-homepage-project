package net.codemates.homepage.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import net.codemates.homepage.model.entity.News;

@Mapper
public interface NewsMapper {
	
	News findById(Long id);
	
	News findByTitle(String title);
	
	News findBycontent(String content);
	
	List<News> findAll();
	
	void insert(News news);
	
	void update(News news);
	
	void deleteById(Long id);

}
