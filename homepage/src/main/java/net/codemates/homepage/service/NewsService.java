package net.codemates.homepage.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import net.codemates.homepage.mapper.NewsMapper;
import net.codemates.homepage.model.dto.news.NewsCreateRequest;
import net.codemates.homepage.model.dto.news.NewsDetailResponse;
import net.codemates.homepage.model.dto.news.NewsResponse;
import net.codemates.homepage.model.dto.news.NewsUpdateRequest;
import net.codemates.homepage.model.entity.News;

@Service
@RequiredArgsConstructor
public class NewsService {

    /*
     * Service層(News)
     * 
     * 画面 -> DB
     * 		Controllerから受け取ったDTOをEntityへ変換し、
     *	 	Mapperを呼び出してDBを操作する。
     *
     * DB -> 画面
     * 		DBから取得したEntityは、そのままControllerへ返さず、
     * 		ResponseDTOへ変換して返す。
     * 
     */
	
	//Mapperを注入する
	private final NewsMapper mapper;
	
    /*
     * News(Entity) → NewsResponse(DTO)
     *
     * 		一覧表示用DTOへ変換するメソッド。
     * 
     */
	private NewsResponse toResponse(News news) {
		return new NewsResponse(
				news.getTitle(),
				news.getThumbnailPath(),
				news.getCategory(),
				news.getIsPublished(),
				news.getCreatedAt());
	}
	
    /*
     * News(Entity) -> NewsDatailResponse(DTO)
     *
     * 		詳細表示用DTOへ変換するメソッド。
     * 
     */
	private NewsDetailResponse toDetailResponse(News news) {
		return new NewsDetailResponse(news.getTitle(),
				news.getContent(),
				news.getThumbnailPath(),
				news.getCategory(),
				news.getIsPublished(),
				news.getCreatedAt(),
				news.getUpdatedAt());
	}
	
    /* IDからニュース詳細を取得 */
	public NewsDetailResponse findNewsDetail(Long id){
		
		News newsEntity=mapper.findById(id);
		
		if(newsEntity==null) throw new IllegalArgumentException("news not found. id="+id);
		
		return toDetailResponse(newsEntity);
		
	}
	
	/* キーワード・カテゴリ検索 */
	public List<NewsResponse> serchNews(String keyword,List<String> categories) {
		
		List<News>newsEntities=mapper.search(keyword,categories);
		
		return newsEntities.stream().map(this::toResponse).toList();
		
	}
	
	/*  全ニュース取得 */
	public List<NewsResponse> findAllNews(){
		
		List<News>newsEntities=mapper.findAll();
		
		return newsEntities.stream().map(this::toResponse).toList();
		
	}
	
	/* ニュース作成 */
	@Transactional
	public Long createNews(NewsCreateRequest newsDto) {
		
		News newsEntity=new News(null,
									newsDto.getTitle(),
									newsDto.getContent(),
									newsDto.getThumbnailPath(),
									newsDto.getCategory(),
									newsDto.getIsPublished(),
									null,
									null);
		
		int insertCount=mapper.insert(newsEntity);
		
		if(insertCount!=1) throw new IllegalStateException("Expected 1 insert row but was "+insertCount+".");
		
		return newsEntity.getId();
		
	}
	
	/* ニュース更新 */
	@Transactional
	public int updateNews(NewsUpdateRequest newsDto) {
		
		News newsEntity=new News(newsDto.getId(),
									newsDto.getTitle(),
									newsDto.getContent(),
									newsDto.getThumbnailPath(),
									newsDto.getCategory(),
									newsDto.getIsPublished(),
									null,
									null);
		
		int updateCount=mapper.update(newsEntity);
		
		if(updateCount!=1) throw new IllegalStateException("Expected 1 updated row but was "+updateCount+".");
		
		return updateCount;
	}
	
	/* 公開状態の変更 */
	@Transactional
	public int updateIsPublishedById(Long id,Boolean isPublished) {
		
		int updateCount=mapper.updateIsPublishedById(id,isPublished);
		
		if(updateCount!=1) throw new IllegalStateException("Expected 1 updated row but was "+updateCount+".");
		
		return updateCount;
	}
	
	/* ニュース削除 */
	@Transactional
	public int deleteById(Long id) {
		
		int deleteCount=mapper.deleteById(id);
		
		if(deleteCount!=1) throw new IllegalStateException("Expected 1 delete row but was "+deleteCount+".");
		
		return deleteCount;
	}
	
	
}
