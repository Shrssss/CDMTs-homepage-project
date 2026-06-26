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
	
	//ページサイズの定義
	private static final int PAGE_SIZE=20;
	
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
	public NewsDetailResponse findNewsDetailById(Long id){
		
		News newsEntity=mapper.findById(id);
		
		if(newsEntity==null) throw new IllegalArgumentException("news not found. id="+id);
		
		return toDetailResponse(newsEntity);
		
	}
	
	/* キーワード・カテゴリ検索 */
	public List<NewsResponse> searchNews(String keyword,List<String> categories,Integer page) {
		
		int currentPage=(page==null||page<=0)?1:page;
		int offset=(currentPage-1)*PAGE_SIZE;
		
		List<News>newsEntities=mapper.search(keyword,categories,offset,PAGE_SIZE);
		
		return newsEntities.stream().map(this::toResponse).toList();
		
	}
	
	/* ニュース作成 */
	@Transactional
	public Long createNews(NewsCreateRequest newsDto) {
		
		News newsEntity=newsDto.toEntity();
		
		int insertCount=mapper.insert(newsEntity);
		
		if(insertCount!=1) throw new IllegalStateException("Expected 1 insert row but was "+insertCount+".");
		
		return newsEntity.getId();
		
	}
	
	/* ニュース更新 */
	@Transactional
	public int updateNews(NewsUpdateRequest newsDto) {
		
		News newsEntity=newsDto.toEntity();
		
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
	public int deleteNewsById(Long id) {
		
		int deleteCount=mapper.deleteById(id);
		
		if(deleteCount!=1) throw new IllegalStateException("Expected 1 delete row but was "+deleteCount+".");
		
		return deleteCount;
	}
	
	
}
